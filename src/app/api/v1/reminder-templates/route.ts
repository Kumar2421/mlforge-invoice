import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

const TONE_BY_DAY = (day: number): "gentle" | "firm" | "final" =>
  day <= 3 ? "gentle" : day <= 7 ? "firm" : "final";

export async function GET() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("reminder_templates")
    .select("id, day, tone, subject, body")
    .eq("organization_id", workspace.organizationId)
    .order("day", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

/** PUT replaces the whole template set for the workspace. */
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const stages: unknown = body?.stages;
  if (!Array.isArray(stages) || stages.length === 0) {
    return NextResponse.json({ error: "stages array required" }, { status: 400 });
  }

  const rows = stages
    .map((s: { day?: unknown; subject?: unknown; body?: unknown; tone?: unknown }) => {
      const day = Number(s.day);
      if (!Number.isFinite(day) || day <= 0) return null;
      return {
        organization_id: workspace.organizationId,
        day,
        tone:
          s.tone === "gentle" || s.tone === "firm" || s.tone === "final"
            ? s.tone
            : TONE_BY_DAY(day),
        subject: String(s.subject ?? "").slice(0, 300) || `Reminder: invoice {{invoice}} overdue`,
        body: String(s.body ?? "").slice(0, 8000) || "Hi {{client}}, invoice {{invoice}} for {{amount}} is overdue.",
        updated_at: new Date().toISOString(),
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;

  if (rows.length === 0) {
    return NextResponse.json({ error: "no valid stages" }, { status: 400 });
  }

  // Replace: delete days not in the new set, upsert the rest.
  const keepDays = rows.map((r) => r.day as number);
  await supabase
    .from("reminder_templates")
    .delete()
    .eq("organization_id", workspace.organizationId)
    .not("day", "in", `(${keepDays.join(",")})`);

  const { error } = await supabase
    .from("reminder_templates")
    .upsert(rows, { onConflict: "organization_id,day" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = await supabase
    .from("reminder_templates")
    .select("id, day, tone, subject, body")
    .eq("organization_id", workspace.organizationId)
    .order("day", { ascending: true });

  return NextResponse.json({ data: data ?? [] });
}
