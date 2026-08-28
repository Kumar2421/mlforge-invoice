import { createClient } from "@/utils/supabase/server";

export type CurrentWorkspace = {
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "member";
};

export async function getCurrentWorkspace(): Promise<CurrentWorkspace | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!data || (data.role !== "owner" && data.role !== "admin" && data.role !== "member")) return null;
  return { userId: user.id, organizationId: data.organization_id, role: data.role };
}
