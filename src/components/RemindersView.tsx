"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Pause, Play } from "lucide-react";
import ReminderTimeline from "./ReminderTimeline";
import type { ReminderSequence, ReminderStage } from "@/types";

interface RemindersViewProps {
  onNewSequence?: () => void;
}

import { Loader2 } from "lucide-react";
import { fetchAPI } from "@/utils/api";

const defaultTemplateStages: ReminderStage[] = [
  { day: 3, tone: "gentle", subject: "Just a friendly reminder — invoice due", body: "Hi {{client}}, hope all's well. Just a gentle nudge that invoice {{invoice}} for {{amount}} is now overdue. Let us know if there's anything holding it up.", status: "pending" },
  { day: 7, tone: "firm", subject: "Payment overdue — action needed", body: "Hi {{client}}, invoice {{invoice}} for {{amount}} is now a week overdue. Please arrange payment at your earliest convenience.", status: "pending" },
  { day: 14, tone: "final", subject: "Final notice: invoice significantly overdue", body: "Hi {{client}}, this is a final notice for invoice {{invoice}} ({{amount}}), now two weeks overdue. Please settle this promptly to avoid further action.", status: "pending" },
];

const toneColor: Record<string, string> = {
  gentle: "border-amber-200 text-amber-700 bg-amber-50",
  firm: "border-orange-200 text-orange-700 bg-orange-50",
  final: "border-red-200 text-red-700 bg-red-50",
};

