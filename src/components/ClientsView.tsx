"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import ReminderTimeline from "./ReminderTimeline";
import type { Client, ReminderStage } from "@/types";
import { fetchAPI } from "@/utils/api";

const historyStages: ReminderStage[] = [
  { day: 0, tone: "gentle", subject: "Invoice sent via Stripe", body: "", status: "sent" },
  { day: 3, tone: "gentle", subject: "Reminder email sent", body: "", status: "sent" },
  { day: 7, tone: "firm", subject: "Escalation scheduled", body: "", status: "scheduled" },
];

function onTimeBadgeClass(rate: number) {
  if (rate >= 90) return "border-[#074E5B]/20 text-[#074E5B] bg-[#074E5B]/5";
  if (rate >= 70) return "border-amber-200 text-amber-700 bg-amber-50";
  return "border-red-200 text-red-700 bg-red-50";
}

export default function ClientsView() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [muted, setMuted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAPI('/api/v1/clients')
      .then(res => {
        setClients(res.data || []);
        if (res.data?.length > 0) {
          setSelectedId(res.data[0].id);
          const mutedState = Object.fromEntries(res.data.map((c: any) => [c.id, c.remindersMuted]));
          setMuted(mutedState);
        }
      })
      .catch(err => console.error("Failed to fetch clients", err))
      .finally(() => setIsLoading(false));
  }, []);

  const selected = clients.find((c) => c.id === selectedId) || null;

  return (
    <div className="flex flex-1 min-h-0 w-full bg-white text-[#111827]">
      {/* ===== LEFT COLUMN: Client List ===== */}
      <div className="flex-1 flex flex-col pt-6 pl-8 pr-6 pb-6 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-1.5">Clients</h2>
            <p className="text-[12px] text-gray-500 font-medium">People and companies you invoice.</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full transition-colors">
            Add Client
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-between text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              All Clients <ChevronDown className="w-4 h-4 text-gray-400 ml-1.5" />
            </button>
            <button className="flex items-center justify-between text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              Sort: Outstanding <ChevronDown className="w-4 h-4 text-gray-400 ml-1.5" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 text-[12px] bg-white border border-gray-200 rounded-full w-[240px] focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 text-gray-700 placeholder:text-gray-400 font-medium transition-all"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl flex-1 flex flex-col overflow-hidden min-h-0 relative">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto no-scrollbar">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
                  <th className="py-3 px-5 font-medium">Client</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 text-right font-medium">Invoiced</th>
                  <th className="py-3 px-4 text-right font-medium">Outstanding</th>
                  <th className="py-3 px-4 text-center font-medium">On-Time</th>
                  <th className="py-3 px-4 text-center font-medium">Reminders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                clients.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`text-[12px] transition-colors cursor-pointer ${c.id === selectedId ? "bg-[#F3F4F6]" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          <img src={`https://i.pravatar.cc/100?img=${c.avatarImg || 1}`} alt={c.name} className="w-full h-full object-cover grayscale opacity-80" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{c.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{c.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-medium">{c.email}</td>
                    <td className="py-3 px-4 font-medium text-gray-700 text-right">${c.totalInvoiced?.toLocaleString() || '0'}.00</td>
                    <td className={`py-3 px-4 font-bold text-right ${(c.outstandingBalance || 0) > 0  ? "text-red-500" : "text-gray-400"}`}>
                      {(c.outstandingBalance || 0) > 0 ? `$${c.outstandingBalance.toLocaleString()}.00` : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${onTimeBadgeClass(c.onTimeRate || 100)}`}>
                          {c.onTimeRate || 100}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span
                          role="button"
                          onClick={(e) => { e.stopPropagation(); setMuted((m) => ({ ...m, [c.id]: !m[c.id] })); }}
                          className={`w-8 h-[18px] rounded-full p-[2px] relative cursor-pointer transition-colors ${muted[c.id] ? "bg-gray-200" : "bg-[#074E5B]"}`}
                        >
                          <span className={`block w-[14px] h-[14px] rounded-full bg-white absolute top-[2px] transition-all ${muted[c.id] ? "left-[2px]" : "right-[2px]"}`} />
                        </span>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
              Showing
              <button className="flex items-center gap-1 font-semibold text-gray-700 px-2 py-1 rounded bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                15 <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              of {clients.length}
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium text-gray-500">
              <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-6 h-6 flex items-center justify-center font-semibold text-gray-900 bg-gray-100 rounded">1</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT COLUMN: Client Detail ===== */}
      <div className="w-[400px] flex flex-col shrink-0 m-6 ml-0 border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        {selected ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-gray-900">Client Detail</h3>
              <button className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  <img src={`https://i.pravatar.cc/100?img=${selected.avatarImg || 1}`} alt={selected.name} className="w-full h-full object-cover grayscale opacity-90" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-gray-900">{selected.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{selected.company}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{selected.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 px-3.5 py-2.5 border border-gray-200 rounded-xl">
                <span className="text-[11px] font-semibold text-gray-700">Mute reminders for this client</span>
                <span
                  role="button"
                  onClick={() => setMuted((m) => ({ ...m, [selected.id]: !m[selected.id] }))}
                  className={`w-8 h-[18px] rounded-full p-[2px] relative cursor-pointer transition-colors ${muted[selected.id] ? "bg-gray-200" : "bg-[#074E5B]"}`}
                >
                  <span className={`block w-[14px] h-[14px] rounded-full bg-white absolute top-[2px] transition-all ${muted[selected.id] ? "left-[2px]" : "right-[2px]"}`} />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="border border-gray-100 rounded-xl p-3">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Invoiced</p>
                  <p className="text-[13px] font-black text-gray-900">${selected.totalInvoiced?.toLocaleString() || '0'}</p>
                </div>
                <div className="border border-gray-100 rounded-xl p-3">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Outstanding</p>
                  <p className={`text-[13px] font-black ${(selected.outstandingBalance || 0) > 0  ? "text-red-500" : "text-gray-900"}`}>
                    ${(selected.outstandingBalance || 0).toLocaleString()}
                  </p>
                </div>
                <div className="border border-gray-100 rounded-xl p-3">
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">On-Time</p>
                  <p className="text-[13px] font-black text-gray-900">{selected.onTimeRate || 100}%</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[11px] font-bold text-gray-900 mb-3">Invoice History</p>
                <div className="space-y-2">
                  <div className="text-[11px] text-gray-500">History fetched separately.</div>
                </div>
              </div>

              {(selected.outstandingBalance || 0) > 0 ? (
                <ReminderTimeline stages={historyStages} showPauseAction={false} title="Reminder History" />
              ) : (
                <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-4 text-center">
                  <p className="text-[11px] text-gray-500 font-medium">No active reminders — all invoices current.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Select a client"}
          </div>
        )}
      </div>
    </div>
  );
}
