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

  const { data: logs, error } = await supabase
    .from("reminder_activity_log")
    .select("*, clients(name, avatar_img), invoices(amount)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const uiLogs = logs.map((row) => ({
    id: row.id,
    clientName: row.clients?.name,
    clientAvatarImg: row.clients?.avatar_img,
    amount: row.invoices?.amount,
    latestAction: row.description,
    date: row.created_at,
  }));

  return NextResponse.json({ data: uiLogs });
}
