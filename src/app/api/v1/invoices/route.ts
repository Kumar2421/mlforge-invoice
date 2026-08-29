import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, dueDate, amount, status = "Draft" } = body;

  if (!clientId || !amount) {
    return NextResponse.json(
      { error: "clientId and amount required" },
      { status: 400 }
    );
  }

  const invoiceId = `manual-${crypto.randomBytes(16).toString("hex")}`;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      id: invoiceId,
      user_id: workspace.userId,
      organization_id: workspace.organizationId,
      client_id: clientId,
      date: now,
      due_date: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount,
      status,
      synced_from_stripe: false,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(name, email, avatar_img)")
    .eq("organization_id", workspace.organizationId)
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
    syncedFromStripe: row.synced_from_stripe,
  }));

  return NextResponse.json({ data: invoices });
}
