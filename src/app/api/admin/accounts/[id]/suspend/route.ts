import { NextRequest, NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing account ID" }, { status: 400 });

  const { suspend, reason } = await request.json();
  if (suspend === undefined) return NextResponse.json({ error: "Missing suspend flag" }, { status: 400 });
  if (suspend && !reason) return NextResponse.json({ error: "Suspension requires a reason" }, { status: 400 });

  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.updateUserById(id, { 
    ban_duration: suspend ? "876000h" : "none" 
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await supabase.from("platform_audit_log").insert({
    actor_user_id: operator.user.id,
    action: suspend ? "suspend_account" : "unsuspend_account",
    target_type: "auth.users",
    target_id: id,
    metadata: { reason }
  });

  return NextResponse.json({ success: true });
}
