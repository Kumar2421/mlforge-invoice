import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/utils/supabase/server";

type Params = { params: Promise<{ id: string }> };

async function currentMembership(organizationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null };
  const admin = createAdminClient();
  const { data } = await admin.from("organization_members").select("role").eq("organization_id", organizationId).eq("user_id", user.id).maybeSingle();
  return { user, role: data?.role ?? null };
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const { user } = await currentMembership(id);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const [membersResult, usersResult, invitationsResult] = await Promise.all([
    admin.from("organization_members").select("user_id, role, created_at").eq("organization_id", id),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("organization_invitations").select("id, email, role, token, expires_at, accepted_at").eq("organization_id", id).is("accepted_at", null),
  ]);
  const error = membersResult.error || usersResult.error || invitationsResult.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const users = new Map((usersResult.data.users ?? []).map((item) => [item.id, item]));
  return NextResponse.json({ data: {
    members: (membersResult.data ?? []).map((member) => {
      const profile = users.get(member.user_id);
      return { id: member.user_id, email: profile?.email ?? "Unknown user", name: profile?.user_metadata?.full_name ?? profile?.user_metadata?.name ?? profile?.email ?? "Unknown user", role: member.role, joinedAt: member.created_at };
    }),
    invitations: invitationsResult.data ?? [],
  } });
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const { user, role } = await currentMembership(id);
  if (!user || (role !== "owner" && role !== "admin")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null) as { email?: unknown; role?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const invitedRole = body?.role === "admin" ? "admin" : "member";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "A valid email is required." }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organization_invitations")
    .upsert({ organization_id: id, email, role: invitedRole, invited_by: user.id, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() }, { onConflict: "organization_id,email" })
    .select("id, email, role, token, expires_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: { ...data, invitePath: `/invite/${data.token}` } }, { status: 201 });
}