function MiniStageTracker({ stages }: { stages: ReminderStage[] }) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, i) => (
        <React.Fragment key={s.day}>
          <span
            title={`Day ${s.day}: ${s.status}`}
            className={`w-2 h-2 rounded-full shrink-0 ${
              s.status === "sent" ? "bg-[#074E5B]" : s.status === "scheduled" ? "bg-amber-400" : s.status === "skipped" ? "bg-gray-300" : "bg-gray-200"
            }`}
          />
          {i < stages.length - 1 && <span className="w-3 h-px bg-gray-200" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function RemindersView({ onNewSequence }: RemindersViewProps) {
  const [sequences, setSequences] = React.useState<ReminderSequence[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<"sequence" | "template">("sequence");
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    fetchAPI('/api/v1/reminder-sequences')
      .then(res => res.json())
      .then(res => {
        if (res.error) throw new Error(res.error);
        setSequences(res.data || []);
        if (res.data?.length > 0) {
          setSelectedId(res.data[0].id);
          setPaused(Object.fromEntries(res.data.map((s: ReminderSequence) => [s.id, s.paused])));
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selected = sequences.find((s) => s.id === selectedId) ?? sequences[0];

  if (loading) {
    return (
      <div className="flex flex-1 min-h-0 w-full bg-white items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#074E5B] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 w-full bg-white items-center justify-center text-red-500">
        <p>Error loading reminders: {error}</p>
      </div>
    );
  }

  if (sequences.length === 0) {
     return (
      <div className="flex flex-1 min-h-0 w-full bg-white flex-col items-center justify-center">
        <p className="text-gray-500 mb-4 text-sm font-medium">No reminder sequences active.</p>
        <button
            onClick={onNewSequence}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full transition-colors"
          >
            New Reminder Sequence
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
      </div>
     )
  }

  return (
    <div className="flex flex-1 min-h-0 w-full bg-white text-[#111827]">
      {/* ===== LEFT COLUMN: Sequence List ===== */}
      <div className="flex-1 flex flex-col pt-6 pl-8 pr-6 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-1.5">Payment Reminders</h2>
            <p className="text-[12px] text-gray-500 font-medium">Automated escalation for overdue invoices.</p>
          </div>
          <button
            onClick={onNewSequence}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full transition-colors"
          >
            New Reminder Sequence
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Default cadence + filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-between text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              All Sequences <ChevronDown className="w-4 h-4 text-gray-400 ml-1.5" />
            </button>
            <button className="flex items-center justify-between text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              All Status <ChevronDown className="w-4 h-4 text-gray-400 ml-1.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500">Default cadence: Day 3 &rarr; 7 &rarr; 14</span>
            <div className="w-8 h-[18px] bg-[#074E5B] rounded-full p-[2px] relative cursor-pointer">
              <span className="block w-[14px] h-[14px] rounded-full bg-white absolute right-[2px] top-[2px]" />
            </div>
          </div>
        </div>

        {/* Sequence card rows */}
        <div className="space-y-2.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
          {sequences.map((seq) => {
            const isPaused = paused[seq.id];
            const active = seq.id === selectedId;
            return (
              <button
                key={seq.id}
                onClick={() => { setSelectedId(seq.id); setRightTab("sequence"); }}
                className={`w-full text-left border rounded-2xl p-4 transition-colors ${
                  active ? "border-[#074E5B] bg-[#F3F4F6]" : "border-[#ECECEC] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      <img src={`https://i.pravatar.cc/100?img=${seq.clientAvatarImg}`} alt={seq.clientName} className="w-full h-full object-cover grayscale opacity-80" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">{seq.clientName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{seq.invoiceId}</p>
                    </div>
                  </div>
                  <p className="text-[13px] font-bold text-gray-900">${seq.amount.toLocaleString()}.00</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <MiniStageTracker stages={seq.stages} />
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${
                      isPaused ? "border-gray-200 text-gray-500 bg-white" : "border-[#074E5B]/20 text-[#074E5B] bg-[#074E5B]/5"
                    }`}>
                      {isPaused ? "Paused" : "Active"}
                    </span>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); setPaused((p) => ({ ...p, [seq.id]: !p[seq.id] })); }}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
            Showing
            <button className="flex items-center gap-1 font-semibold text-gray-700 px-2 py-1 rounded bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
              15 <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            of 25
          </div>
          <div className="flex items-center gap-1 text-[12px] font-medium text-gray-500">
            <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-6 h-6 flex items-center justify-center font-semibold text-gray-900 bg-gray-100 rounded">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ===== RIGHT COLUMN: Sequence Detail / Default Template ===== */}
      <div className="w-[400px] flex flex-col shrink-0 m-6 ml-0 border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex p-1 bg-[#F3F4F6] rounded-lg">
            <button
              onClick={() => setRightTab("sequence")}
              className={`text-center text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors ${rightTab === "sequence" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              This Sequence
            </button>
            <button
              onClick={() => setRightTab("template")}
              className={`text-center text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors ${rightTab === "template" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              Default Template
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6">
          {rightTab === "sequence" ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  <img src={`https://i.pravatar.cc/100?img=${selected.clientAvatarImg}`} alt={selected.clientName} className="w-full h-full object-cover grayscale opacity-90" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-900">{selected.clientName}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{selected.invoiceId} &middot; ${selected.amount.toLocaleString()}.00</p>
                </div>
              </div>

              <div className="mb-5">
                <ReminderTimeline
                  stages={selected.stages}
                  paused={paused[selected.id]}
                  onPauseToggle={() => setPaused((p) => ({ ...p, [selected.id]: !p[selected.id] }))}
                />
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-900 mb-3">Activity Log</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-[11px] text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    Day 3 reminder opened by client &middot; 2:14pm
                  </li>
                  <li className="flex items-center gap-2.5 text-[11px] text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    Day 3 reminder sent via Stripe email
                  </li>
                  <li className="flex items-center gap-2.5 text-[11px] text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    Day 0 invoice synced from Stripe
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {defaultTemplateStages.map((stage) => (
                <div key={stage.day} className="border border-gray-200 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[12px] font-bold text-gray-900">Stage &middot; Day {stage.day}</p>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border capitalize ${toneColor[stage.tone]}`}>
                      {stage.tone}
                    </span>
                  </div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    defaultValue={stage.subject}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[11px] text-gray-900 font-medium mb-2.5 focus:outline-none focus:border-[#074E5B]"
                  />
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Body</label>
                  <textarea
                    defaultValue={stage.body}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[10px] text-gray-600 leading-relaxed focus:outline-none focus:border-[#074E5B] resize-none"
                  />
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-300 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add Stage
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
