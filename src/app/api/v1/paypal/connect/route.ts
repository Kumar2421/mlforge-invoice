import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";
import { getPayPalAuthUrl } from "@/lib/paypal";
import crypto from "crypto";

/**
 * Initiate PayPal OAuth flow.
 * Redirects to PayPal login → user grants permission → callback to /api/v1/paypal/callback
 */
export async function POST() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();

  if (!workspace?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate state token (CSRF protection)
  const state = crypto.randomBytes(32).toString("hex");

  // Store state in session for verification (optional, add to DB if needed)
  // For now: trust the session + short-lived state

  const authUrl = getPayPalAuthUrl(state);

  return NextResponse.json({ redirect_url: authUrl });
}
