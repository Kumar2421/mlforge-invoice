import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state"); // user id passed in /connect

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeClientId = process.env.STRIPE_CLIENT_ID;

  if (!stripeSecretKey || !stripeClientId) {
    return NextResponse.json({ error: "Stripe OAuth env not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  stripe.setClientId(stripeClientId);

  try {
    const tokenResponse = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const connectedAccountId = tokenResponse.stripe_user_id;
    const accessToken = tokenResponse.access_token;

    if (!connectedAccountId || !accessToken) {
      return NextResponse.json({ error: "Stripe OAuth response missing token" }, { status: 502 });
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("stripe_connections").upsert({
      user_id: state,
      stripe_account_id: connectedAccountId,
      restricted_key: accessToken,
      connected_at: new Date().toISOString(),
      last_synced_at: null,
    }, { onConflict: "user_id" });

    if (error) {
      console.error("Stripe connect error:", error);
      return NextResponse.json({ error: "Failed to save connection" }, { status: 500 });
    }

    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard?tab=Settings&stripe_connected=true`);
  } catch (error) {
    console.error("Stripe OAuth exchange failed:", error);
    return NextResponse.json({ error: "Failed to exchange Stripe code" }, { status: 502 });
  }
}
