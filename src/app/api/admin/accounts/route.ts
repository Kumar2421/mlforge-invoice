import { NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

type SettingsRow = { user_id: string; plan_slug: "solo" | "pro" };
type ConnectionRow = { user_id: string; last_synced_at: string | null };

export async function GET() {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const [usersResult, settingsResult, connectionsResult, invoicesResult] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from("account_settings").select("user_id, plan_slug"),
    supabase.from("stripe_connections").select("user_id, last_synced_at"),
    supabase.from("invoices").select("user_id, status"),
  ]);
  const error = usersResult.error || settingsResult.error || connectionsResult.error || invoicesResult.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settingsByUser = new Map((settingsResult.data as SettingsRow[] ?? []).map((item) => [item.user_id, item]));
  const connectionByUser = new Map((connectionsResult.data as ConnectionRow[] ?? []).map((item) => [item.user_id, item]));
  const invoiceByUser = new Map<string, number>();
  for (const invoice of invoicesResult.data ?? []) {
    if (invoice.status === "Overdue") invoiceByUser.set(invoice.user_id, (invoiceByUser.get(invoice.user_id) ?? 0) + 1);
  }

  const now = Date.now();
  const accounts = (usersResult.data.users ?? []).map((user) => {
    const connection = connectionByUser.get(user.id);
    const lastSyncedAt = connection?.last_synced_at ? Date.parse(connection.last_synced_at) : null;
    const staleSync = lastSyncedAt !== null && now - lastSyncedAt > 48 * 60 * 60 * 1000;
    const overdueInvoices = invoiceByUser.get(user.id) ?? 0;
    const rawName = user.user_metadata?.company_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Unnamed workspace";
    return {
      id: user.id,
      name: String(rawName),
      email: user.email ?? "No email",
      plan: settingsByUser.get(user.id)?.plan_slug === "pro" ? "Pro" : "Solo",
      status: user.banned_until ? "Suspended" : overdueInvoices > 0 || staleSync ? "At risk" : "Active",
      members: 1,
      stripe: !connection ? "Not connected" : staleSync ? "Needs attention" : "Connected",
      lastActive: user.last_sign_in_at ?? user.created_at,
      overdueInvoices,
    };
  });

  return NextResponse.json({ data: accounts });
}
