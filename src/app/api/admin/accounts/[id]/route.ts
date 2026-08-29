import { NextRequest, NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: userId } = await params;
  if (!userId) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

  const supabase = createAdminClient();

  const [
    userResult,
    settingsResult,
    connectionsResult,
    invoicesResult,
    activityResult
  ] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase.from("organizations").select("plan").eq("created_by", userId).order("created_at", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("stripe_connections").select("stripe_account_id, last_synced_at, connected_at").eq("user_id", userId).single(),
    supabase.from("invoices").select("id, status, amount, created_at").eq("user_id", userId),
    supabase.from("reminder_activity_log").select("event_type, description, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20)
  ]);

  if (userResult.error) return NextResponse.json({ error: userResult.error.message }, { status: 500 });

  const user = userResult.data.user;
  const invoices = invoicesResult.data ?? [];
  const outstandingInvoices = invoices.filter(i => i.status === "Overdue" || i.status === "Open");
  const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  
  const rawName = user.user_metadata?.company_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Unnamed workspace";

  return NextResponse.json({
    data: {
      id: user.id,
      name: String(rawName),
      email: user.email ?? "No email",
      plan: settingsResult.data?.plan === "pro" ? "Pro" : "Solo",
      status: user.banned_until ? "Suspended" : "Active",
      is_suspended: !!user.banned_until,
      members: 1, // Organization/members is Phase 4
      stats: {
        outstanding: totalOutstanding,
        activeSequences: 0, // Simplified for now
      },
      connection: connectionsResult.data || null,
      activity: activityResult.data ?? []
    }
  });
}
