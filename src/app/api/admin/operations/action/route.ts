import { NextRequest, NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action, targetId, reason } = await request.json();
  if (!action || !targetId) {
    return NextResponse.json({ error: "Missing action or targetId" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (action === "retry") {
    // Basic logic to reset a failed stage back to pending
    const { error: updateError } = await supabase
      .from("reminder_stages")
      .update({ status: "pending", error_message: null, executed_at: null })
      .eq("id", targetId)
      .eq("status", "failed");

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    
    // Log to platform audit
    await supabase.from("platform_audit_log").insert({
      actor_user_id: operator.user.id,
      action: "retry_reminder_stage",
      target_type: "reminder_stages",
      target_id: targetId,
      metadata: { original_status: "failed", reason }
    });

    return NextResponse.json({ success: true });
  }

  if (action === "pause") {
    const { error: updateError } = await supabase
      .from("reminder_sequences")
      .update({ status: "paused" })
      .eq("id", targetId);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    await supabase.from("platform_audit_log").insert({
      actor_user_id: operator.user.id,
      action: "pause_reminder_sequence",
      target_type: "reminder_sequences",
      target_id: targetId,
      metadata: { reason }
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
