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
    .from("stripe_connections")
    .select("stripe_account_id, connected_at, last_synced_at")
    .eq("organization_id", workspace.organizationId)
    .single();

  if (error || !data) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    accountId: data.stripe_account_id,
    connectedAt: data.connected_at,
    lastSyncedAt: data.last_synced_at,
  });
}
