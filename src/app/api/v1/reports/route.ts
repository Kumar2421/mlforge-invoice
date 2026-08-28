import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace";

type InvoiceRow = {
  id: string;
  date: string;
  amount: number;
  status: string;
  client_id: string | null;
  clients?: { name?: string | null } | null;
};

type PaymentRow = {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoice_id: string | null;
  invoices?: { client_id?: string | null } | null;
};

type ActivityRow = {
  invoice_id: string | null;
  event_type: string;
  created_at: string;
};

function monthKey(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export async function GET() {
  const supabase = await createClient();
  const workspace = await getCurrentWorkspace();
  if (!workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [invoiceRes, paymentRes, activityRes] = await Promise.all([
    supabase.from("invoices").select("id, date, amount, status, client_id, clients(name)").eq("organization_id", workspace.organizationId),
    supabase.from("payments").select("id, date, amount, status, invoice_id, invoices(client_id)").eq("organization_id", workspace.organizationId),
    supabase.from("reminder_activity_log").select("invoice_id, event_type, created_at").eq("organization_id", workspace.organizationId),
  ]);

  if (invoiceRes.error) {
    return NextResponse.json({ error: invoiceRes.error.message }, { status: 500 });
  }

  if (paymentRes.error) {
    return NextResponse.json({ error: paymentRes.error.message }, { status: 500 });
  }

  if (activityRes.error) {
    return NextResponse.json({ error: activityRes.error.message }, { status: 500 });
  }

  const invoices = (invoiceRes.data ?? []) as InvoiceRow[];
  const payments = (paymentRes.data ?? []) as PaymentRow[];
  const activity = (activityRes.data ?? []) as ActivityRow[];

  const totalInvoiced = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const totalPaid = payments
    .filter((payment) => payment.status === "Succeeded")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstanding = invoices
    .filter((invoice) => invoice.status !== "Paid" && invoice.status !== "Cancelled")
    .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  const invoiceById = new Map(invoices.map((invoice) => [invoice.id, invoice]));
  const paymentByInvoiceId = new Map<string, PaymentRow[]>();
  for (const payment of payments.filter((item) => item.status === "Succeeded")) {
    const invoiceId = payment.invoice_id;
    if (!invoiceId) continue;
    const bucket = paymentByInvoiceId.get(invoiceId) ?? [];
    bucket.push(payment);
    paymentByInvoiceId.set(invoiceId, bucket);
  }

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");
  const paymentsWithInvoice = paidInvoices
    .map((invoice) => {
      const payment = paymentByInvoiceId.get(invoice.id)?.sort((left, right) => Date.parse(left.date) - Date.parse(right.date))[0];
      if (!payment) return null;
      return {
        invoice,
        payment,
      };
    })
    .filter(Boolean) as Array<{ invoice: InvoiceRow; payment: PaymentRow }>;

  const daysToPay = paymentsWithInvoice
    .map(({ invoice, payment }) => {
      const invoiceDate = Date.parse(invoice.date);
      const paymentDate = Date.parse(payment.date);
      if (!Number.isFinite(invoiceDate) || !Number.isFinite(paymentDate)) return null;
      return (paymentDate - invoiceDate) / (1000 * 60 * 60 * 24);
    })
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0);

  const avgDaysToPay = daysToPay.length > 0 ? Math.round(daysToPay.reduce((sum, day) => sum + day, 0) / daysToPay.length) : 0;

  const reminderSentAt = new Map<string, Date>();
  for (const row of activity) {
    if (row.event_type !== "email_sent" || !row.invoice_id) continue;
    const createdAt = new Date(row.created_at);
    const existing = reminderSentAt.get(row.invoice_id);
    if (!existing || createdAt < existing) {
      reminderSentAt.set(row.invoice_id, createdAt);
    }
  }

  const reminderEffectivenessCount = paymentsWithInvoice.filter(({ invoice, payment }) => {
    const reminderDate = reminderSentAt.get(invoice.id);
    if (!reminderDate) return false;
    const paymentDate = new Date(payment.date);
    const diffHours = (paymentDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 48;
  }).length;

  const reminderEffectiveness = paymentsWithInvoice.length > 0
    ? Math.round((reminderEffectivenessCount / paymentsWithInvoice.length) * 100)
    : 0;

  const now = new Date();
  const monthBuckets = Array.from({ length: 4 }, (_, index) => {
    const reference = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (3 - index), 1));
    return {
      key: monthKey(reference),
      start: startOfMonth(reference),
      end: new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1)),
      invoiced: 0,
      collected: 0,
    };
  });

  for (const invoice of invoices) {
    const date = new Date(invoice.date);
    const bucket = monthBuckets.find((item) => date >= item.start && date < item.end);
    if (!bucket) continue;
    bucket.invoiced += Number(invoice.amount || 0);
  }

  for (const payment of payments.filter((item) => item.status === "Succeeded")) {
    const date = new Date(payment.date);
    const bucket = monthBuckets.find((item) => date >= item.start && date < item.end);
    if (!bucket) continue;
    bucket.collected += Number(payment.amount || 0);
  }

  const collectionByMonth = monthBuckets.map((bucket) => ({
    month: bucket.key,
    value: bucket.invoiced > 0 ? Math.round((bucket.collected / bucket.invoiced) * 100) : 0,
    height: bucket.invoiced > 0 ? Math.max(20, Math.min(100, Math.round((bucket.collected / bucket.invoiced) * 100))) : 20,
  }));

  const revenueByClientMap = new Map<string, number>();
  for (const payment of payments.filter((item) => item.status === "Succeeded")) {
    const invoice = payment.invoice_id ? invoiceById.get(payment.invoice_id) : null;
    const clientName = invoice?.clients?.name || invoice?.client_id || "Unknown";
    revenueByClientMap.set(clientName, (revenueByClientMap.get(clientName) ?? 0) + Number(payment.amount || 0));
  }

  const revenueByClient = Array.from(revenueByClientMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 5);

  const topRevenue = revenueByClient[0]?.amount || 1;

  return NextResponse.json({
    data: {
      reminderEffectiveness,
      avgDaysToPay,
      collectionRate,
      totalInvoiced,
      totalPaid,
      outstanding,
      collectionByMonth,
      revenueByClient: revenueByClient.map((item) => ({
        ...item,
        pct: Math.max(10, Math.round((item.amount / topRevenue) * 100)),
      })),
    },
  });
}
