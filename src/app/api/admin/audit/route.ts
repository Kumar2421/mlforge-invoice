import { NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("platform_audit_log")
    .select("id, action, target_type, target_id, actor_user_id, created_at, metadata")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // To display emails for the actors, we need to fetch user data
  // Since this is platform admin, there are only a few admins, so a quick mapping is fine
  const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailByUser = new Map((usersData?.users ?? []).map((u) => [u.id, u.email]));

  function displayTime(value: string | null) {
    if (!value) return "Not available";
    const time = Date.parse(value);
    if (!Number.isFinite(time)) return value;
    const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 1440) return `${Math.round(minutes / 60)} hr ago`;
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const rows = data.map((event) => ({
    id: event.id,
    account: emailByUser.get(event.actor_user_id) ?? event.actor_user_id,
    subject: event.action,
    status: "Reviewed", // audit logs are immutable records
    detail: event.metadata?.reason ? `Reason: ${event.metadata.reason}` : `Target: ${event.target_type}`,
    time: displayTime(event.created_at),
  }));

  return NextResponse.json({ data: rows });
}
