import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Exchanges the OAuth `code` Supabase redirects back with for a session.
// Requires the provider (Google/Apple) to actually be enabled in the
// Supabase project's Auth settings — this route alone doesn't grant that.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
}
