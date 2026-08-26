import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface StageRow {
  id: string;
  day: number;
  status: string;
  scheduled_for: string;
  executed_at: string | null;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sequences, error } = await supabase
    .from("reminder_sequences")
    .select(
      `
      id, invoice_id, current_stage_day, status,
      clients ( name, avatar_img ),
      invoices ( amount ),
      reminder_stages ( id, day, status, scheduled_for, executed_at )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const data = sequences.map((seq) => {
    type ClientRef = { name?: string; avatar_img?: number } | null;
    type InvoiceRef = { amount?: number } | null;
    const client = seq.clients as ClientRef;
    const invoice = seq.invoices as InvoiceRef;

    return {
      id: seq.id,
      invoiceId: seq.invoice_id,
      clientName: client?.name,
      clientAvatarImg: client?.avatar_img,
      amount: invoice?.amount,
      currentStageDay: seq.current_stage_day,
      paused: seq.status === "paused",
      stages: ((seq.reminder_stages || []) as StageRow[])
        .map((s) => ({
          day: s.day,
          tone: s.day === 3 ? "gentle" : s.day === 7 ? "firm" : "final",
          subject: `Day ${s.day} Reminder`,
          body: "",
          status: s.status,
        }))
        .sort((a, b) => a.day - b.day),
    };
  });

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { invoiceId, clientId, stages } = await request.json();
  if (!invoiceId || !clientId || !stages || !Array.isArray(stages)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: seq, error: seqErr } = await supabase
    .from("reminder_sequences")
    .insert({
      user_id: user.id,
      invoice_id: invoiceId,
      client_id: clientId,
      status: "active",
      current_stage_day: 0,
    })
    .select()
    .single();

  if (seqErr) {
    return NextResponse.json({ error: seqErr.message }, { status: 500 });
  }

  const stagesToInsert = stages.map((stage: { day: number }) => {
    const scheduledFor = new Date();
    scheduledFor.setDate(scheduledFor.getDate() + stage.day);

    return {
      sequence_id: seq.id,
      day: stage.day,
      status: "pending",
      scheduled_for: scheduledFor.toISOString(),
    };
  });

  const { error: stagesErr } = await supabase.from("reminder_stages").insert(stagesToInsert);

  if (stagesErr) {
    return NextResponse.json({ error: stagesErr.message }, { status: 500 });
  }

  return NextResponse.json({ data: seq });
}
