import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

export async function POST() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: connection } = await supabase
    .from("stripe_connections")
    .select("restricted_key")
    .eq("organization_id", workspace.organizationId)
    .single();

  if (!connection?.restricted_key) {
    return NextResponse.json({ error: "No Stripe connection found" }, { status: 400 });
  }

  const stripe = new Stripe(connection.restricted_key);

  // 1. Customers -> clients
  const stripeCustomers = await stripe.customers.list({ limit: 100 });
  const clientsData = stripeCustomers.data.map((cus) => ({
    id: cus.id,
    user_id: workspace.userId,
    organization_id: workspace.organizationId,
    name: cus.name || cus.email?.split("@")[0] || "Unknown",
    company: cus.description || "",
    email: cus.email || "",
    avatar_img: Math.floor(Math.random() * 5) + 1,
    total_invoiced: 0,
    outstanding_balance: 0,
    on_time_rate: 100,
    reminders_muted: false,
  }));

  if (clientsData.length > 0) {
    await supabase.from("clients").upsert(clientsData);
  }

  // Rollup client stats: total_invoiced, outstanding_balance from invoices
  const { data: clientsForRollup } = await supabase
    .from("clients")
    .select("id")
    .eq("organization_id", workspace.organizationId);

  for (const client of clientsForRollup || []) {
    const { data: clientInvoices } = await supabase
      .from("invoices")
      .select("amount, status")
      .eq("client_id", client.id)
      .eq("organization_id", workspace.organizationId);

    const totalInvoiced = (clientInvoices || []).reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const outstanding = (clientInvoices || [])
      .filter(inv => inv.status !== "Paid" && inv.status !== "Cancelled")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    await supabase
      .from("clients")
      .update({ total_invoiced: totalInvoiced, outstanding_balance: outstanding })
      .eq("id", client.id);
  }

  // 2. Invoices
  const stripeInvoices = await stripe.invoices.list({ limit: 100 });
  const invoicesData = stripeInvoices.data.map((inv) => {
    let status = "Draft";
    if (inv.status === "paid") status = "Paid";
    if (inv.status === "open") {
      status = inv.due_date && inv.due_date < Date.now() / 1000 ? "Overdue" : "Pending";
    }
    if (inv.status === "void") status = "Cancelled";
    if (inv.status === "uncollectible") status = "Unpaid";

    return {
      id: inv.id,
      user_id: workspace.userId,
      organization_id: workspace.organizationId,
      date: new Date(inv.created * 1000).toISOString(),
      due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
      client_id: typeof inv.customer === "string" ? inv.customer : inv.customer && "id" in inv.customer ? inv.customer.id : null,
      amount: inv.total / 100,
      status,
      synced_from_stripe: true,
    };
  });

  if (invoicesData.length > 0) {
    await supabase.from("invoices").upsert(invoicesData);
  }

  // 3. Charges -> payments
  const stripeCharges = await stripe.charges.list({ limit: 100 });
  const paymentsData = stripeCharges.data.map((charge) => {
    let status = "Pending";
    if (charge.status === "succeeded") status = "Succeeded";
    if (charge.status === "failed") status = "Failed";
    if (charge.refunded) status = "Refunded";

    const invoiceRef = (charge as unknown as { invoice?: string | { id: string } }).invoice;

    return {
      id: charge.id,
      user_id: workspace.userId,
      organization_id: workspace.organizationId,
      date: new Date(charge.created * 1000).toISOString(),
      invoice_id: typeof invoiceRef === "string" ? invoiceRef : invoiceRef?.id ?? null,
      amount: charge.amount / 100,
      method: "Stripe",
      status,
    };
  });

  if (paymentsData.length > 0) {
    await supabase.from("payments").upsert(paymentsData);
  }

  const paidInvoiceIds = invoicesData
    .filter((invoice) => invoice.status === "Paid")
    .map((invoice) => invoice.id);

  if (paidInvoiceIds.length > 0) {
    await supabase
      .from("reminder_sequences")
      .update({ status: "completed" })
      .eq("organization_id", workspace.organizationId)
      .eq("status", "active")
      .in("invoice_id", paidInvoiceIds);
  }

  await supabase
    .from("stripe_connections")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("organization_id", workspace.organizationId);

  return NextResponse.json({
    status: "success",
    synced: { clients: clientsData.length, invoices: invoicesData.length, payments: paymentsData.length },
  });
}
