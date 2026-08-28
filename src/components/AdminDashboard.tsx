"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  Cable,
  ChevronRight,
  CircleCheck,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileWarning,
  Gauge,
  Headphones,
  LayoutDashboard,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { MLForgeMark } from "./icons";

type AdminPage =
  | "Overview"
  | "Accounts"
  | "Account 360"
  | "Reminder Ops"
  | "Delivery Log"
  | "Integrations"
  | "Billing"
  | "Support Inbox"
  | "Risk & Audit"
  | "Platform Settings"
  | "System Health";

type Account = {
  id?: string;
  name: string;
  email: string;
  plan: "Pro" | "Solo" | "Trial";
  status: "Active" | "At risk" | "Suspended";
  members: number;
  stripe: "Connected" | "Needs attention" | "Not connected";
  lastActive: string;
};

type OperationalRow = {
  id?: string;
  account: string;
  subject: string;
  status: string;
  detail: string;
  time: string;
};

const mockAccounts: Account[] = [
  { name: "Northstar Studio", email: "hello@northstar.studio", plan: "Pro", status: "Active", members: 8, stripe: "Connected", lastActive: "2 min ago" },
  { name: "Apex Contractors", email: "ops@apexcontractors.com", plan: "Pro", status: "At risk", members: 4, stripe: "Needs attention", lastActive: "1 hr ago" },
  { name: "Bloom & Co.", email: "mira@bloomandco.com", plan: "Solo", status: "Active", members: 1, stripe: "Connected", lastActive: "3 hrs ago" },
  { name: "Cedar Legal", email: "billing@cedarlegal.com", plan: "Trial", status: "Active", members: 2, stripe: "Not connected", lastActive: "Yesterday" },
  { name: "Fieldwork Labs", email: "finance@fieldworklabs.io", plan: "Pro", status: "Suspended", members: 6, stripe: "Connected", lastActive: "Aug 22" },
];

type OverviewData = {
  activeWorkspaces: number;
  newWorkspaces: number;
  activeSequences: number;
  failedStages: number;
  dueSoon: number;
  overdueInvoices: number;
  connectedAccounts: number;
  totalInvoiced: number;
  operatorRole: string;
};

const operationalRows: OperationalRow[] = [
  { account: "Apex Contractors", subject: "INV-3092 · Day 7 reminder", status: "Failed", detail: "Resend returned 429", time: "8 min ago" },
  { account: "Northstar Studio", subject: "INV-4811 · Day 3 reminder", status: "Scheduled", detail: "Due in 34 minutes", time: "Today" },
  { account: "Bloom & Co.", subject: "INV-2208 · Final reminder", status: "Sent", detail: "Delivered to client", time: "Today" },
  { account: "Cedar Legal", subject: "Stripe data sync", status: "Attention", detail: "No connection present", time: "Yesterday" },
];

const activity = [
  ["Reminder paused", "Apex Contractors · INV-3092", "8 min ago"],
  ["Webhook received", "stripe.invoice.paid", "16 min ago"],
  ["Workspace joined", "Cedar Legal added Amanda Moore", "42 min ago"],
  ["Plan changed", "Northstar Studio upgraded to Pro", "2 hrs ago"],
];

const nav: { name: AdminPage; icon: typeof LayoutDashboard }[] = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Accounts", icon: Users },
  { name: "Account 360", icon: Users },
  { name: "Reminder Ops", icon: Bell },
  { name: "Delivery Log", icon: Mail },
  { name: "Integrations", icon: Cable },
  { name: "Billing", icon: CreditCard },
  { name: "Support Inbox", icon: Headphones },
  { name: "Risk & Audit", icon: ShieldCheck },
  { name: "Platform Settings", icon: Settings2 },
  { name: "System Health", icon: Gauge },
];

