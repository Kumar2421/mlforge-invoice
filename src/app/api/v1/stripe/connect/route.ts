import { NextRequest, NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function GET(request: NextRequest) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.STRIPE_CLIENT_ID;
  const redirectUri = `${request.nextUrl.origin}/api/v1/stripe/callback`;
  const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_only&state=${workspace.organizationId}&redirect_uri=${redirectUri}`;

  const accept = request.headers.get("Accept") || "";
  if (accept.includes("application/json")) {
    return NextResponse.json({ url: stripeUrl });
  }

  return NextResponse.redirect(stripeUrl);
}
