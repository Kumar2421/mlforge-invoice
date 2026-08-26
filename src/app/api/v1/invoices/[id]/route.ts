import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function completeReminderSequence(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  invoiceId: string,
  clientId: string | null,
  eventType: string
) {
  const { data: sequences } = await supabase
    .from("reminder_sequences")
    .select("id")
    .eq("user_id", userId)
    .eq("invoice_id", invoiceId)
    .eq("status", "active");

  if (!sequences || sequences.length === 0) {
    return;
  }

  const sequenceIds = sequences.map((sequence) => sequence.id);
  const now = new Date().toISOString();

  await supabase
    .from("reminder_sequences")
    .update({ status: "completed", updated_at: now })
    .in("id", sequenceIds);

  await supabase
    .from("reminder_stages")
    .update({ status: "skipped" })
    .in("sequence_id", sequenceIds)
    .in("status", ["pending", "scheduled"]);

  await supabase.from("reminder_activity_log").insert(
    sequenceIds.map((sequenceId) => ({
      user_id: userId,
      invoice_id: invoiceId,
      client_id: clientId,
      event_type: "sequence_completed",
      description: `Sequence completed after ${eventType}`,
      metadata: {
        sequence_id: sequenceId,
        event_type: eventType,
      },
    }))
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { data: invoice, error: fetchError } = await supabase
    .from("invoices")
    .select("id, amount, client_id, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const paymentId = `manual-${invoice.id}`;

  const { error: invoiceError } = await supabase
    .from("invoices")
    .update({ status: "Paid" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (invoiceError) {
    return NextResponse.json({ error: invoiceError.message }, { status: 500 });
  }

  const { error: paymentError } = await supabase.from("payments").upsert(
    {
      id: paymentId,
      user_id: user.id,
      invoice_id: invoice.id,
      date: now,
      amount: Number(invoice.amount || 0),
      method: "Manual",
      status: "Succeeded",
    },
    { onConflict: "id" }
  );

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  await completeReminderSequence(supabase, user.id, invoice.id, invoice.client_id ?? null, "manual_paid");

  return NextResponse.json({
    data: {
      id: invoice.id,
      status: "Paid",
    },
  });
}
