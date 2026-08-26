import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type SettingsRow = {
  sender_name: string | null;
  sender_email: string | null;
  reply_to_email: string | null;
  reminder_cadence_days: number[] | null;
  plan_slug: "solo" | "pro" | null;
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("account_settings")
    .select("sender_name, sender_email, reply_to_email, reminder_cadence_days, plan_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = (data ?? {}) as SettingsRow;

  return NextResponse.json({
    data: {
      senderName: row.sender_name ?? "",
      senderEmail: row.sender_email ?? "",
      replyToEmail: row.reply_to_email ?? "",
      reminderCadenceDays: normalizeCadence(row.reminder_cadence_days ?? undefined),
      planSlug: row.plan_slug ?? "solo",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const senderName = typeof body.senderName === "string" ? body.senderName.trim() : "";
  const senderEmail = typeof body.senderEmail === "string" ? body.senderEmail.trim() : "";
  const replyToEmail = typeof body.replyToEmail === "string" ? body.replyToEmail.trim() : "";
  const reminderCadenceDays = normalizeCadence(body.reminderCadenceDays);
  const planSlug = body.planSlug === "pro" ? "pro" : "solo";

  const { error } = await supabase.from("account_settings").upsert({
    user_id: user.id,
    sender_name: senderName,
    sender_email: senderEmail,
    reply_to_email: replyToEmail,
    reminder_cadence_days: reminderCadenceDays,
    plan_slug: planSlug,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      senderName,
      senderEmail,
      replyToEmail,
      reminderCadenceDays,
      planSlug,
    },
  });
}
