import { NextRequest, NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("platform_settings")
    .select("key, value, description");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { key, value } = await request.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("platform_settings")
    .update({ value, updated_by: operator.user.id, updated_at: new Date().toISOString() })
    .eq("key", key);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("platform_audit_log").insert({
    actor_user_id: operator.user.id,
    action: "update_platform_setting",
    target_type: "platform_settings",
    target_id: key,
    metadata: { new_value: value }
  });

  return NextResponse.json({ success: true });
}
