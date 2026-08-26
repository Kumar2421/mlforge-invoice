import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

type StripeInvoiceLike = {
  id: string;
  created: number;
  amount_paid?: number;
  amount?: number;
  charge?: string | null;
  payment_intent?: string | null;
  customer?: string | { id: string } | null;
};

type StripeChargeLike = {
  id: string;
  created: number;
  amount: number;
  invoice?: string | { id: string } | null;
  customer?: string | { id: string } | null;
};

function toInvoiceId(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function completeReminderSequence(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  userId: string,
  invoiceId: string,
  clientId: string | null,
  eventType: string
) {
  const { data: sequences } = await supabaseAdmin
    .from("reminder_sequences")
    .select("id")
    .eq("user_id", userId)
    .eq("invoice_id", invoiceId)
    .eq("status", "active");

  if (!sequences || sequences.length === 0) {
    return;
  }

  const sequenceIds = sequences.map((sequence) => sequence.id);
  const now = new Date().toISOString();

  await supabaseAdmin
    .from("reminder_sequences")
    .update({ status: "completed", updated_at: now })
    .in("id", sequenceIds);

  await supabaseAdmin
    .from("reminder_stages")
    .update({ status: "skipped" })
    .in("sequence_id", sequenceIds)
    .in("status", ["pending", "scheduled"]);

  await supabaseAdmin.from("reminder_activity_log").insert(
    sequenceIds.map((sequenceId) => ({
      user_id: userId,
      invoice_id: invoiceId,
      client_id: clientId,
      event_type: "sequence_completed",
      description: `Sequence completed after Stripe ${eventType}`,
      metadata: {
        sequence_id: sequenceId,
        event_type: eventType,
      },
    }))
  );
}

async function upsertPaidInvoice(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  userId: string,
  clientId: string | null,
  invoiceId: string,
  amountInCents: number,
  createdAt: string
) {
  await supabaseAdmin.from("invoices").upsert(
    {
      id: invoiceId,
      user_id: userId,
      client_id: clientId,
      date: createdAt,
      due_date: null,
      amount: amountInCents / 100,
      status: "Paid",
    },
    { onConflict: "id" }
  );
}

async function upsertStripePayment(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  userId: string,
  invoiceId: string,
  paymentId: string,
  amountInCents: number,
  createdAt: string
) {
  await supabaseAdmin.from("payments").upsert(
    {
      id: paymentId,
      user_id: userId,
      invoice_id: invoiceId,
      date: createdAt,
      amount: amountInCents / 100,
      method: "Stripe",
      status: "Succeeded",
    },
    { onConflict: "id" }
  );
}

async function resolveOwner(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  invoiceId: string
) {
  const { data: invoiceRow } = await supabaseAdmin
    .from("invoices")
    .select("user_id, client_id")
    .eq("id", invoiceId)
    .maybeSingle();

  if (invoiceRow?.user_id) {
    return invoiceRow;
  }

  const { data: sequenceRow } = await supabaseAdmin
    .from("reminder_sequences")
    .select("user_id, client_id")
    .eq("invoice_id", invoiceId)
    .maybeSingle();

  return sequenceRow ?? null;
}

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook env not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = new Stripe(stripeSecretKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  if (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as StripeInvoiceLike;
    const invoiceId = invoice.id;
    const owner = await resolveOwner(supabaseAdmin, invoiceId);

    if (owner) {
      const createdAt = new Date(invoice.created * 1000).toISOString();
      const amountInCents = invoice.amount_paid ?? invoice.amount ?? 0;
      const paymentId = invoice.charge || invoice.payment_intent || invoice.id;

      await upsertPaidInvoice(supabaseAdmin, owner.user_id, owner.client_id ?? null, invoiceId, amountInCents, createdAt);

      if (paymentId) {
        await upsertStripePayment(
          supabaseAdmin,
          owner.user_id,
          invoiceId,
          paymentId,
          amountInCents,
          createdAt
        );
      }

      await completeReminderSequence(
        supabaseAdmin,
        owner.user_id,
        invoiceId,
        owner.client_id ?? null,
        event.type
      );
    }
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as StripeChargeLike;
    const invoiceId = toInvoiceId(charge.invoice);

    if (invoiceId) {
      const owner = await resolveOwner(supabaseAdmin, invoiceId);

      if (owner) {
        const createdAt = new Date(charge.created * 1000).toISOString();

        await upsertPaidInvoice(
          supabaseAdmin,
          owner.user_id,
          owner.client_id ?? null,
          invoiceId,
          charge.amount,
          createdAt
        );
        await upsertStripePayment(
          supabaseAdmin,
          owner.user_id,
          invoiceId,
          charge.id,
          charge.amount,
          createdAt
        );
        await completeReminderSequence(
          supabaseAdmin,
          owner.user_id,
          invoiceId,
          owner.client_id ?? null,
          event.type
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
