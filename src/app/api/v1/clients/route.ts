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
    .from("clients")
    .select("*")
    .eq("organization_id", workspace.organizationId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clients = data.map((row) => ({
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    avatarImg: row.avatar_img,
    totalInvoiced: row.total_invoiced,
    outstandingBalance: row.outstanding_balance,
    onTimeRate: row.on_time_rate,
    remindersMuted: row.reminders_muted,
  }));

  return NextResponse.json({ data: clients });
}
