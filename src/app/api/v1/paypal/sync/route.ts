import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";
import { fetchPayPalInvoices } from "@/lib/paypal";

/**
 * Sync invoices from PayPal to local DB.
 * (Stub: full impl = map PayPal statuses, handle pagination, upsert logic)
 */
export async function POST() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();

  if (!workspace?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get PayPal connection
  const { data: connection } = await supabase
    .from("paypal_connections")
    .select("access_token")
    .eq("organization_id", workspace.organizationId)
    .single();

  if (!connection?.access_token) {
    return NextResponse.json(
      { error: "No PayPal connection found" },
      { status: 400 }
    );
  }

  // Fetch PayPal invoices
  const paypalInvoices = await fetchPayPalInvoices(connection.access_token);

  // TODO: map PayPal invoices to local schema
  // - invoice.id → local invoice.id (paypal_<paypal_id>)
  // - invoice.status → local status
  // - invoice.payer.name → client name
  // - upsert into invoices table with synced_from_stripe=false (or add synced_from_paypal column)

  // For now: return stub response
  return NextResponse.json({
    status: "success",
    message: "PayPal sync stub — full implementation pending",
    synced: {
      invoices: paypalInvoices.length,
    },
  });
}
