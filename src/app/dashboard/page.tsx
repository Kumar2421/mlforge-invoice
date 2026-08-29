import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";
import { TRIAL_DAYS } from "@/lib/billing";

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

  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    // No membership yet (trigger race on a fresh signup) — send to onboarding.
    redirect("/onboarding");
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("onboarded_at, trial_starts_at, subscription_status")
    .eq("id", workspace.organizationId)
    .maybeSingle();

  const status = org?.subscription_status ?? "trialing";

  // A paying subscription: always allowed.
  if (status === "active") {
    if (!org?.onboarded_at) redirect("/onboarding");
    return <Dashboard displayName={displayName} needsOnboarding={false} />;
  }

  // Past due or canceled: payment period ended → paywall.
  if (status === "past_due" || status === "canceled") {
    redirect("/activate");
  }

  // Trialing: allowed until the trial window closes.
  const trialStarts = new Date(org?.trial_starts_at || new Date().toISOString());
  const daysElapsed = (Date.now() - trialStarts.getTime()) / (1000 * 60 * 60 * 24);
  const isTrialExpired = daysElapsed > TRIAL_DAYS;

  if (!org?.onboarded_at) {
    redirect("/onboarding");
  }

  return (
    <Dashboard
      displayName={displayName}
      needsOnboarding={false}
      isFreeTier={isTrialExpired}
    />
  );
}
