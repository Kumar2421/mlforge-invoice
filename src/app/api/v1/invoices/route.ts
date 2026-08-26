import { NextResponse } from "next/server";
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
