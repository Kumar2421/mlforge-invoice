import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/utils/supabase/server";

type Params = { params: Promise<{ token: string }> };

export async function POST(_: Request, { params }: Params) {
  const { token } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: invite, error } = await admin
    .from("organization_invitations")
    .select("organization_id, email, role, expires_at, accepted_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !invite) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  if (invite.accepted_at || Date.parse(invite.expires_at) < Date.now()) return NextResponse.json({ error: "Invitation is no longer valid" }, { status: 410 });
  if (invite.email.toLowerCase() !== user.email.toLowerCase()) return NextResponse.json({ error: "Sign in with the invited email address." }, { status: 403 });

  const { error: memberError } = await admin.from("organization_members").upsert({ organization_id: invite.organization_id, user_id: user.id, role: invite.role });
  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });
  const { error: acceptError } = await admin.from("organization_invitations").update({ accepted_at: new Date().toISOString() }).eq("token", token);
  if (acceptError) return NextResponse.json({ error: acceptError.message }, { status: 500 });
  return NextResponse.json({ data: { organizationId: invite.organization_id } });
}
