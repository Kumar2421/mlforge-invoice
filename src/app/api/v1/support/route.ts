import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function POST(req: Request) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { subject, description, priority } = body;

    if (!subject || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        organization_id: workspace.organizationId,
        user_id: workspace.userId,
        subject,
        description,
        priority: priority || "Normal",
        status: "Open",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
