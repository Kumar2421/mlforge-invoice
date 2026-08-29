import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { renderTemplate, sendReminderEmail, type ReminderVars } from "@/lib/email";

// Scheduled via netlify.toml (@hourly) and vercel.json. Authenticated with CRON_SECRET.
export async function POST(request: NextRequest) {
  return authorizeAndRun(request);
}
export async function GET(request: NextRequest) {
  return authorizeAndRun(request);
}

function authorizeAndRun(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }
  return processReminders();
}

function toneToDefaultSubject(day: number) {
  return day <= 3
    ? "Friendly reminder: invoice {{invoice}} is overdue"
    : day <= 7
      ? "Payment overdue: invoice {{invoice}} ({{amount}})"
      : "Final notice: invoice {{invoice}} is {{amount}} overdue";
}

function toneToDefaultBody(day: number) {
  if (day <= 3)
    return "Hi {{client}},\n\nJust a gentle reminder that invoice {{invoice}} for {{amount}} is now past its due date. If it's already on the way, thank you — please ignore this.\n\nThanks,\n{{sender}}";
  if (day <= 7)
    return "Hi {{client}},\n\nInvoice {{invoice}} for {{amount}} is now a week overdue. Please arrange payment at your earliest convenience.\n\nThanks,\n{{sender}}";
  return "Hi {{client}},\n\nThis is a final reminder that invoice {{invoice}} for {{amount}} is now two weeks overdue. Please settle it promptly.\n\nThanks,\n{{sender}}";
}

async function processReminders() {
  const supabase = createAdminClient();

  // B3: refuse to run if another sweep holds the advisory lock.
  const { data: lock } = await supabase.rpc("try_lock_reminder_sweep");
  if (lock !== true) {
    return NextResponse.json({ status: "skipped", reason: "another sweep is running" });
  }

  try {
    // B3: mark stuck deliveries so they aren't silently retried.
    await supabase.rpc("reconcile_stuck_reminder_deliveries");

    const { data: sequences, error } = await supabase
      .from("reminder_sequences")
      .select("*, invoices!inner(*), clients!inner(*)")
      .eq("status", "active");

    if (error) {
      console.error("Error fetching sequences", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const processed: string[] = [];
    const senderByOrg = new Map<string, { name: string; email: string; replyTo: string }>();
    const templatesByOrg = new Map<string, Map<number, { subject: string; body: string }>>();

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000";

    for (const seq of sequences || []) {
      const { data: pendingStages } = await supabase
        .from("reminder_stages")
        .select("*")
        .eq("sequence_id", seq.id)
        .eq("status", "pending")
        .lte("scheduled_for", new Date().toISOString())
        .order("day", { ascending: true })
        .limit(1);

      if (!pendingStages || pendingStages.length === 0) continue;

      const stage = pendingStages[0];
      const toEmail: string | undefined = seq.clients?.email;

      // CAN-SPAM: honour opt-outs.
      if (toEmail) {
        const { data: optOut } = await supabase
          .from("email_unsubscribes")
          .select("id")
          .eq("email", toEmail)
          .maybeSingle();
        if (optOut) {
          await supabase
            .from("reminder_stages")
            .update({ status: "failed", error_message: "Recipient unsubscribed" })
            .eq("id", stage.id);
          continue;
        }
      }

      // B3: idempotency lock — insert-or-skip on (invoice_id, reminder_stage_id).
      const { error: lockError } = await supabase.from("reminder_delivery_logs").insert({
        organization_id: seq.organization_id,
        invoice_id: seq.invoice_id,
        reminder_stage_id: stage.id,
        status: "pending",
      });
      if (lockError) {
        console.warn(`Skipping duplicate reminder for stage ${stage.id}`);
        continue;
      }

      // Sender identity — per organization.
      let sender = senderByOrg.get(seq.organization_id);
      if (!sender) {
        const { data: settings } = await supabase
          .from("account_settings")
          .select("sender_name, sender_email, reply_to_email")
          .eq("organization_id", seq.organization_id)
          .maybeSingle();
        sender = {
          name: settings?.sender_name?.trim() || "Payment Reminders",
          email: settings?.sender_email?.trim() || "onboarding@resend.dev",
          replyTo: settings?.reply_to_email?.trim() || settings?.sender_email?.trim() || "",
        };
        senderByOrg.set(seq.organization_id, sender);
      }

      // B4: per-stage template, then org default template, then hardcoded fallback.
      let orgTemplates = templatesByOrg.get(seq.organization_id);
      if (!orgTemplates) {
        const { data: tpls } = await supabase
          .from("reminder_templates")
          .select("day, subject, body")
          .eq("organization_id", seq.organization_id);
        orgTemplates = new Map((tpls ?? []).map((t) => [t.day, { subject: t.subject, body: t.body }]));
        templatesByOrg.set(seq.organization_id, orgTemplates);
      }

      const tpl =
        (stage.subject && stage.body ? { subject: stage.subject, body: stage.body } : null) ||
        orgTemplates.get(stage.day) || {
          subject: toneToDefaultSubject(stage.day),
          body: toneToDefaultBody(stage.day),
        };

      const vars: ReminderVars = {
        client: seq.clients?.name || "there",
        invoice: seq.invoices?.id || seq.invoice_id,
        amount: `$${Number(seq.invoices?.amount ?? 0).toLocaleString()}`,
        sender: sender.name,
      };

      let deliveryError: string | null = null;

      if (toEmail) {
        const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(toEmail)}&org=${seq.organization_id}`;
        const result = await sendReminderEmail({
          to: toEmail,
          fromName: sender.name,
          fromEmail: sender.email,
          replyTo: sender.replyTo || undefined,
          subject: renderTemplate(tpl.subject, vars),
          bodyText: renderTemplate(tpl.body, vars),
          unsubscribeUrl,
        });
        if (!result.ok) {
          deliveryError = result.error;
          console.error("Reminder send failed:", deliveryError);
        }
      } else {
        deliveryError = `No email for client ${seq.client_id}`;
      }

      const now = new Date().toISOString();
      const sent = !deliveryError;

      await supabase
        .from("reminder_stages")
        .update(
          sent
            ? { status: "sent", executed_at: now, error_message: null }
            : { status: "failed", error_message: deliveryError },
        )
        .eq("id", stage.id);

      if (sent) {
        await supabase
          .from("reminder_sequences")
          .update({ current_stage_day: stage.day })
          .eq("id", seq.id);
      }

      await supabase.from("reminder_activity_log").insert({
        user_id: seq.user_id,
        organization_id: seq.organization_id,
        invoice_id: seq.invoice_id,
        client_id: seq.client_id,
        stage_id: stage.id,
        event_type: sent ? "email_sent" : "email_failed",
        description: sent
          ? `Sent Day ${stage.day} reminder`
          : `Failed Day ${stage.day} reminder: ${deliveryError}`,
      });

      await supabase
        .from("reminder_delivery_logs")
        .update({ status: sent ? "delivered" : "failed" })
        .eq("invoice_id", seq.invoice_id)
        .eq("reminder_stage_id", stage.id);

      if (sent) processed.push(stage.id);
    }

    return NextResponse.json({ status: "success", processed: processed.length });
  } finally {
    await supabase.rpc("unlock_reminder_sweep");
  }
}
