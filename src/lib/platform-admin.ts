import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/utils/supabase/server";

export type PlatformAdminRole = "support" | "operations" | "platform_admin";

export type PlatformAdmin = {
  user: User;
  role: PlatformAdminRole;
};

function configuredAdminEmails() {
  return new Set(
    (process.env.PLATFORM_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function getPlatformAdmin(): Promise<PlatformAdmin | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  if (user.email && configuredAdminEmails().has(user.email.toLowerCase())) {
    return { user, role: "platform_admin" };
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("platform_admins")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data || !isPlatformAdminRole(data.role)) return null;
  return { user, role: data.role };
}

export function isPlatformAdminRole(value: unknown): value is PlatformAdminRole {
  return value === "support" || value === "operations" || value === "platform_admin";
}
