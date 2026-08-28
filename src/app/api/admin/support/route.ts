import { NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();

  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("id, subject, priority, user_id, assigned_to")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const userMap = new Map((usersData?.users ?? []).map((u) => {
    const name = u.user_metadata?.company_name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Unknown";
    return [u.id, name];
  }));

  const rows = tickets.map((t) => ({
    id: t.id,
    subject: t.subject,
    account: userMap.get(t.user_id) ?? "Unknown Workspace",
    owner: t.assigned_to ? (userMap.get(t.assigned_to) ?? "Unknown") : "Unassigned",
    priority: t.priority === "high" || t.priority === "urgent" ? "High" : "Normal"
  }));

  return NextResponse.json({ data: rows });
}
