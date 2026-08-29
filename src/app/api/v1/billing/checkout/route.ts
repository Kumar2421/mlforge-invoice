import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getCurrentWorkspace, isWorkspaceManager } from "@/lib/workspace";
import {
  getBillingStripe,
  priceIdForPlan,
  BILLING_SUCCESS_URL,
  BILLING_CANCEL_URL,
} from "@/lib/billing";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isWorkspaceManager(workspace.role)) {
    return NextResponse.json({ error: "Only workspace owners or admins can manage billing" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = body?.plan === "pro" ? "pro" : "solo";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .select("id, name, stripe_customer_id")
    .eq("id", workspace.organizationId)
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  let stripe;
  let priceId;
  try {
    stripe = getBillingStripe();
    priceId = priceIdForPlan(plan);
  } catch (error) {
    console.error("Billing not configured:", error);
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }

  let customerId = org.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user?.email ?? undefined,
      name: org.name,
      metadata: { organization_id: org.id },
    });
    customerId = customer.id;
    await admin.from("organizations").update({ stripe_customer_id: customerId }).eq("id", org.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: BILLING_SUCCESS_URL,
    cancel_url: BILLING_CANCEL_URL,
    client_reference_id: org.id,
    subscription_data: { metadata: { organization_id: org.id } },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
