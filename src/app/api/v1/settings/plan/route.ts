import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan } = await request.json();

    if (!plan || !['solo', 'pro'].includes(plan)) {
       return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // In a real flow, this would create a Stripe Checkout Session
    // For now, we just mock the success by setting subscription_status to active
    
    // First find the user's organization
    const { data: orgRow } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("created_by", user.id)
      .limit(1)
      .maybeSingle();

    if (!orgRow) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Update organization subscription status
    await supabaseAdmin
      .from("organizations")
      .update({ subscription_status: 'active' })
      .eq("id", orgRow.id);

    // Update account_settings plan
    await supabaseAdmin
      .from("account_settings")
      .upsert({ user_id: user.id, plan_slug: plan }, { onConflict: "user_id" });

    return NextResponse.json({ success: true, message: "Subscription activated" });
  } catch (error) {
    console.error("Failed to update plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
