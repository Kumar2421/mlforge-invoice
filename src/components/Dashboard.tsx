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
  ChevronLeft,
  ChevronRight,
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
import { fetchAPI } from "@/utils/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAPI('/api/v1/invoices'),
      fetchAPI('/api/v1/payments')
    ])
      .then(([invRes, payRes]) => {
        setInvoices(invRes.data || []);
        setPayments(payRes.data || []);
      })
      .catch(err => console.error("Failed to fetch dashboard data", err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalPaid = payments.filter(p => p.status === 'Succeeded' || p.status === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstanding = invoices.filter(inv => inv.status !== 'Paid' && inv.status !== 'Cancelled' && inv.status !== 'Void').reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  return (
    <div className="flex h-screen bg-white text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-[240px] bg-white border-r border-[#F0F0F0] flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-5 shrink-0">
          {/* Leaf icon */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#22C55E" />
              <path
                d="M9 18C9 14 12 10 18 9C17 13 15 16 11 18C10.5 18.3 9.5 18.3 9 18Z"
                fill="white"
                stroke="white"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="text-[15px] font-extrabold text-gray-900 tracking-tight">mlforge Invoice</span>
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
                { name: "Paid", count: 124, color: "bg-[#074E5B]" },
                { name: "Pending", count: 25, color: "bg-[#F59E0B]" },
                { name: "Overdue", count: 8, color: "bg-[#D1D5DB]" },
                { name: "Cancelled", count: 3, color: "bg-[#EF4444]" },
                { name: "Drafts", count: 2, color: "bg-[#374151]" },
              ].map((s) => (
                <li key={s.name}>
                  <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-all">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.name}
                    </span>
                    <span className="text-[11px] text-gray-400">{s.count}</span>
                  </button>
                </li>
              ))}
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
              <button className="text-[9px] font-bold text-[#074E5B] hover:underline">Connect</button>
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
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-white text-gray-800 shadow-sm">Light</span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full text-gray-400 cursor-pointer">Dark</span>
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
              : <FileText className="w-3.5 h-3.5 text-gray-400" />}
            <span>{activeTab === "NewSequence" ? "Reminders" : activeTab}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-gray-500 hover:bg-gray-50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
            </button>
          </div>
        </div>

        {activeTab === "Invoices" ? (
          <InvoicesView onNewSequence={() => setActiveTab("NewSequence")} />
        ) : activeTab === "NewSequence" ? (
          <ReminderSequenceView />
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
        ) : (
          <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-6 space-y-4">
            {/* Greeting + Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Hi, Jamil Suta 👋</h2>
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
                <button className="text-[9px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-0.5">
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
              <p className="text-[9px] text-gray-400 font-medium mt-1.5">
                <span className="text-green-600 font-bold">+6.4%</span> than last month
              </p>
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
              <p className="text-[9px] text-gray-400 font-medium mt-1.5">
                <span className="text-green-600 font-bold">+4.1%</span> than last month
              </p>
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
              <p className="text-[9px] text-gray-400 font-medium mt-1.5">
                <span className="text-red-500 font-bold">-2.8%</span> than last month
              </p>
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
                  <span className="text-white font-bold">{overdueCount} overdue invoices</span> {overdueCount === 1 ? 'has' : 'have'} escalating reminders running. Next email goes out in 2 days.
                </p>
              </div>
              <button className="bg-[#A3E635] hover:bg-[#84CC16] text-[#1E1E24] font-bold text-[9px] py-2.5 px-4 flex items-center justify-between w-full transition-colors">
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
                <h3 className="text-[14px] font-bold text-gray-900">Revenue Trend Overview</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              {/* Stats row */}
              <div className="flex items-start gap-12 mb-1">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Total Invoiced</span>
                  <p className="text-[20px] font-black text-gray-900 tracking-tight leading-none mt-0.5">
                    $101,480<span className="text-[12px] text-gray-300 font-bold">.00</span>
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium mt-1">Revenue peaked in <span className="font-bold text-gray-600">September</span></p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Projected Revenue</span>
                  <p className="text-[20px] font-black text-gray-900 tracking-tight leading-none mt-0.5">
                    $25,600<span className="text-[12px] text-gray-300 font-bold">.00</span>
                  </p>
                  <p className="text-[9px] text-teal-600 font-semibold mt-1">AI forecast +6.9% growth expected</p>
                </div>
                <div className="flex items-center gap-2.5 ml-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-400 font-semibold">Comparison</span>
                    <div className="w-8 h-[18px] bg-[#074E5B] rounded-full p-[2px] relative cursor-pointer">
                      <span className="block w-[14px] h-[14px] rounded-full bg-white absolute right-[2px] top-[2px]" />
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                    All Periods <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Chart area */}
              <div className="relative mt-4 h-[220px]">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-400 font-semibold w-7">
                  <span>$10k</span>
                  <span>$9k</span>
                  <span>$8k</span>
                  <span>$7k</span>
                  <span>$6k</span>
                  <span>$0</span>
                </div>

                {/* Grid lines */}
                <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-full border-b border-dashed border-gray-100" />
                  ))}
                </div>

                {/* Peak dashed line */}
                <div className="absolute left-8 right-0 top-[8%] border-b-2 border-dashed border-[#22C55E]/30 z-10" />

                {/* Bar columns */}
                <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end justify-around">
                  {/* Jul */}
                  <div className="flex flex-col items-center relative">
                    {/* Lowest badge */}
                    <div className="absolute -top-[12px] left-1/2 -translate-x-[calc(50%+30px)] bg-[#F3F4F6] text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded border border-gray-200 z-20 whitespace-nowrap">
                      $6,810
                    </div>
                    <span className="absolute -top-[26px] left-1/2 -translate-x-[calc(50%+30px)] text-[8px] text-gray-400 font-semibold z-20">Lowest</span>
                    <div className="flex items-end gap-[2px] h-[150px]">
                      <div className="w-3 bg-[#E8E8E8] rounded-t-sm" style={{ height: "55%" }} />
                      <div className="w-3 bg-[#D1D5DB] rounded-t-sm" style={{ height: "45%" }} />
                      <div className="w-3 bg-[#CBD5E1] rounded-t-sm" style={{ height: "60%" }} />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <ChevronLeft className="w-3 h-3 text-gray-400 cursor-pointer" />
                      <span className="text-[9px] text-gray-400 font-bold">Jul</span>
                    </div>
                  </div>

                  {/* Aug */}
                  <div className="flex flex-col items-center relative">
                    {/* Average badge */}
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-[#1E1E24] text-white text-[9px] font-bold px-2 py-0.5 rounded z-20 whitespace-nowrap">
                      $8,060
                    </div>
                    <span className="absolute top-[24px] left-1/2 -translate-x-1/2 text-[8px] text-gray-400 font-semibold z-20">Average</span>
                    <div className="flex items-end gap-[2px] h-[150px]">
                      <div className="w-3 bg-[#E8E8E8] rounded-t-sm" style={{ height: "60%" }} />
                      <div className="w-3 bg-[#D1D5DB] rounded-t-sm" style={{ height: "65%" }} />
                      <div className="w-3 bg-[#94A3B8] rounded-t-sm" style={{ height: "75%" }} />
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold mt-2">Aug</span>
                  </div>

                  {/* Sep (peak) */}
                  <div className="flex flex-col items-center relative">
                    {/* Peak badge */}
                    <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                      <span className="text-[8px] text-green-600 font-bold uppercase tracking-widest">Peak Month</span>
                      <span className="bg-[#074E5B] text-white text-[9px] font-bold px-2 py-0.5 rounded mt-0.5">$9,420</span>
                    </div>
                    <div className="flex items-end gap-[2px] h-[150px]">
                      <div className="w-3 bg-[#E8E8E8] rounded-t-sm" style={{ height: "55%" }} />
                      <div className="w-3 bg-[#074E5B] rounded-t-sm" style={{ height: "92%" }} />
                      <div className="w-3 bg-[#B0BEC5] rounded-t-sm" style={{ height: "65%" }} />
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold mt-2">Sep</span>
                  </div>

                  {/* Oct */}
                  <div className="flex flex-col items-center relative">
                    <div className="flex items-end gap-[2px] h-[150px]">
                      <div className="w-3 bg-[#E8E8E8] rounded-t-sm" style={{ height: "40%" }} />
                      <div className="w-3 bg-[#074E5B]/30 rounded-t-sm" style={{ height: "50%" }} />
                      <div className="w-3 bg-[#CBD5E1] rounded-t-sm" style={{ height: "55%" }} />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[9px] text-gray-400 font-bold">Oct</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
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
                <span className="text-[32px] font-black text-gray-900 leading-none">147</span>
                <span className="text-[14px] text-gray-300 font-bold">/162</span>
              </div>

              {/* Breakdown stats */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Paid</span>
                  <p className="text-[12px] font-black text-gray-900 mt-0.5">$15,680<span className="text-[9px] text-gray-300">.00</span></p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Pending</span>
                  <p className="text-[12px] font-black text-gray-900 mt-0.5">$2,940<span className="text-[9px] text-gray-300">.00</span></p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Overdue</span>
                  <p className="text-[12px] font-black text-gray-900 mt-0.5">$620<span className="text-[9px] text-gray-300">.00</span></p>
                </div>
              </div>

              {/* 3 Cancelled label */}
              <div className="flex justify-end mt-1">
                <span className="text-[9px] font-bold text-red-500">3 Cancelled</span>
              </div>

              {/* Segmented progress bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex gap-[2px] mt-2">
                <div className="w-[55%] bg-[#074E5B] rounded-l-full" />
                <div className="w-[25%] bg-[#F59E0B]" />
                <div className="w-[20%] bg-[#EF4444] rounded-r-full" />
              </div>

              {/* Latest Paid Invoice */}
              <div className="mt-auto pt-5 border-t border-gray-100">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Latest Paid Invoice</span>
                <div className="flex items-center justify-between mt-2 bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-900">INV-#7819090</p>
                      <p className="text-[9px] text-gray-400 font-medium">Andi Permana</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full bg-white">Paid</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Bottom Table ===== */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
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
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          <img src={`https://i.pravatar.cc/100?img=${row.client?.avatarImg || 1}`} alt={row.client?.name || 'Unknown'} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-gray-700">{row.client?.name || 'Unknown'}</span>
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
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#074E5B] text-white shadow-lg hover:bg-[#053E48] flex items-center justify-center transition-colors z-50">
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
}



