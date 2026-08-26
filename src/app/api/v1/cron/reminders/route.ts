import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Vercel Cron calls this via GET and, when a CRON_SECRET env var is set,
// automatically attaches `Authorization: Bearer <CRON_SECRET>`.
// See vercel.json for the schedule.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

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

    if (toEmail) {
      const emailBody = `
        <h2>Invoice Reminder</h2>
        <p>Hi ${seq.clients?.name},</p>
        <p>This is a Day ${stage.day} reminder regarding your invoice <strong>${seq.invoices?.id}</strong> for $${seq.invoices?.amount}.</p>
        <p>Please arrange payment at your earliest convenience.</p>
      `;

      const resendReq = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Reminders <onboarding@resend.dev>",
          to: [toEmail],
          subject: `Invoice Reminder: ${seq.invoices?.id}`,
          html: emailBody,
        }),
      });

      if (!resendReq.ok) {
        console.error("Failed to send email via Resend:", await resendReq.text());
      }
    } else {
      console.warn(`No email found for client ${seq.client_id}`);
    }

    await supabase
      .from("reminder_stages")
      .update({ status: "sent", executed_at: new Date().toISOString() })
      .eq("id", stage.id);

    await supabase.from("reminder_sequences").update({ current_stage_day: stage.day }).eq("id", seq.id);

    await supabase.from("reminder_activity_log").insert({
      user_id: seq.user_id,
      invoice_id: seq.invoice_id,
      client_id: seq.client_id,
      stage_id: stage.id,
      event_type: "email_sent",
      description: `Sent Day ${stage.day} reminder`,
    });

    processed.push(stage.id);
  }

  return NextResponse.json({ status: "success", processed: processed.length });
}
