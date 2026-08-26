import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state"); // user id passed in /connect

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // TODO(Phase 1): exchange `code` at https://connect.stripe.com/oauth/token for a
  // real restricted (read-only) key. Placeholder values below until that's wired.
  const mockStripeAccountId = "acct_12345mock";
  const mockRestrictedKey = "rk_test_mock123";

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("stripe_connections").insert({
    user_id: state,
    stripe_account_id: mockStripeAccountId,
    restricted_key: mockRestrictedKey,
  });

  if (error) {
    console.error("Stripe connect error:", error);
    return NextResponse.json({ error: "Failed to save connection" }, { status: 500 });
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard?tab=Settings&stripe_connected=true`);
}
