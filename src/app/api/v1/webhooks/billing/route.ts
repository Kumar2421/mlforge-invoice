import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getBillingStripe, planForPriceId } from "@/lib/billing";

// Webhook for OUR subscription billing (Stripe Checkout + Customer Portal).
// Distinct from /api/v1/webhooks/stripe which ingests a customer's connected
// account events.

const RELEVANT = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

function mapStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return stripeStatus === "trialing" ? "trialing" : "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "past_due";
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_BILLING_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Billing webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let stripe: Stripe;
  let event: Stripe.Event;
  try {
    stripe = getBillingStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Billing webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: record the event id first; a duplicate insert means we already handled it.
  const { error: dedupeError } = await admin
    .from("stripe_webhook_events")
    .insert({ id: event.id, type: event.type });
  if (dedupeError) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (!RELEVANT.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  async function applySubscription(subscription: Stripe.Subscription) {
    const orgId =
      subscription.metadata?.organization_id ||
      (typeof subscription.customer === "string"
        ? (await stripe.customers.retrieve(subscription.customer).then((c) =>
            !("deleted" in c) ? (c.metadata?.organization_id ?? null) : null,
          ))
        : null);

    if (!orgId) {
      console.warn("Billing webhook: no organization_id on subscription", subscription.id);
      return;
    }

    const priceId = subscription.items.data[0]?.price?.id ?? null;
    const plan = planForPriceId(priceId);
    const periodEnd = subscription.items.data[0]?.current_period_end
      ?? (subscription as unknown as { current_period_end?: number }).current_period_end;

    await admin
      .from("organizations")
      .update({
        subscription_status: mapStatus(subscription.status),
        stripe_subscription_id: subscription.id,
        ...(plan ? { plan } : {}),
        ...(periodEnd ? { current_period_end: new Date(periodEnd * 1000).toISOString() } : {}),
      })
      .eq("id", orgId);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription && session.client_reference_id) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await applySubscription(subscription);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await applySubscription(event.data.object as Stripe.Subscription);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
      if (customerId) {
        await admin
          .from("organizations")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
