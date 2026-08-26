import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(name, email, avatar_img)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(50);

  if (error) {
    console.error("GET /api/v1/invoices error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const invoices = data.map((row) => ({
    id: row.id,
    date: row.date,
    dueDate: row.due_date,
    clientId: row.client_id,
    clientName: row.clients?.name,
    clientEmail: row.clients?.email,
    clientAvatarImg: row.clients?.avatar_img,
    amount: row.amount,
    status: row.status,
  }));

  return NextResponse.json({ data: invoices });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "";
  const clientEmail = typeof body.clientEmail === "string" ? body.clientEmail.trim() : "";
  const amount = Number(body.amount);
  const dueDate = typeof body.dueDate === "string" ? body.dueDate : "";

  if (!clientName || !Number.isFinite(amount) || amount <= 0 || !dueDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = new Date();
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) {
    return NextResponse.json({ error: "Invalid due date" }, { status: 400 });
  }

  const clientId = `manual-client-${crypto.randomUUID()}`;
  const invoiceId = `manual-invoice-${crypto.randomUUID()}`;

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .eq("email", clientEmail)
    .maybeSingle();

  const resolvedClientId = existingClient?.id ?? clientId;

  if (!existingClient) {
    const { error: clientError } = await supabase.from("clients").insert({
      id: resolvedClientId,
      user_id: user.id,
      name: clientName,
      company: "",
      email: clientEmail,
      avatar_img: Math.floor(Math.random() * 5) + 1,
      total_invoiced: 0,
      outstanding_balance: amount,
      on_time_rate: 100,
      reminders_muted: false,
    });

    if (clientError) {
      return NextResponse.json({ error: clientError.message }, { status: 500 });
    }
  }

  const { error: invoiceError } = await supabase.from("invoices").insert({
    id: invoiceId,
    user_id: user.id,
    client_id: resolvedClientId,
    date: now.toISOString(),
    due_date: due.toISOString(),
    amount,
    status: due < now ? "Overdue" : "Pending",
  });

  if (invoiceError) {
    return NextResponse.json({ error: invoiceError.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      id: invoiceId,
      clientId: resolvedClientId,
    },
  });
}
