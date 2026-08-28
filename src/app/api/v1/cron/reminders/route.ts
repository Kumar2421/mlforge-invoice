import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Netlify Cron calls this via GET or POST depending on setup.
// We accept both GET and POST. Netlify Scheduled Functions default to POST.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

  return processReminders();
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

  return processReminders();
}

async function processReminders() {

  const supabase = createAdminClient();

  const { data: sequences, error } = await supabase
    .from("reminder_sequences")
    .select("*, invoices!inner(*), clients!inner(*)")
    .eq("status", "active");

  if (error) {
    console.error("Error fetching sequences", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const processed: string[] = [];
  const senderByUser = new Map<string, { name: string; email: string; replyTo: string }>();

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
    const toEmail = seq.clients?.email;
    let deliveryError: string | null = null;

    if (toEmail) {
      // 1. CAN-SPAM Check: Has this email unsubscribed?
      const { data: optOut } = await supabase
        .from("email_unsubscribes")
        .select("id")
        .eq("email", toEmail)
        .maybeSingle();

      if (optOut) {
        // Skip sending, mark stage as failed or cancelled due to unsubscribe
        await supabase.from("reminder_stages").update({ status: "failed", error_message: "User unsubscribed" }).eq("id", stage.id);
        continue;
      }
    }

    // 2. Idempotency Lock: Try inserting delivery log first
    const { error: lockError } = await supabase
      .from("reminder_delivery_logs")
      .insert({
        organization_id: seq.organization_id,
        invoice_id: seq.invoice_id,
        reminder_stage_id: stage.id,
        status: "pending"
      });

    if (lockError) {
      console.warn(`Skipping duplicate reminder for invoice ${seq.invoice_id} stage ${stage.id}`);
      continue;
    }

    let sender = senderByUser.get(seq.user_id);
    if (!sender) {
      const { data: settings } = await supabase
        .from("account_settings")
        .select("sender_name, sender_email, reply_to_email")
        .eq("user_id", seq.user_id)
        .maybeSingle();
      sender = {
        name: settings?.sender_name?.trim() || "Reminders",
        email: settings?.sender_email?.trim() || "onboarding@resend.dev",
        replyTo: settings?.reply_to_email?.trim() || settings?.sender_email?.trim() || "",
      };
      senderByUser.set(seq.user_id, sender);
    }

    if (toEmail) {
      const appUrl = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(toEmail)}&org=${seq.organization_id}`;
      const physicalAddress = "4/12.2 south street . pukkulam . udumalpet . tamilnadu . india";

      const emailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2>Invoice Reminder</h2>
          <p>Hi ${seq.clients?.name},</p>
          <p>This is a Day ${stage.day} reminder regarding your invoice <strong>${seq.invoices?.id}</strong> for $${seq.invoices?.amount}.</p>
          <p>Please arrange payment at your earliest convenience.</p>
          
          <hr style="margin-top: 40px; border: none; border-top: 1px solid #eaeaea;" />
          <div style="font-size: 12px; color: #666; text-align: center;">
            <p>This is an automated payment reminder sent on behalf of ${sender.name}.</p>
            <p>${physicalAddress}</p>
            <p>If you wish to stop receiving these reminders, you can <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">unsubscribe here</a>.</p>
          </div>
        </div>
      `;

      const resendReq = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${sender.name} <${sender.email}>`,
          ...(sender.replyTo ? { reply_to: sender.replyTo } : {}),
          to: [toEmail],
          subject: `Invoice Reminder: ${seq.invoices?.id}`,
          html: emailBody,
        }),
      });

      if (!resendReq.ok) {
        deliveryError = await resendReq.text();
        console.error("Failed to send email via Resend:", deliveryError);
      }
    } else {
      deliveryError = `No email found for client ${seq.client_id}`;
      console.warn(deliveryError);
    }

    const now = new Date().toISOString();
    const sent = !deliveryError;

    await supabase
      .from("reminder_stages")
      .update(sent ? { status: "sent", executed_at: now, error_message: null } : { status: "failed", error_message: deliveryError })
      .eq("id", stage.id);

    if (sent) {
      await supabase.from("reminder_sequences").update({ current_stage_day: stage.day }).eq("id", seq.id);
    }

    await supabase.from("reminder_activity_log").insert({
      user_id: seq.user_id,
      organization_id: seq.organization_id,
      invoice_id: seq.invoice_id,
      client_id: seq.client_id,
      stage_id: stage.id,
      event_type: sent ? "email_sent" : "email_failed",
      description: sent ? `Sent Day ${stage.day} reminder` : `Failed Day ${stage.day} reminder: ${deliveryError}`,
    });

    // Update idempotency log
    await supabase.from("reminder_delivery_logs")
      .update({ status: sent ? "delivered" : "failed" })
      .eq("invoice_id", seq.invoice_id)
      .eq("reminder_stage_id", stage.id);

    if (sent) processed.push(stage.id);
  }

  return NextResponse.json({ status: "success", processed: processed.length });
}
