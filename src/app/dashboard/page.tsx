import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "there";

  const { data: stripeConnection } = await supabase
    .from("stripe_connections")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: orgData } = await supabase
    .from("organizations")
    .select("trial_starts_at, subscription_status")
    .eq("created_by", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (orgData) {
    const trialStarts = new Date(orgData.trial_starts_at || new Date().toISOString());
    const now = new Date();
    const diffMs = now.getTime() - trialStarts.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > 3 && orgData.subscription_status !== 'active') {
      redirect("/activate");
    }
  }

  return <Dashboard displayName={displayName} needsOnboarding={!stripeConnection} />;
}
