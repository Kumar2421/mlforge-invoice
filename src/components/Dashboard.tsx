"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  BarChart3,
  BellRing,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Share2,
  Filter,
  MoreVertical,
  Home,
  ArrowRight,
  Settings,
  Sun,
  MoreHorizontal,
  MessageCircle,
  Coins,
  PiggyBank,
  ClipboardList,
  Loader2,
} from "lucide-react";
import InvoicesView from "./InvoicesView";
import ReminderSequenceView from "./ReminderSequenceView";
import ClientsView from "./ClientsView";
import PaymentsView from "./PaymentsView";
import ReportsView from "./ReportsView";
import RemindersView from "./RemindersView";
import SettingsView from "./SettingsView";
import TeamView from "./TeamView";
import AdminDashboard from "./AdminDashboard";
import { MLForgeMark } from "./icons";
import { SupportWidget } from "./SupportWidget";
import { fetchAPI } from "@/utils/api";
import type { Invoice, Payment } from "@/types";

type DashboardProps = {
  displayName: string;
  needsOnboarding?: boolean;
  isFreeTier?: boolean;
};

export default function Dashboard({ displayName, isFreeTier }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const [report, setReport] = useState<{
    collectionRate: number;
    avgDaysToPay: number;
    totalInvoiced: number;
    totalPaid: number;
    collectionByMonth: Array<{ month: string; value: number; height: number }>;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetchAPI('/api/v1/invoices'),
      fetchAPI('/api/v1/payments'),
      fetchAPI('/api/v1/reports').catch(() => ({ data: null })),
    ])
      .then(([invRes, payRes, repRes]) => {
        setInvoices(invRes.data || []);
        setPayments(payRes.data || []);
        setReport(repRes.data || null);
      })
      .catch(err => console.error("Failed to fetch dashboard data", err))
      .finally(() => setIsLoading(false));
  }, []);

  const trendMonths = report?.collectionByMonth ?? [];

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalPaid = payments.filter(p => p.status === 'Succeeded').reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstanding = invoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled').reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  const paidInvoicesCount = invoices.filter(i => i.status === 'Paid').length;
  const totalInvoicesCount = invoices.length;
  
  const breakdownPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.amount || 0), 0);
  const breakdownPending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + (i.amount || 0), 0);
  const breakdownOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.amount || 0), 0);
  const cancelledCount = invoices.filter(i => i.status === 'Cancelled').length;

  const totalBreakdown = breakdownPaid + breakdownPending + breakdownOverdue || 1;
  const paidPct = (breakdownPaid / totalBreakdown) * 100;
  const pendingPct = (breakdownPending / totalBreakdown) * 100;
  const overduePct = (breakdownOverdue / totalBreakdown) * 100;

  const latestPaidInvoice = invoices.find(i => i.status === 'Paid');

  return (
    <div className="flex h-screen bg-white text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-[240px] bg-white border-r border-[#F0F0F0] flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-5 shrink-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
            <MLForgeMark className="h-7 w-7" />
          </div>
          <span className="text-[15px] font-extrabold text-gray-900 tracking-tight">Payment Reminders</span>
        </div>

        {/* Main Menu label */}
        <div className="px-5 pt-3 pb-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 pb-2">
          <ul className="space-y-0.5">
            {[
              { name: "Dashboard", icon: LayoutDashboard },
              { name: "Invoices", icon: FileText },
              { name: "Clients", icon: Users },
              { name: "Payments", icon: CreditCard },
              { name: "Reports", icon: BarChart3 },
              { name: "Reminders", icon: BellRing },
              { name: "Team", icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              const active =
                activeTab === item.name ||
                (item.name === "Reminders" && activeTab === "NewSequence");
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all relative ${active
                        ? "bg-[#F3F4F6] text-gray-900"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#074E5B] rounded-r-full" />
                    )}
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Invoices category section */}
          <div className="mt-6">
            <span className="px-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Invoices</span>
            <ul className="mt-2 space-y-0.5">
              {[
                { name: "Paid", count: paidInvoicesCount, color: "bg-[#074E5B]" },
                { name: "Pending", count: invoices.filter(i => i.status === 'Pending').length, color: "bg-[#F59E0B]" },
                { name: "Overdue", count: overdueCount, color: "bg-[#D1D5DB]" },
                { name: "Cancelled", count: cancelledCount, color: "bg-[#EF4444]" },
                { name: "Drafts", count: invoices.filter(i => !i.status || i.status === 'Draft').length, color: "bg-[#374151]" },
              ].map((s) => {
                const key = s.name === "Drafts" ? "Draft" : s.name;
                const active = statusFilter === key;
                return (
                <li key={s.name}>
                  <button
                    onClick={() => { setActiveTab("Dashboard"); setStatusFilter(active ? null : key); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${active ? "bg-[#F3F4F6] text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.name}
                    </span>
                    <span className="text-[11px] text-gray-400">{s.count}</span>
                  </button>
                </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Usage Summary Card */}
        {/* <div className="px-4 pb-2 shrink-0">
          <div className="border border-[#ECECEC] rounded-2xl p-3.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Usage Summary</span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[22px] font-black text-gray-900 leading-none">1,147</span>
              <span className="text-[11px] text-gray-400 font-semibold">/1,240</span>
              <span className="text-[9px] text-gray-400 font-semibold ml-1">Invoices Left</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F0F0F0] mt-2 overflow-hidden">
              <div className="h-full bg-[#074E5B] rounded-full" style={{ width: "92.5%" }} />
            </div>
            <p className="text-[9px] text-gray-400 mt-1.5 leading-relaxed">Upgrade your plan to unlock unlimited invoices.</p>
            <button className="w-full mt-3 bg-[#074E5B] text-white text-[11px] font-bold py-2 rounded-lg hover:bg-[#053E48] transition-colors">
              Upgrade Now
            </button>
          </div>
        </div> */}

        {/* Connected Accounts (read-only) */}
        <div className="px-4 pb-3 shrink-0">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Connected Accounts</span>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-[#ECECEC]">
              <span className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Stripe
              </span>
              <span className="text-[9px] font-bold text-gray-400">Read-only</span>
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-dashed border-[#E5E7EB]">
              <span className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                PayPal
              </span>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/v1/paypal/connect", { method: "POST" });
                    const data = await res.json();
                    if (data.redirect_url) window.location.href = data.redirect_url;
                  } catch (err) {
                    console.error("PayPal connect failed:", err);
                  }
                }}
                className="text-[9px] font-bold text-[#074E5B] hover:underline"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Settings & Theme */}
        <div className="px-3 pb-4 shrink-0 space-y-0.5 border-t border-[#F0F0F0] pt-2">
          <button
            onClick={() => setActiveTab("Settings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
              activeTab === "Settings" ? "bg-[#F3F4F6] text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </button>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-semibold text-gray-500">
            <span className="flex items-center gap-2.5">
              <Sun className="w-[18px] h-[18px]" />
              Theme
            </span>
            <div className="flex items-center bg-[#F3F4F6] rounded-full p-0.5">
              <button onClick={() => setTheme('light')} className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${theme === 'light' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>Light</button>
              <button onClick={() => setTheme('dark')} className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${theme === 'dark' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>Dark</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F8FA]">
        {/* Persistent top bar */}
        <div className="flex items-center justify-between px-6 pt-4 shrink-0">
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900">
            {activeTab === "Dashboard" ? <Home className="w-3.5 h-3.5 text-gray-400" />
              : activeTab === "Clients" ? <Users className="w-3.5 h-3.5 text-gray-400" />
              : activeTab === "Payments" ? <CreditCard className="w-3.5 h-3.5 text-gray-400" />
              : activeTab === "Reports" ? <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
              : activeTab === "Reminders" || activeTab === "NewSequence" ? <BellRing className="w-3.5 h-3.5 text-gray-400" />
              : activeTab === "Settings" ? <Settings className="w-3.5 h-3.5 text-gray-400" />
              : activeTab === "Team" ? <Users className="w-3.5 h-3.5 text-gray-400" />
              : <FileText className="w-3.5 h-3.5 text-gray-400" />}
            <span>{activeTab === "NewSequence" ? "Reminders" : activeTab}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Search className="w-4 h-4" />
            </button>
            <div className="relative">
              <button onClick={() => setShowAlerts(!showAlerts)} className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-500 hover:bg-gray-50 relative">
                <Bell className="w-4 h-4" />
                {overdueCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444] ring-2 ring-white" />}
              </button>
              {showAlerts && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                  <h4 className="text-[11px] font-bold text-gray-900 mb-2">Alerts</h4>
                  {overdueCount > 0 ? (
                    <div className="text-[10px] text-red-600 bg-red-50 p-2 rounded">
                      You have {overdueCount} overdue invoice(s).
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-500">No new alerts.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === "Invoices" ? (
          <InvoicesView onNewSequence={() => setActiveTab("NewSequence")} />
        ) : activeTab === "NewSequence" ? (
          <ReminderSequenceView onBack={() => setActiveTab("Reminders")} />
        ) : activeTab === "Clients" ? (
          <ClientsView />
        ) : activeTab === "Payments" ? (
          <PaymentsView />
        ) : activeTab === "Reports" ? (
          <ReportsView />
        ) : activeTab === "Reminders" ? (
          <RemindersView onNewSequence={() => setActiveTab("NewSequence")} />
        ) : activeTab === "Settings" ? (
          <SettingsView />
        ) : activeTab === "Team" ? (
          <TeamView />
        ) : (
          <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-6 space-y-4">
            {/* Free tier banner */}
            {isFreeTier && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-bold text-amber-900">Trial expired — Free tier active</p>
                  <p className="text-[11px] text-amber-800 mt-1">View up to 5 invoices. Upgrade to Pro to unlock full features.</p>
                </div>
                <button
                  onClick={() => setActiveTab("Settings")}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-900 px-3 py-1.5 bg-amber-100 rounded hover:bg-amber-200 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            )}

            {/* Greeting + Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Hi, {displayName}</h2>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Here&apos;s a quick look at your invoices performance.</p>
              </div>
              <button
                onClick={() => setActiveTab("NewSequence")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold text-white bg-[#22C55E] rounded-full hover:bg-[#16A34A] transition-colors"
              >
                New Reminder Sequence
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

          {/* ===== Metric Cards Row ===== */}
          <div className="grid grid-cols-4 gap-3">
            {/* Card 1: Total Invoiced */}
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <button onClick={() => setActiveTab("Reports")} className="text-[9px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-0.5">
                  Full Report <span className="text-sm leading-none">↗</span>
                </button>
              </div>
              <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Total Invoiced</p>
              <div className="flex items-end justify-between mt-0.5">
                <p className="text-[18px] font-black text-gray-900 tracking-tight leading-none">
                  ${totalInvoiced.toLocaleString()}<span className="text-[12px] text-gray-300 font-bold">.00</span>
                </p>
                {/* Dot matrix grid */}
                <div className="grid grid-cols-5 gap-[3px]">
                  {[1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1].map((v, i) => (
                    <span key={i} className={`w-[4px] h-[4px] rounded-full ${v ? "bg-[#074E5B]" : "bg-[#E5E7EB]"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Payments Received */}
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400">
                <PiggyBank className="w-4 h-4" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Payments Received</p>
              <div className="flex items-end justify-between mt-0.5">
                <p className="text-[18px] font-black text-gray-900 tracking-tight leading-none">
                  ${totalPaid.toLocaleString()}<span className="text-[12px] text-gray-300 font-bold">.00</span>
                </p>
                {/* Mini bars */}
                <div className="flex items-end gap-[3px] h-8">
                  <div className="w-[5px] bg-[#E5E7EB] rounded-t-sm h-[35%]" />
                  <div className="w-[5px] bg-[#CBD5E1] rounded-t-sm h-[55%]" />
                  <div className="w-[5px] bg-[#074E5B] rounded-t-sm h-[85%]" />
                </div>
              </div>
            </div>

            {/* Card 3: Outstanding Amount */}
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 relative overflow-hidden">
              <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400">
                <Coins className="w-4 h-4" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Outstanding Amount</p>
              <div className="flex items-end justify-between mt-0.5">
                <p className="text-[18px] font-black text-gray-900 tracking-tight leading-none">
                  ${outstanding.toLocaleString()}<span className="text-[12px] text-gray-300 font-bold">.00</span>
                </p>
                {/* Mini bars */}
                <div className="flex items-end gap-[3px] h-8">
                  <div className="w-[5px] bg-[#E5E7EB] rounded-t-sm h-[30%]" />
                  <div className="w-[5px] bg-[#CBD5E1] rounded-t-sm h-[50%]" />
                  <div className="w-[5px] bg-[#94A3B8] rounded-t-sm h-[70%]" />
                </div>
              </div>
            </div>

            {/* Card 4: Reminder Status (dark card) */}
            <div className="bg-[#1E1E24] text-white rounded-2xl flex flex-col justify-between overflow-hidden">
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-semibold">Payment Reminders</span>
                  <span className={`flex items-center gap-1 text-[9px] font-bold ${overdueCount > 0 ? 'text-[#A3E635]' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${overdueCount > 0 ? 'bg-[#A3E635] animate-pulse' : 'bg-gray-400'}`} />
                    {overdueCount > 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-200 font-medium leading-snug mt-2">
                  <span className="text-white font-bold">{overdueCount} overdue invoice{overdueCount === 1 ? '' : 's'}</span> {overdueCount === 1 ? 'has' : 'have'} escalating reminders running.
                </p>
              </div>
              <button onClick={() => setActiveTab("Reminders")} className="bg-[#A3E635] hover:bg-[#84CC16] text-[#1E1E24] font-bold text-[9px] py-2.5 px-4 flex items-center justify-between w-full transition-colors">
                <span>View Reminder Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ===== Revenue + Invoices Overview Grid ===== */}
          <div className="grid grid-cols-12 gap-3">
            {/* Revenue Trend Overview */}
            <div className="col-span-8 bg-white border border-[#ECECEC] rounded-2xl p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-gray-900">Collection Rate Over Time</h3>
                <button onClick={() => setActiveTab("Reports")} className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              {/* Stats row */}
              <div className="flex items-start gap-12 mb-1">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Total Invoiced</span>
                  <p className="text-[20px] font-black text-gray-900 tracking-tight leading-none mt-0.5">
                    ${totalInvoiced.toLocaleString()}<span className="text-[12px] text-gray-300 font-bold">.00</span>
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium mt-1">{totalInvoicesCount} invoice{totalInvoicesCount === 1 ? "" : "s"} tracked</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Collection Rate</span>
                  <p className="text-[20px] font-black text-gray-900 tracking-tight leading-none mt-0.5">
                    {report ? `${report.collectionRate}%` : "—"}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium mt-1">
                    {report ? `${report.avgDaysToPay} avg days to pay` : "No report data yet"}
                  </p>
                </div>
              </div>

              {/* Chart area */}
              <div className="relative mt-4 h-[220px]">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-400 font-semibold w-8">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Grid lines */}
                <div className="absolute left-9 right-0 top-0 bottom-6 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="w-full border-b border-dashed border-gray-100" />
                  ))}
                </div>

                {/* Bar columns */}
                <div className="absolute left-11 right-0 top-0 bottom-0 flex items-end justify-around">
                  {trendMonths.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-400">
                      Sync invoices to see your collection trend
                    </div>
                  )}
                  {trendMonths.map((m) => (
                    <div key={m.month} className="flex flex-col items-center relative">
                      <span className="text-[9px] text-gray-600 font-bold mb-1">{m.value}%</span>
                      <div className="flex items-end h-[150px]">
                        <div className="w-8 bg-[#074E5B] rounded-t-sm" style={{ height: `${Math.max(4, m.height)}%` }} />
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold mt-2">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Invoices Overview */}
            <div className="col-span-4 bg-white border border-[#ECECEC] rounded-2xl p-4 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-gray-900">Invoices Overview</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Invoice Processed</span>
                <button className="flex items-center gap-1 text-[9px] font-semibold text-gray-500 px-2 py-0.5 rounded border border-[#E5E7EB]">
                  This Month <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-[32px] font-black text-gray-900 leading-none">{paidInvoicesCount}</span>
                <span className="text-[14px] text-gray-300 font-bold">/{totalInvoicesCount}</span>
              </div>

              {/* Breakdown stats */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Paid</span>
                  <p className="text-[12px] font-black text-gray-900 mt-0.5">${breakdownPaid.toLocaleString()}<span className="text-[9px] text-gray-300">.00</span></p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Pending</span>
                  <p className="text-[12px] font-black text-gray-900 mt-0.5">${breakdownPending.toLocaleString()}<span className="text-[9px] text-gray-300">.00</span></p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Overdue</span>
                  <p className="text-[12px] font-black text-gray-900 mt-0.5">${breakdownOverdue.toLocaleString()}<span className="text-[9px] text-gray-300">.00</span></p>
                </div>
              </div>

              {/* Cancelled label */}
              <div className="flex justify-end mt-1">
                <span className="text-[9px] font-bold text-red-500">{cancelledCount} Cancelled</span>
              </div>

              {/* Segmented progress bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex gap-[2px] mt-2">
                <div className="bg-[#074E5B] rounded-l-full" style={{ width: `${paidPct}%` }} />
                <div className="bg-[#F59E0B]" style={{ width: `${pendingPct}%` }} />
                <div className="bg-[#EF4444] rounded-r-full" style={{ width: `${overduePct}%` }} />
              </div>

              {/* Latest Paid Invoice */}
              <div className="mt-auto pt-5 border-t border-gray-100">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Latest Paid Invoice</span>
                {latestPaidInvoice ? (
                  <div className="flex items-center justify-between mt-2 bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-gray-900">{latestPaidInvoice.id}</p>
                        <p className="text-[9px] text-gray-400 font-medium">{latestPaidInvoice.clientName}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full bg-white">Paid</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-2 font-medium">No paid invoices found.</p>
                )}
              </div>
            </div>
          </div>

          {/* ===== Bottom Table ===== */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
            {statusFilter && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500">Filtered:</span>
                <button
                  onClick={() => setStatusFilter(null)}
                  className="text-[10px] font-bold text-[#074E5B] bg-[#074E5B]/5 border border-[#074E5B]/20 rounded-full px-2 py-0.5"
                >
                  {statusFilter} ✕
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invoices by people or ID..."
                  className="pl-10 pr-4 py-2 text-[12px] bg-transparent border border-[#E5E7EB] rounded-full w-72 focus:outline-none focus:border-[#074E5B] text-gray-600 placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400 hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F0F0F0] text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Invoice ID</th>
                  <th className="py-3 px-3">People</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reminder</th>
                  <th className="py-3 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5] relative">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="h-32 relative">
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                      </div>
                    </td>
                  </tr>
                )}
                {invoices.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                invoices.slice(0, 5).map((row) => (
                  <tr key={row.id} className="text-[12px] hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="py-3 px-3 text-gray-500 font-medium">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{row.id ? row.id.substring(0, 15) + '...' : '—'}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8EFF0] text-[#074E5B] text-[9px] font-bold flex items-center justify-center shrink-0 uppercase">
                          {(row.clientName || '?').trim().charAt(0)}
                        </div>
                        <span className="font-medium text-gray-700">{row.clientName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">${row.amount?.toLocaleString() || '0'}.00</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          row.status === "Paid"
                            ? "border-gray-200 text-gray-600 bg-white"
                            : row.status === "Overdue"
                            ? "border-red-200 text-red-700 bg-red-50"
                            : "border-amber-200 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-medium">{row.status === 'Overdue' ? 'Active' : '—'}</td>
                    <td className="py-3 px-3">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </main>
        )}
      </div>

      {/* Chat widget floating button */}
      <SupportWidget />
    </div>
  );
}
