"use client";

import React from "react";
import { ArrowRight, MoreHorizontal } from "lucide-react";

const collectionByMonth = [
  { month: "Jul", value: 72, height: 55 },
  { month: "Aug", value: 78, height: 68 },
  { month: "Sep", value: 91, height: 92 },
  { month: "Oct", value: 84, height: 78 },
];

const revenueByClient = [
  { name: "Jamal Wirawan", amount: 21300, pct: 100 },
  { name: "Eka Rahmani", amount: 15600, pct: 73 },
  { name: "Andi Permana", amount: 12480, pct: 59 },
  { name: "Bella Sandi", amount: 8900, pct: 42 },
  { name: "Citra Dewi", amount: 6420, pct: 30 },
];

export default function ReportsView() {
  return (
    <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-6 space-y-4">
      <div>
        <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Reports</h2>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">How well your reminders are working.</p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1E1E24] text-white rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Reminder Effectiveness</span>
            <p className="text-[28px] font-black leading-none mt-2">62%</p>
            <p className="text-[11px] text-gray-300 font-medium leading-snug mt-2">of overdue invoices paid within 48h of a Day-3 reminder.</p>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="w-4 h-[2px] bg-white rounded-full" />
            <span className="w-4 h-[2px] bg-gray-600 rounded-full" />
            <span className="w-4 h-[2px] bg-gray-600 rounded-full" />
          </div>
        </div>

        <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Avg. Days to Pay</span>
          <p className="text-[28px] font-black text-gray-900 leading-none mt-2">9<span className="text-[14px] text-gray-300 font-bold"> days</span></p>
          <p className="text-[10px] text-gray-500 font-medium mt-2">Down from <span className="font-bold text-gray-700">21 days</span> before reminders</p>
        </div>

        <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Collection Rate</span>
          <p className="text-[28px] font-black text-gray-900 leading-none mt-2">84<span className="text-[14px] text-gray-300 font-bold">%</span></p>
          <div className="grid grid-cols-5 gap-[3px] mt-2">
            {[1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1].map((v, i) => (
              <span key={i} className={`w-[4px] h-[4px] rounded-full ${v ? "bg-[#074E5B]" : "bg-[#E5E7EB]"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Collection rate over time */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-gray-900">Collection Rate Over Time</h3>
          <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
        <div className="relative mt-4 h-[180px]">
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-400 font-semibold w-8">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full border-b border-dashed border-gray-100" />
            ))}
          </div>
          <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end justify-around">
            {collectionByMonth.map((m) => (
              <div key={m.month} className="flex flex-col items-center relative">
                <span className="text-[9px] font-bold text-gray-600 mb-1">{m.value}%</span>
                <div className="flex items-end gap-[2px] h-[120px]">
                  <div className="w-6 bg-[#074E5B] rounded-t-sm" style={{ height: `${m.height}%` }} />
                </div>
                <span className="text-[9px] text-gray-400 font-bold mt-2">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by client */}
      <div className="bg-white border border-[#ECECEC] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-gray-900">Revenue by Client</h3>
          <button className="text-[9px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-0.5">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {revenueByClient.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-gray-700 w-32 shrink-0 truncate">{c.name}</span>
              <div className="flex-1 h-2 rounded-full bg-[#F0F0F0] overflow-hidden">
                <div className="h-full bg-[#074E5B] rounded-full" style={{ width: `${c.pct}%` }} />
              </div>
              <span className="text-[11px] font-bold text-gray-900 w-16 text-right shrink-0">${c.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
