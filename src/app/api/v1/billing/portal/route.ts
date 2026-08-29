import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getCurrentWorkspace, isWorkspaceManager } from "@/lib/workspace";
import { getBillingStripe, BILLING_PORTAL_RETURN_URL } from "@/lib/billing";

export async function POST() {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isWorkspaceManager(workspace.role)) {
    return NextResponse.json({ error: "Only workspace owners or admins can manage billing" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: org } = await admin
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", workspace.organizationId)
    .single();

  if (!org?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account yet" }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getBillingStripe();
  } catch {
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: org.stripe_customer_id as string,
    return_url: BILLING_PORTAL_RETURN_URL,
  });

  return NextResponse.json({ url: session.url });
}
