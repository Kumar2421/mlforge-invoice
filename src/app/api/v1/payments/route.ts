import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function GET() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*, invoices(client_id), clients!inner(name)")
    .eq("organization_id", workspace.organizationId)
    .order("date", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const payments = data.map((row) => ({
    id: row.id,
    date: row.date,
    invoiceId: row.invoice_id,
    clientName: row.clients?.name,
    amount: row.amount,
    method: row.method,
    status: row.status,
  }));

  return NextResponse.json({ data: payments });
}
