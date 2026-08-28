import { NextRequest, NextResponse } from "next/server";
import { getPlatformAdmin } from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase-admin";

type OperationKind = "reminders" | "delivery" | "integrations";

function displayTime(value: string | null) {
  if (!value) return "Not available";
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return value;
  const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} hr ago`;
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET(request: NextRequest) {
  const operator = await getPlatformAdmin();
  if (!operator) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const kind = request.nextUrl.searchParams.get("kind") as OperationKind | null;
  if (!kind || !["reminders", "delivery", "integrations"].includes(kind)) {
    return NextResponse.json({ error: "Invalid operation kind" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (kind === "reminders") {
    const { data, error } = await supabase
      .from("reminder_stages")
      .select("id, day, status, scheduled_for, executed_at, error_message, reminder_sequences!inner(invoice_id, clients!inner(name))")
      .order("scheduled_for", { ascending: true })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = (data ?? []).map((stage) => {
      const sequence = stage.reminder_sequences as unknown as { invoice_id: string; clients: { name: string } | null };
      const status = stage.status === "failed" ? "Failed" : stage.status === "sent" ? "Sent" : stage.status === "pending" ? "Scheduled" : "Attention";
      return {
        id: stage.id,
        account: sequence?.clients?.name ?? "Unknown workspace",
        subject: `${sequence?.invoice_id ?? "Unknown invoice"} · Day ${stage.day} reminder`,
        status,
        detail: stage.error_message ?? (stage.status === "sent" ? "Reminder stage processed" : `Scheduled for ${new Date(stage.scheduled_for).toLocaleString()}`),
        time: displayTime(stage.executed_at ?? stage.scheduled_for),
      };
    });
    return NextResponse.json({ data: rows });
  }

  if (kind === "delivery") {
    const { data, error } = await supabase
      .from("reminder_activity_log")
      .select("id, event_type, description, created_at, clients(name), invoices(id)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = (data ?? []).map((event) => {
      const client = Array.isArray(event.clients) ? event.clients[0] : event.clients;
      const invoice = Array.isArray(event.invoices) ? event.invoices[0] : event.invoices;
      return {
      account: client?.name ?? "Unknown workspace",
      subject: invoice?.id ? `${invoice.id} · ${event.event_type}` : event.event_type,
      status: event.event_type === "email_sent" ? "Sent" : event.event_type.includes("failed") ? "Failed" : "Attention",
      detail: event.description,
      time: displayTime(event.created_at),
      };
    });
    return NextResponse.json({ data: rows });
  }

  const [connectionsResult, usersResult] = await Promise.all([
    supabase.from("stripe_connections").select("stripe_account_id, user_id, connected_at, last_synced_at").order("connected_at", { ascending: false }).limit(50),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const error = connectionsResult.error || usersResult.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const emailByUser = new Map((usersResult.data.users ?? []).map((user) => [user.id, user.email ?? "Unknown workspace"]));
  const staleThreshold = Date.now() - 48 * 60 * 60 * 1000;
  const rows = (connectionsResult.data ?? []).map((connection) => {
    const lastSynced = connection.last_synced_at ? Date.parse(connection.last_synced_at) : null;
    const stale = !lastSynced || lastSynced < staleThreshold;
    return {
      account: emailByUser.get(connection.user_id) ?? "Unknown workspace",
      subject: `Stripe · ${connection.stripe_account_id}`,
      status: stale ? "Needs attention" : "Connected",
      detail: connection.last_synced_at ? `Last synced ${displayTime(connection.last_synced_at)}` : "No sync has completed",
      time: displayTime(connection.connected_at),
    };
  });
  return NextResponse.json({ data: rows });
}
