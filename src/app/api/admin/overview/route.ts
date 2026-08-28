import { NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const [usersResult, sequencesResult, stagesResult, connectionsResult, invoicesResult] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from("reminder_sequences").select("id, status, created_at"),
    supabase.from("reminder_stages").select("id, status, scheduled_for"),
    supabase.from("stripe_connections").select("user_id"),
    supabase.from("invoices").select("id, status, amount, created_at"),
  ]);

  const error = usersResult.error || sequencesResult.error || stagesResult.error || connectionsResult.error || invoicesResult.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = usersResult.data.users ?? [];
  const sequences = sequencesResult.data ?? [];
  const stages = stagesResult.data ?? [];
  const connections = connectionsResult.data ?? [];
  const invoices = invoicesResult.data ?? [];
  const now = Date.now();
  const last30Days = now - 30 * 24 * 60 * 60 * 1000;
  const activeSequences = sequences.filter((item) => item.status === "active").length;
  const failedStages = stages.filter((item) => item.status === "failed").length;
  const dueSoon = stages.filter((item) => item.status === "pending" && Date.parse(item.scheduled_for) <= now + 60 * 60 * 1000).length;
  const overdueInvoices = invoices.filter((item) => item.status === "Overdue").length;
  const newWorkspaces = users.filter((item) => Date.parse(item.created_at) >= last30Days).length;

  return NextResponse.json({
    data: {
      activeWorkspaces: users.length,
      newWorkspaces,
      activeSequences,
      failedStages,
      dueSoon,
      overdueInvoices,
      connectedAccounts: connections.length,
      totalInvoiced: invoices.reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
      operatorRole: operator.role,
    },
  });
}
