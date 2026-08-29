import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace, isWorkspaceManager } from "@/lib/workspace";
import { createAdminClient } from "@/lib/supabase-admin";

/** GET → current onboarding state for the active workspace. */
export async function GET() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [orgRes, connRes, settingsRes] = await Promise.all([
    supabase.from("organizations").select("name, onboarded_at").eq("id", workspace.organizationId).maybeSingle(),
    supabase.from("stripe_connections").select("id").eq("organization_id", workspace.organizationId).maybeSingle(),
    supabase.from("account_settings").select("sender_name, sender_email, reply_to_email, reminder_cadence_days").eq("organization_id", workspace.organizationId).maybeSingle(),
  ]);

  return NextResponse.json({
    data: {
      workspaceName: orgRes.data?.name ?? "",
      onboarded: Boolean(orgRes.data?.onboarded_at),
      stripeConnected: Boolean(connRes.data),
      senderName: settingsRes.data?.sender_name ?? "",
      senderEmail: settingsRes.data?.sender_email ?? "",
      replyToEmail: settingsRes.data?.reply_to_email ?? "",
      reminderCadenceDays: settingsRes.data?.reminder_cadence_days ?? [3, 7, 14],
      role: workspace.role,
    },
  });
}

/** PATCH → save a step or complete onboarding. */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isWorkspaceManager(workspace.role)) {
    return NextResponse.json({ error: "Only owners or admins can complete onboarding" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  const supabaseAdmin = createAdminClient();
  if (typeof body.workspaceName === "string" && body.workspaceName.trim()) {
    await supabaseAdmin
      .from("organizations")
      .update({ name: body.workspaceName.trim() })
      .eq("id", workspace.organizationId);
  }

  const senderName = typeof body.senderName === "string" ? body.senderName.trim() : undefined;
  const senderEmail = typeof body.senderEmail === "string" ? body.senderEmail.trim() : undefined;
  const replyToEmail = typeof body.replyToEmail === "string" ? body.replyToEmail.trim() : undefined;
  const cadence = Array.isArray(body.reminderCadenceDays)
    ? body.reminderCadenceDays.map(Number).filter((n: number) => Number.isFinite(n) && n > 0).slice(0, 3)
    : undefined;

  if (senderName !== undefined || senderEmail !== undefined || replyToEmail !== undefined || cadence !== undefined) {
    const update: Record<string, unknown> = {
      user_id: workspace.userId,
      organization_id: workspace.organizationId,
      updated_at: new Date().toISOString(),
    };
    if (senderName !== undefined) update.sender_name = senderName;
    if (senderEmail !== undefined) update.sender_email = senderEmail;
    if (replyToEmail !== undefined) update.reply_to_email = replyToEmail;
    if (cadence !== undefined && cadence.length === 3) update.reminder_cadence_days = cadence;

    await supabase.from("account_settings").upsert(update, { onConflict: "organization_id" });
  }

  if (body.complete === true) {
    await supabaseAdmin
      .from("organizations")
      .update({ onboarded_at: new Date().toISOString() })
      .eq("id", workspace.organizationId)
      .is("onboarded_at", null);
  }

  return NextResponse.json({ data: { ok: true } });
}