function StatusPill({ status }: { status: string }) {
  const style = status === "Active" || status === "Connected" || status === "Sent" || status === "Healthy"
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : status === "Failed" || status === "Suspended" || status === "Critical"
      ? "bg-rose-50 text-rose-700 border-rose-100"
      : "bg-amber-50 text-amber-700 border-amber-100";
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${style}`}>{status}</span>;
}

function Metric({ label, value, detail, icon: Icon, emphasis }: { label: string; value: string; detail: string; icon: typeof Gauge; emphasis?: boolean }) {
  return <section className={`rounded-2xl border p-4 ${emphasis ? "border-[#143D4A] bg-[#143D4A] text-white" : "border-[#E8ECEB] bg-white"}`}>
    <div className="flex items-start justify-between"><div className={`rounded-xl p-2 ${emphasis ? "bg-white/10 text-[#C6F26A]" : "bg-[#F2F7F5] text-[#0F5A68]"}`}><Icon className="h-4 w-4" /></div><MoreHorizontal className={`h-4 w-4 ${emphasis ? "text-white/50" : "text-gray-400"}`} /></div>
    <p className={`mt-4 text-[10px] font-bold uppercase tracking-wider ${emphasis ? "text-white/60" : "text-gray-400"}`}>{label}</p>
    <p className="mt-1 text-[22px] font-black tracking-tight">{value}</p>
    <p className={`mt-2 text-[10px] font-semibold ${emphasis ? "text-[#C6F26A]" : "text-gray-500"}`}>{detail}</p>
  </section>;
}

function DataTable({ title, rows = operationalRows, isLive = false }: { title: string; rows?: OperationalRow[]; isLive?: boolean }) {
  return <section className="rounded-2xl border border-[#E8ECEB] bg-white p-4">
    <div className="mb-4 flex items-center justify-between"><div><h2 className="text-[14px] font-black text-gray-900">{title}</h2><p className="mt-0.5 text-[10px] font-medium text-gray-400">{isLive ? "Current platform records from Supabase" : "Mock operational data for the Phase 1 interface"}</p></div><button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"><MoreHorizontal className="h-4 w-4" /></button></div>
    <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-[#EFF2F1] text-[9px] font-bold uppercase tracking-wider text-gray-400"><th className="px-2 py-3">Account</th><th className="px-2 py-3">Event</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Detail</th><th className="px-2 py-3">When</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={`${row.account}-${row.subject}`} className="border-b border-[#F5F6F5] text-[11px] last:border-0"><td className="px-2 py-3 font-bold text-gray-800">{row.account}</td><td className="px-2 py-3 font-semibold text-gray-600">{row.subject}</td><td className="px-2 py-3"><StatusPill status={row.status} /></td><td className="px-2 py-3 text-gray-500">{row.detail}</td><td className="px-2 py-3 text-gray-400">{row.time}</td><td className="px-2 py-3"><ChevronRight className="h-4 w-4 text-gray-300" /></td></tr>)}</tbody></table></div>
  </section>;
}

function Overview({ data }: { data: OverviewData | null }) {
  const metrics = data ?? { activeWorkspaces: 1284, newWorkspaces: 0, activeSequences: 8943, failedStages: 3, dueSoon: 0, overdueInvoices: 0, connectedAccounts: 0, totalInvoiced: 0, operatorRole: "mock" };
  return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Active workspaces" value={metrics.activeWorkspaces.toLocaleString()} detail={data ? `${metrics.newWorkspaces} new in 30 days` : "+8.2% this month"} icon={Users} /><Metric label="Active reminder sequences" value={metrics.activeSequences.toLocaleString()} detail={data ? `${metrics.dueSoon} due in the next hour` : "98.7% delivered"} icon={Bell} /><Metric label="Stripe connections" value={metrics.connectedAccounts.toLocaleString()} detail={data ? `$${metrics.totalInvoiced.toLocaleString()} tracked invoices` : "+$1,420 this month"} icon={BadgeDollarSign} /><Metric label="Needs attention" value={metrics.failedStages.toLocaleString()} detail={data ? `${metrics.overdueInvoices} overdue invoices` : "3 delivery failures now"} icon={AlertTriangle} emphasis /></div><div className="grid gap-4 xl:grid-cols-3"><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4 xl:col-span-2"><div className="flex items-start justify-between"><div><h2 className="text-[14px] font-black">Workspace growth</h2><p className="mt-0.5 text-[10px] text-gray-400">New active workspaces over the last six months</p></div><button className="rounded-lg border border-gray-200 px-2.5 py-1 text-[10px] font-bold text-gray-500">Last 6 months</button></div><div className="mt-8 flex h-44 items-end gap-4 border-b border-dashed border-gray-100 px-3">{[42, 54, 46, 68, 71, 88].map((height, index) => <div className="flex flex-1 flex-col items-center gap-2" key={height}><div className={`w-full max-w-12 rounded-t-lg ${index === 5 ? "bg-[#0F5A68]" : "bg-[#DCECE7]"}`} style={{ height: `${height}%` }} /><span className="text-[9px] font-bold text-gray-400">{["Mar", "Apr", "May", "Jun", "Jul", "Aug"][index]}</span></div>)}</div></section><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4"><div className="flex items-center justify-between"><h2 className="text-[14px] font-black">Live alerts</h2><span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600">{metrics.failedStages} urgent</span></div><div className="mt-3 space-y-3">{["Reminder delivery needs review", "Stripe webhook retries increasing", "Trial workspace needs onboarding"].map((alert, index) => <div className="flex gap-2.5" key={alert}><span className={`mt-1 h-2 w-2 rounded-full ${index === 0 ? "bg-rose-500" : "bg-amber-400"}`} /><div><p className="text-[11px] font-bold text-gray-700">{alert}</p><p className="mt-0.5 text-[9px] text-gray-400">{index === 0 ? "Review platform queue" : "Review today"}</p></div></div>)}</div></section></div><DataTable title="Priority operational queue" /></div>;
}

function Accounts({ records, isLoading, onSelect }: { records: Account[]; isLoading: boolean; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => records.filter((account) => `${account.name} ${account.email}`.toLowerCase().includes(query.toLowerCase())), [query, records]);
  const proCount = records.filter((account) => account.plan === "Pro").length;
  const suspendedCount = records.filter((account) => account.status === "Suspended").length;
  return <div className="space-y-4"><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-[14px] font-black">All workspaces</h2><p className="mt-0.5 text-[10px] text-gray-400">Search and inspect every customer account.</p></div><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" className="w-60 rounded-full border border-gray-200 py-2 pl-9 pr-3 text-[11px] outline-none focus:border-[#0F5A68]" /></label></div><div className="mt-4 overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-[#EFF2F1] text-[9px] font-bold uppercase tracking-wider text-gray-400"><th className="px-2 py-3">Workspace</th><th className="px-2 py-3">Plan</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Members</th><th className="px-2 py-3">Stripe</th><th className="px-2 py-3">Last active</th><th /></tr></thead><tbody>{isLoading ? <tr><td colSpan={7} className="px-2 py-8 text-center text-[11px] text-gray-400">Loading workspaces…</td></tr> : filtered.length ? filtered.map((account) => <tr key={account.id ?? account.email} className="border-b border-[#F5F6F5] text-[11px] last:border-0"><td className="px-2 py-3"><p className="font-bold text-gray-800">{account.name}</p><p className="text-[9px] text-gray-400">{account.email}</p></td><td className="px-2 py-3 font-bold text-gray-600">{account.plan}</td><td className="px-2 py-3"><StatusPill status={account.status} /></td><td className="px-2 py-3 text-gray-500">{account.members}</td><td className="px-2 py-3"><StatusPill status={account.stripe} /></td><td className="px-2 py-3 text-gray-400">{account.lastActive}</td><td className="px-2 py-3"><button onClick={() => account.id && onSelect(account.id)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button></td></tr>) : <tr><td colSpan={7} className="px-2 py-8 text-center text-[11px] text-gray-400">No workspaces match this search.</td></tr>}</tbody></table></div></section><section className="grid gap-3 md:grid-cols-3"><Metric label="Pro workspaces" value={proCount.toString()} detail="from live account settings" icon={CircleDollarSign} /><Metric label="Workspaces" value={records.length.toString()} detail="platform accounts found" icon={Clock3} /><Metric label="Suspended" value={suspendedCount.toString()} detail="requires operator review" icon={FileWarning} /></section></div>;
}

function Account360({ accountId }: { accountId: string | null }) {
  const [accountData, setAccountData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    setIsLoading(true);
    let active = true;
    fetch(`/api/admin/accounts/${accountId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((res) => { if (active && res?.data) setAccountData(res.data); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [accountId]);

  if (!accountId) return <div className="rounded-2xl border border-[#E8ECEB] bg-white p-8 text-center text-[11px] text-gray-500">Please select a workspace from the Accounts view.</div>;
  if (isLoading) return <div className="rounded-2xl border border-[#E8ECEB] bg-white p-8 text-center text-[11px] text-gray-500">Loading workspace context...</div>;
  if (!accountData) return <div className="rounded-2xl border border-[#E8ECEB] bg-white p-8 text-center text-[11px] text-gray-500">Error loading workspace context.</div>;

  const account = accountData;
  const stripeStatus = !account.connection ? "Not connected" : (Date.now() - Date.parse(account.connection.last_synced_at) > 48 * 60 * 60 * 1000) ? "Needs attention" : "Connected";

  const handleSuspendToggle = async () => {
    const isSuspended = account.is_suspended;
    const action = isSuspended ? "unsuspend" : "suspend";
    const reason = window.prompt(`Please provide a reason to ${action} this account (required for audit log):`);
    if (!reason) return; 

    try {
      const res = await fetch(`/api/admin/accounts/${accountId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspend: !isSuspended, reason })
      });
      if (res.ok) {
        alert(`Account ${action}ed successfully.`);
        setAccountData({ ...account, is_suspended: !isSuspended });
      } else {
        alert(`Failed to ${action} account.`);
      }
    } catch (e) {
      alert(`Action failed: ${e}`);
    }
  };

  return <div className="grid gap-4 xl:grid-cols-3"><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4 xl:col-span-2"><div className="flex justify-between items-center"><p className="text-[10px] font-bold uppercase tracking-widest text-[#0F5A68]">Selected workspace</p><button onClick={handleSuspendToggle} className="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50">{account.is_suspended ? "Unsuspend account" : "Suspend account"}</button></div><div className="mt-2 flex items-start justify-between"><div><h2 className="text-xl font-black">{account.name}</h2><p className="mt-1 text-[11px] text-gray-400">{account.email} · {account.plan} plan</p></div><StatusPill status={account.is_suspended ? "Suspended" : account.status} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{[["Members", account.members.toString()], ["Active sequences", account.stats.activeSequences.toString()], ["Outstanding", `$${account.stats.outstanding.toLocaleString()}`]].map(([label, value]) => <div className="rounded-xl bg-[#F6F8F7] p-3" key={label}><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>)}</div><div className="mt-6"><h3 className="text-[12px] font-black">Workspace timeline</h3><div className="mt-3 space-y-3">{account.activity.length === 0 ? <p className="text-[11px] text-gray-400">No activity yet</p> : account.activity.map((event: any, i: number) => <div className="flex gap-3" key={i}><span className="mt-1 h-2 w-2 rounded-full bg-[#0F5A68]" /><div><p className="text-[11px] font-bold">{event.event_type}</p><p className="text-[10px] text-gray-400">{event.description} · {new Date(event.created_at).toLocaleString()}</p></div></div>)}</div></div></section><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4"><h2 className="text-[14px] font-black">Connection health</h2><div className="mt-4 space-y-3"><div className="rounded-xl border border-[#EFF2F1] p-3"><div className="flex justify-between items-start"><p className="text-[10px] font-bold">Stripe</p><StatusPill status={stripeStatus} /></div><p className={`mt-1 text-[10px] ${stripeStatus === "Connected" ? "text-emerald-600" : "text-amber-600"}`}>{account.connection ? `Synced ${new Date(account.connection.last_synced_at).toLocaleString()}` : "No connection"}</p></div><div className="rounded-xl border border-[#EFF2F1] p-3"><p className="text-[10px] font-bold">Email delivery</p><p className="mt-1 text-[10px] text-emerald-600">Pending real data</p></div></div></section></div>;
}

function SplitOperations({ page, rows }: { page: "Reminder Ops" | "Delivery Log" | "Integrations"; rows: OperationalRow[] }) {
  const config = page === "Reminder Ops" ? ["Reminder queue", "Sequences requiring attention", "Failed", "Retry jobs"] : page === "Delivery Log" ? ["Email delivery log", "Provider events and recipient delivery state", "Delivered", "98.7% success"] : ["Integration health", "Connection, sync, and webhook state", "Connected", "1 warning"];
  const failed = rows.filter((row) => row.status === "Failed" || row.status === "Needs attention" || row.status === "Attention").length;

  const handleAction = async (action: "retry" | "pause", targetId: string) => {
    const reason = window.prompt(`Please provide a reason for this ${action} action (required for audit log):`);
    if (!reason) return; // Cancelled or empty

    try {
      const res = await fetch("/api/admin/operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId, reason })
      });
      if (res.ok) alert(`Action ${action} succeeded`);
      else alert(`Action failed`);
    } catch (e) {
      alert(`Action failed: ${e}`);
    }
  };

  return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><Metric label={config[0]} value={rows.length.toLocaleString()} detail={config[1]} icon={page === "Reminder Ops" ? Bell : page === "Delivery Log" ? Mail : Cable} /><Metric label={config[2]} value={failed.toString()} detail={config[3]} icon={page === "Reminder Ops" ? AlertTriangle : CircleCheck} /><Metric label="SLA target" value={page === "Reminder Ops" ? "< 15 min" : page === "Delivery Log" ? "< 5 min" : "Every 6 hrs"} detail="Operational target" icon={Activity} emphasis /></div><DataTable title={config[0]} rows={rows} isLive /><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4"><h2 className="text-[14px] font-black">Operator actions</h2><p className="mt-1 text-[11px] text-gray-500">Select an item above to perform actions.</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { const failedIds = rows.filter(r => r.status === "Failed" && r.id).map(r => r.id); if(failedIds.length > 0) handleAction("retry", failedIds[0] as string); }} className="rounded-lg bg-[#0F5A68] px-3 py-2 text-[10px] font-bold text-white">Retry 1st failure</button><button className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-600">Export events</button><button className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-600">Open diagnostics</button></div></section></div>;
}

function Support() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/support")
      .then((res) => res.ok ? res.json() : null)
      .then((res) => { if (active && res?.data) setTickets(res.data); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return <div className="grid gap-4 xl:grid-cols-3"><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4 xl:col-span-2"><div className="flex items-center justify-between"><div><h2 className="text-[14px] font-black">Support inbox</h2><p className="mt-0.5 text-[10px] text-gray-400">Contact messages become assigned support work in Phase 2.</p></div><button className="rounded-lg bg-[#0F5A68] px-3 py-2 text-[10px] font-bold text-white">New ticket</button></div><div className="mt-4 space-y-2">{isLoading ? <div className="p-4 text-center text-[11px] text-gray-500">Loading tickets...</div> : tickets.length === 0 ? <div className="p-4 text-center text-[11px] text-gray-500">No open tickets.</div> : tickets.map((t) => <div key={t.id} className="flex items-center justify-between rounded-xl border border-[#EFF2F1] p-3"><div><p className="text-[11px] font-bold text-gray-800">{t.subject}</p><p className="mt-0.5 text-[9px] text-gray-400">{t.account} · {t.owner}</p></div><StatusPill status={t.priority} /></div>)}</div></section><section className="rounded-2xl border border-[#E8ECEB] bg-[#143D4A] p-4 text-white"><Headphones className="h-5 w-5 text-[#C6F26A]" /><p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-white/60">SLA health</p><p className="mt-1 text-3xl font-black">92%</p><p className="mt-2 text-[10px] font-semibold text-[#C6F26A]">First response under 4 hours</p></section></div>;
}

function Billing() {
  return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><Metric label="MRR" value="$18,640" detail="+8.2% month over month" icon={BadgeDollarSign} /><Metric label="Active subscriptions" value="1,024" detail="67 trials in progress" icon={CreditCard} /><Metric label="At-risk revenue" value="$420" detail="4 failed renewals" icon={AlertTriangle} emphasis /></div><DataTable title="Subscription operations" rows={operationalRows.map((row, index) => ({ ...row, subject: ["Pro subscription renewed", "Card payment needs attention", "Trial ends in 3 days", "Subscription cancelled"][index], status: ["Active", "Attention", "Scheduled", "Failed"][index], detail: ["$15 monthly", "Payment retry scheduled", "Prompt for upgrade", "Exit survey pending"][index] }))} /></div>;
}

function RiskSettingsHealth({ page }: { page: "Risk & Audit" | "Platform Settings" | "System Health" }) {
  const [auditRows, setAuditRows] = useState<OperationalRow[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    if (page !== "Risk & Audit" && page !== "Platform Settings") return;
    let active = true;
    if (page === "Risk & Audit") {
      fetch("/api/admin/audit")
        .then((res) => res.ok ? res.json() : null)
        .then((res) => { if (active && res?.data) setAuditRows(res.data); })
        .catch(() => undefined);
    } else if (page === "Platform Settings") {
      fetch("/api/admin/settings")
        .then((res) => res.ok ? res.json() : null)
        .then((res) => {
          if (active && res?.data) {
             const settingsMap = res.data.reduce((acc: any, item: any) => { acc[item.key] = item.value; return acc; }, {});
             setSettings(settingsMap);
          }
        })
        .catch(() => undefined);
    }
    return () => { active = false; };
  }, [page]);

  if (page === "Platform Settings") {
    const formatState = (val: any) => {
      if (!val) return "Unknown";
      if (typeof val === "object" && "enabled" in val) return val.enabled ? `Enabled ${val.percentage ? `for ${val.percentage}%` : ""}` : "Disabled";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    };

    return <div className="grid gap-4 xl:grid-cols-2"><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4"><h2 className="text-[14px] font-black">Feature rollout</h2><div className="mt-4 space-y-3">{[["Manual invoice tracking", settings["manual_invoice_tracking"]], ["SMS reminders", settings["sms_reminders"]], ["Team invitations", settings["team_invitations"]]].map(([flag, state]) => <div className="flex items-center justify-between rounded-xl border border-[#EFF2F1] p-3" key={flag as string}><div><p className="text-[11px] font-bold">{flag as string}</p><p className="text-[9px] text-gray-400">{formatState(state)}</p></div><div className={`h-5 w-9 rounded-full p-0.5 ${state?.enabled ? "bg-[#0F5A68]" : "bg-gray-200"}`}><div className={`h-4 w-4 rounded-full bg-white transition-all ${state?.enabled ? "ml-auto" : "ml-0"}`} /></div></div>)}</div></section><section className="rounded-2xl border border-[#E8ECEB] bg-white p-4"><h2 className="text-[14px] font-black">Sending guardrails</h2><div className="mt-4 space-y-3">{[["Daily send limit", settings["daily_send_limit"]], ["Retry window", `${settings["retry_window_minutes"] ?? 0} minutes`], ["Default cadence", Array.isArray(settings["default_cadence_days"]) ? settings["default_cadence_days"].join(" / ") + " days" : ""]].map(([label, value]) => <div className="flex justify-between border-b border-[#F1F3F2] pb-3 text-[11px]" key={label as string}><span className="text-gray-500">{label as string}</span><span className="font-bold">{value as string}</span></div>)}</div></section></div>;
  }

  const title = page === "Risk & Audit" ? "Privileged activity" : "Platform services";
  const rows = page === "Risk & Audit" ? auditRows : [{ account: "Vercel Cron", subject: "Reminder daily sweep", status: "Healthy", detail: "Last run 04:00 UTC", time: "4 min ago" }, { account: "Stripe", subject: "Webhook endpoint", status: "Healthy", detail: "P95 228ms", time: "Live" }, { account: "Resend", subject: "Email provider", status: "Attention", detail: "Elevated 429s", time: "8 min ago" }];
  return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><Metric label={page === "Risk & Audit" ? "Audited events" : "Healthy services"} value={page === "Risk & Audit" ? "2,381" : "8 / 9"} detail="Last 30 days" icon={page === "Risk & Audit" ? ShieldCheck : Gauge} /><Metric label={page === "Risk & Audit" ? "Sensitive actions" : "Error rate"} value={page === "Risk & Audit" ? "14" : "0.12%"} detail="Within target threshold" icon={Activity} /><Metric label="Review needed" value={page === "Risk & Audit" ? "2" : "1"} detail="Mock operational signal" icon={AlertTriangle} emphasis /></div><DataTable title={title} rows={rows} /></div>;
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<AdminPage>("Overview");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [liveAccounts, setLiveAccounts] = useState<Account[]>(mockAccounts);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [operationRows, setOperationRows] = useState<OperationalRow[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/overview").then((response) => response.ok ? response.json() : null),
      fetch("/api/admin/accounts").then((response) => response.ok ? response.json() : null),
    ]).then(([overviewResponse, accountsResponse]) => {
      if (!active) return;
      if (overviewResponse?.data) setOverview(overviewResponse.data as OverviewData);
      if (accountsResponse?.data) setLiveAccounts(accountsResponse.data as Account[]);
    }).finally(() => {
      if (active) setIsLoadingAccounts(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const kind = activePage === "Reminder Ops" ? "reminders" : activePage === "Delivery Log" ? "delivery" : activePage === "Integrations" ? "integrations" : null;
    if (!kind) return;
    let active = true;
    fetch(`/api/admin/operations?kind=${kind}`)
      .then((response) => response.ok ? response.json() : null)
      .then((response) => { if (active && response?.data) setOperationRows(response.data as OperationalRow[]); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [activePage]);

  const handleAccountSelect = (id: string) => {
    setSelectedAccountId(id);
    setActivePage("Account 360");
  };

  const content = activePage === "Overview" ? <Overview data={overview} /> : activePage === "Accounts" ? <Accounts records={liveAccounts} isLoading={isLoadingAccounts} onSelect={handleAccountSelect} /> : activePage === "Account 360" ? <Account360 accountId={selectedAccountId} /> : activePage === "Reminder Ops" || activePage === "Delivery Log" || activePage === "Integrations" ? <SplitOperations page={activePage} rows={operationRows} /> : activePage === "Billing" ? <Billing /> : activePage === "Support Inbox" ? <Support /> : <RiskSettingsHealth page={activePage} />;
  return <div className="flex h-screen min-w-[1024px] overflow-hidden bg-[#F6F8F7] text-[#17221F]"><aside className="flex w-60 shrink-0 flex-col border-r border-[#E7ECE9] bg-white"><div className="flex h-16 items-center gap-2.5 px-5"><MLForgeMark className="h-8 w-8 shrink-0" /><div><p className="text-[13px] font-black tracking-tight">Payment Reminders</p><p className="text-[9px] font-bold uppercase tracking-widest text-[#0F5A68]">Platform admin</p></div></div><div className="px-3 py-3"><p className="px-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">Operate</p></div><nav className="flex-1 overflow-y-auto px-3">{nav.map(({ name, icon: Icon }) => <button key={name} onClick={() => setActivePage(name)} className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[11px] font-bold transition-colors ${activePage === name ? "bg-[#EAF3F0] text-[#0F5A68]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}><Icon className="h-4 w-4" />{name}{name === "Reminder Ops" && <span className="ml-auto rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] text-rose-600">3</span>}</button>)}</nav><div className="m-3 rounded-2xl bg-[#143D4A] p-3 text-white"><p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Internal only</p><p className="mt-1 text-[10px] font-semibold leading-relaxed text-white/80">Every production action will be permissioned and auditable.</p></div></aside><div className="flex min-w-0 flex-1 flex-col"><header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E7ECE9] bg-white px-6"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#0F5A68]">Platform control</p><h1 className="mt-0.5 text-[17px] font-black tracking-tight">{activePage}</h1></div><div className="flex items-center gap-2"><button className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"><Search className="h-4 w-4" /></button><div className="relative"><button onClick={() => setShowAlerts(!showAlerts)} className="relative rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 rounded-full bg-rose-500" /></button>{showAlerts && (<div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 text-left"><h4 className="text-[11px] font-bold text-gray-900 mb-2">Platform Alerts</h4><div className="text-[10px] text-gray-500">No new critical alerts.</div></div>)}</div><div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#DCECE7] text-[11px] font-black text-[#0F5A68]">OP</div></div></header><main className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-[1380px]"><div className="mb-5 flex items-end justify-between"><div><h2 className="text-[20px] font-black tracking-tight">{activePage === "Overview" ? "Good morning, Operator" : activePage}</h2><p className="mt-1 text-[11px] font-medium text-gray-400">Phase 1 UI prototype — local mock data only.</p></div><button className="flex items-center gap-2 rounded-full bg-[#0F5A68] px-3.5 py-2 text-[10px] font-bold text-white hover:bg-[#0C4D59]"><RefreshCw className="h-3.5 w-3.5" />Refresh workspace</button></div>{content}</div></main></div></div>;
}
