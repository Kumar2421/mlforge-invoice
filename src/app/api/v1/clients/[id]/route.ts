import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { remindersMuted } = await request.json();

  if (typeof remindersMuted !== "boolean") {
    return NextResponse.json({ error: "Invalid body parameters" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .update({ reminders_muted: remindersMuted })
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
