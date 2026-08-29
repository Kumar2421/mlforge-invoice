import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Exchanges the OAuth `code` Supabase redirects back with for a session.
// Requires the provider (Google/Apple) to actually be enabled in the
// Supabase project's Auth settings — this route alone doesn't grant that.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextParam = request.nextUrl.searchParams.get("next");

  // Behind a reverse proxy (Vercel/Netlify) `request.nextUrl.origin` can resolve
  // to the internal host (localhost), so a redirect built from it lands the user
  // on localhost. Prefer the configured public site URL, then the forwarded host,
  // then finally the request origin.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const configuredBase =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL || // Netlify sets this to the site's primary URL
    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin);

  const base = configuredBase.replace(/\/$/, "");

  let destination = "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${base}/login?error=auth`);
    }

    // Returning users skip onboarding.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: org } = await supabase
        .from("organizations")
        .select("onboarded_at")
        .eq("created_by", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (org?.onboarded_at) {
        destination = "/dashboard";
      }
    }
  }

  // Honor a safe relative `next` param if present.
  if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
    destination = nextParam;
  }

  return NextResponse.redirect(`${base}${destination}`);
}
