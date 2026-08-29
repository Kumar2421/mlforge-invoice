import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getPlatformAdmin } from "@/lib/platform-admin";

// Exchanges the OAuth `code` Supabase redirects back with for a session.
// Requires the provider (Google/Apple) to actually be enabled in the
// Supabase project's Auth settings — this route alone doesn't grant that.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextParam = request.nextUrl.searchParams.get("next");

  // Build base URL: prefer NEXT_PUBLIC_SITE_URL, fall back to headers
  let base = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
  if (!base.includes("://")) {
    base = `https://${base}`;
  }

  let destination = "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${base}/login?error=auth`);
    }

    // Get current user after session exchange
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(`${base}/login?error=no_user`);
    }

    // Check if platform admin → route to /admin
    const admin = await getPlatformAdmin();
    if (admin) {
      destination = "/admin";
    } else {
      // Returning users skip onboarding.
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
