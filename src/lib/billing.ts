import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";

/**
 * Billing = OUR own subscription (the money customers pay US), deliberately
 * separate from the read-only Stripe connection to a customer's account.
 * Different keys, different module.
 */

export function getBillingStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export const PLAN_PRICE_ENV: Record<"solo" | "pro", string> = {
  solo: "STRIPE_PRICE_SOLO",
  pro: "STRIPE_PRICE_PRO",
};

export function priceIdForPlan(plan: "solo" | "pro"): string {
  const id = process.env[PLAN_PRICE_ENV[plan]];
  if (!id) throw new Error(`${PLAN_PRICE_ENV[plan]} is not set`);
  return id;
}

export function planForPriceId(priceId: string | null | undefined): "solo" | "pro" | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_SOLO) return "solo";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return null;
}

/** Length of the free trial, in days. Keep in sync with onboarding + landing copy. */
export const TRIAL_DAYS = 3;

export const BILLING_SUCCESS_URL = `${SITE_URL}/dashboard?billing=success`;
export const BILLING_CANCEL_URL = `${SITE_URL}/activate?billing=cancelled`;
export const BILLING_PORTAL_RETURN_URL = `${SITE_URL}/dashboard`;
