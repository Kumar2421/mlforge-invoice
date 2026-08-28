"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Filter, TrendingUp, Clock, Wallet, Loader2 } from "lucide-react";
import { fetchAPI } from "@/utils/api";
import type { Payment } from "@/types";

function statusClass(status: string) {
  switch (status) {
    case "Succeeded": return "border-[#074E5B]/20 text-[#074E5B] bg-[#074E5B]/5";
    case "Refunded": return "border-gray-200 text-gray-500 bg-white";
    case "Failed": return "border-red-200 text-red-700 bg-red-50";
    case "Pending": return "border-amber-200 text-amber-700 bg-amber-50";
    default: return "border-gray-200 text-gray-500 bg-white";
  }
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600">
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white ${method === "Stripe" ? "bg-[#635BFF]" : "bg-[#0070BA]"}`}>
        {method === "Stripe" ? "S" : "P"}
      </span>
      {method}
    </span>
  );
}

export default function PaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAPI('/api/v1/payments')
      .then(res => setPayments(res.data || []))
      .catch(err => console.error("Failed to fetch payments", err))
      .finally(() => setIsLoading(false));
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const receivedThisMonth = payments
    .filter(p => p.status === "Succeeded" && new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingPayments = payments.filter(p => p.status === "Pending");
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingCount = pendingPayments.length;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Payments</h2>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Read-only activity synced from your connected accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Stripe &middot; Read-only
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 border border-dashed border-gray-200 rounded-full px-3 py-1.5 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> PayPal &middot; Not connected
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Received This Month</p>
          <p className="text-[18px] font-black text-gray-900 tracking-tight leading-none mt-0.5">
            ${receivedThisMonth.toLocaleString()}<span className="text-[12px] text-gray-300 font-bold">.00</span>
          </p>
          <p className="text-[9px] text-gray-400 font-medium mt-1.5"><span className="text-green-600 font-bold">+12.4%</span> than last month</p>
        </div>
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Pending</p>
          <p className="text-[18px] font-black text-gray-900 tracking-tight leading-none mt-0.5">
            ${pendingTotal.toLocaleString()}<span className="text-[12px] text-gray-300 font-bold">.00</span>
          </p>
          <p className="text-[9px] text-gray-400 font-medium mt-1.5">{pendingCount} {pendingCount === 1 ? 'payment' : 'payments'} awaiting completion</p>
        </div>
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
          <div className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400">
            <Wallet className="w-4 h-4" />
          </div>
          <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Avg. Days to Pay</p>
          <p className="text-[18px] font-black text-gray-900 tracking-tight leading-none mt-0.5">9</p>
          <p className="text-[9px] text-gray-400 font-medium mt-1.5"><span className="text-green-600 font-bold">-12 days</span> since reminders</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search payments by client or invoice..."
              className="pl-10 pr-4 py-2 text-[12px] bg-white border border-gray-200 rounded-full w-72 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 text-gray-700 placeholder:text-gray-400 font-medium transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
              All Methods <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F0F0F0] text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Invoice</th>
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Method</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F5] relative">
            {isLoading && (
              <tr>
                <td colSpan={6} className="h-32 relative">
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  </div>
                </td>
              </tr>
            )}
            {payments.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
            payments.map((p) => (
              <tr key={p.id} className="text-[12px] hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-3 text-gray-500 font-medium">{new Date(p.date).toLocaleDateString()}</td>
                <td className="py-3 px-3 font-bold text-gray-900">{p.invoiceId ? p.invoiceId.substring(0, 15) + '...' : '—'}</td>
                <td className="py-3 px-3 font-medium text-gray-700">{p.clientName || 'Unknown'}</td>
                <td className="py-3 px-3"><MethodBadge method={p.method} /></td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusClass(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-gray-900 text-right">${p.amount?.toLocaleString() || '0'}.00</td>
              </tr>
            )))}
          </tbody>
        </table>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
            Showing
            <button className="flex items-center gap-1 font-semibold text-gray-700 px-2 py-1 rounded bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
              15 <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            of 42
          </div>
          <div className="flex items-center gap-1 text-[12px] font-medium text-gray-500">
            <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-6 h-6 flex items-center justify-center font-semibold text-gray-900 bg-gray-100 rounded">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
