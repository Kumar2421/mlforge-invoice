import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

type SettingsRow = {
  sender_name: string | null;
  sender_email: string | null;
  reply_to_email: string | null;
  reminder_cadence_days: number[] | null;
};

function normalizeCadence(value: unknown) {
  if (!Array.isArray(value)) {
    return [3, 7, 14];
  }

  const days = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
    .slice(0, 3);

  while (days.length < 3) {
    days.push(days.length === 0 ? 3 : days[days.length - 1] + 4);
  }

  return days;
}

export async function GET() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [settingsRes, orgRes] = await Promise.all([
    supabase
      .from("account_settings")
      .select("sender_name, sender_email, reply_to_email, reminder_cadence_days")
      .eq("organization_id", workspace.organizationId)
      .maybeSingle(),
    supabase
      .from("organizations")
      .select("plan")
      .eq("id", workspace.organizationId)
      .maybeSingle(),
  ]);

  if (settingsRes.error) {
    return NextResponse.json({ error: settingsRes.error.message }, { status: 500 });
  }

  const row = (settingsRes.data ?? {}) as SettingsRow;

  return NextResponse.json({
    data: {
      senderName: row.sender_name ?? "",
      senderEmail: row.sender_email ?? "",
      replyToEmail: row.reply_to_email ?? "",
      reminderCadenceDays: normalizeCadence(row.reminder_cadence_days ?? undefined),
      planSlug: (orgRes.data?.plan as "solo" | "pro") ?? "solo",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const senderName = typeof body.senderName === "string" ? body.senderName.trim() : "";
  const senderEmail = typeof body.senderEmail === "string" ? body.senderEmail.trim() : "";
  const replyToEmail = typeof body.replyToEmail === "string" ? body.replyToEmail.trim() : "";
  const reminderCadenceDays = normalizeCadence(body.reminderCadenceDays);

  const { error } = await supabase.from("account_settings").upsert(
    {
      user_id: workspace.userId,
      organization_id: workspace.organizationId,
      sender_name: senderName,
      sender_email: senderEmail,
      reply_to_email: replyToEmail,
      reminder_cadence_days: reminderCadenceDays,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "organization_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("plan")
    .eq("id", workspace.organizationId)
    .maybeSingle();

  return NextResponse.json({
    data: {
      senderName,
      senderEmail,
      replyToEmail,
      reminderCadenceDays,
      planSlug: (org?.plan as "solo" | "pro") ?? "solo",
    },
  });
}
