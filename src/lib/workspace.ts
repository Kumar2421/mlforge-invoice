import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type WorkspaceRole = "owner" | "admin" | "member";

export type CurrentWorkspace = {
  userId: string;
  organizationId: string;
  role: WorkspaceRole;
};

const ACTIVE_WORKSPACE_COOKIE = "active_workspace";

/**
 * Resolves the caller's active workspace.
 *
 * If an `active_workspace` cookie is set and the user is a member of that org,
 * it wins. Otherwise falls back to the oldest membership (stable default).
 */
export async function getCurrentWorkspace(): Promise<CurrentWorkspace | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (!memberships || memberships.length === 0) return null;

  let selected = memberships[0];

  try {
    const cookieStore = await cookies();
    const preferred = cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value;
    if (preferred) {
      const match = memberships.find((m) => m.organization_id === preferred);
      if (match) selected = match;
    }
  } catch {
    // cookies() unavailable in some contexts — fall back to the default.
  }

  const role = selected.role as WorkspaceRole;
  if (role !== "owner" && role !== "admin" && role !== "member") return null;

  return { userId: user.id, organizationId: selected.organization_id, role };
}

export function isWorkspaceManager(role: WorkspaceRole): boolean {
  return role === "owner" || role === "admin";
}

export const ACTIVE_WORKSPACE_COOKIE_NAME = ACTIVE_WORKSPACE_COOKIE;
