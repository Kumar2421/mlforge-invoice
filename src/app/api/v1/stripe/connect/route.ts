import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.STRIPE_CLIENT_ID;
  const redirectUri = `${request.nextUrl.origin}/api/v1/stripe/callback`;
  const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_only&state=${user.id}&redirect_uri=${redirectUri}`;

  const accept = request.headers.get("Accept") || "";
  if (accept.includes("application/json")) {
    return NextResponse.json({ url: stripeUrl });
  }

  return NextResponse.redirect(stripeUrl);
}
