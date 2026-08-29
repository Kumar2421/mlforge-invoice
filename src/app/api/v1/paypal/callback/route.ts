import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";
import { exchangePayPalCode } from "@/lib/paypal";

/**
 * PayPal OAuth callback.
 * Exchanges code for access token, stores in DB, redirects to dashboard.
 * (Stub: full impl = handle token refresh, error cases)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();

  if (!workspace?.organizationId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?paypal_error=no_code`
    );
  }

  // Exchange code for token
  const token = await exchangePayPalCode(code);
  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?paypal_error=token_exchange_failed`
    );
  }

  // TODO: extract paypal_account_id from token (via /v2/oauth2/token endpoint response)
  // For stub: use placeholder
  const paypalAccountId = "placeholder_paypal_id";

  // Store connection in DB
  const { error } = await supabase.from("paypal_connections").upsert(
    {
      user_id: workspace.userId,
      organization_id: workspace.organizationId,
      access_token: token.access_token,
      refresh_token: token.refresh_token || null,
      token_expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      paypal_account_id: paypalAccountId,
      paypal_email: null, // TODO: fetch from PayPal API
    },
    { onConflict: "organization_id" }
  );

  if (error) {
    console.error("PayPal connection store error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?paypal_error=store_failed`
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?paypal_connected=true`
  );
}
