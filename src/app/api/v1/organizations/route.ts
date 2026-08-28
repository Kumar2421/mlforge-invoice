import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("organization_members")
    .select("role, organizations(id, name, created_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: (data ?? []).map((membership) => ({ ...membership.organizations, role: membership.role })) });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as { name?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 100) return NextResponse.json({ error: "Organization name must be between 1 and 100 characters." }, { status: 400 });

  const admin = createAdminClient();
  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .insert({ name, created_by: user.id })
    .select("id, name, created_at")
    .single();
  if (organizationError) return NextResponse.json({ error: organizationError.message }, { status: 500 });

  const { error: membershipError } = await admin
    .from("organization_members")
    .insert({ organization_id: organization.id, user_id: user.id, role: "owner" });
  if (membershipError) return NextResponse.json({ error: membershipError.message }, { status: 500 });

  return NextResponse.json({ data: { ...organization, role: "owner" } }, { status: 201 });
}
