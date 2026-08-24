"use client";

import React, { useState } from "react";
import { ChevronRight, Upload, Zap, ChevronDown, Plus, Trash2, Eye, Send } from "lucide-react";

const overdueInvoices = [
  { id: "INV-#7819090", client: "Andi Permana", email: "andi@permanastudio.com", amount: "$3,850.00", daysOverdue: 3, avatarImg: 2 },
];

const toneOptions = ["gentle", "firm", "final"] as const;
type Tone = (typeof toneOptions)[number];

const toneColor: Record<Tone, string> = {
  gentle: "border-amber-200 text-amber-700 bg-amber-50",
  firm: "border-orange-200 text-orange-700 bg-orange-50",
  final: "border-red-200 text-red-700 bg-red-50",
};

interface StageDraft {
  day: number;
  tone: Tone;
  subject: string;
  body: string;
}

const initialStages: StageDraft[] = [
  { day: 3, tone: "gentle", subject: "Just a friendly reminder — invoice due", body: "Hi {{client}}, hope all's well. Just a gentle nudge that invoice {{invoice}} for {{amount}} is now overdue. Let us know if there's anything holding it up." },
  { day: 7, tone: "firm", subject: "Payment overdue — action needed", body: "Hi {{client}}, invoice {{invoice}} for {{amount}} is now a week overdue. Please arrange payment at your earliest convenience." },
  { day: 14, tone: "final", subject: "Final notice: invoice significantly overdue", body: "Hi {{client}}, this is a final notice for invoice {{invoice}} ({{amount}}), now two weeks overdue. Please settle this promptly to avoid further action." },
];

export default function ReminderSequenceView() {
  const [stages, setStages] = useState<StageDraft[]>(initialStages);
  const [previewStage, setPreviewStage] = useState(0);
  const [autoPause, setAutoPause] = useState(true);
  const [repeatFinal, setRepeatFinal] = useState(false);

  const invoice = overdueInvoices[0];
  const current = stages[previewStage];

  function updateStage(index: number, patch: Partial<StageDraft>) {
    setStages((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addStage() {
    const lastDay = stages[stages.length - 1]?.day ?? 0;
    setStages((prev) => [...prev, { day: lastDay + 7, tone: "firm", subject: "New stage", body: "" }]);
  }

  function removeStage(index: number) {
    setStages((prev) => prev.filter((_, i) => i !== index));
    setPreviewStage(0);
  }

  return (
    <div className="flex flex-1 min-h-0 w-full bg-[#F7F8FA]">
      <div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
        {/* ===== Header ===== */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mb-1">
              <span>Reminders</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">New Sequence</span>
            </div>
            <h2 className="text-[20px] font-black text-gray-900 tracking-tight">New Reminder Sequence</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Save as Draft
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-[#074E5B] rounded-lg hover:bg-[#053E48] transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Activate Sequence
            </button>
          </div>
        </div>

        {/* ===== Main Content Area ===== */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left Column: Form */}
          <div className="w-[420px] flex flex-col gap-4 shrink-0 overflow-y-auto no-scrollbar pr-1">
            {/* Select invoice */}
            <div className="bg-white border border-[#ECECEC] rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-900 mb-4">Select Overdue Invoice</h3>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-2.5 px-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <img src={`https://i.pravatar.cc/100?img=${invoice.avatarImg}`} alt={invoice.client} className="w-full h-full object-cover grayscale opacity-80" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">{invoice.client}</p>
                    <p className="text-[9px] text-gray-400">{invoice.email}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px]">
                <span className="font-bold text-gray-900">{invoice.id}</span>
                <span className="font-bold text-gray-900">{invoice.amount}</span>
                <span className="font-bold text-red-500">{invoice.daysOverdue} days overdue</span>
              </div>
            </div>

            {/* Escalation stages */}
            <div className="bg-white border border-[#ECECEC] rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-900 mb-4">Escalation Stages</h3>
              <div className="space-y-3">
                {stages.map((stage, i) => (
                  <div
                    key={i}
                    onClick={() => setPreviewStage(i)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${previewStage === i ? "border-[#074E5B]" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-gray-500">Day</span>
                        <input
                          type="number"
                          value={stage.day}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStage(i, { day: Number(e.target.value) })}
                          className="w-12 border border-gray-200 rounded-md py-1 px-1.5 text-[10px] text-gray-900 font-medium text-center focus:outline-none focus:border-[#074E5B]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={stage.tone}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStage(i, { tone: e.target.value as Tone })}
                          className={`text-[9px] font-bold px-2 py-1 rounded-full border capitalize focus:outline-none ${toneColor[stage.tone]}`}
                        >
                          {toneOptions.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeStage(i); }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={stage.subject}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStage(i, { subject: e.target.value })}
                      className="w-full border border-gray-200 rounded-md py-1.5 px-2.5 text-[10px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addStage}
                className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-300 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stage
              </button>
            </div>

            {/* Sequence settings */}
            <div className="bg-white border border-[#ECECEC] rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-900 mb-4">Sequence Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-700">Pause automatically once paid</span>
                  <span
                    role="button"
                    onClick={() => setAutoPause((v) => !v)}
                    className={`w-8 h-[18px] rounded-full p-[2px] relative cursor-pointer transition-colors ${autoPause ? "bg-[#074E5B]" : "bg-gray-200"}`}
                  >
                    <span className={`block w-[14px] h-[14px] rounded-full bg-white absolute top-[2px] transition-all ${autoPause ? "right-[2px]" : "left-[2px]"}`} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-700">Repeat final stage weekly</span>
                  <span
                    role="button"
                    onClick={() => setRepeatFinal((v) => !v)}
                    className={`w-8 h-[18px] rounded-full p-[2px] relative cursor-pointer transition-colors ${repeatFinal ? "bg-[#074E5B]" : "bg-gray-200"}`}
                  >
                    <span className={`block w-[14px] h-[14px] rounded-full bg-white absolute top-[2px] transition-all ${repeatFinal ? "right-[2px]" : "left-[2px]"}`} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Email Preview */}
          <div className="flex-1 min-h-0 bg-white border border-[#ECECEC] rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900">
                <Eye className="w-4 h-4 text-gray-400" />
                Preview
              </div>
              <div className="flex items-center gap-1">
                {stages.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewStage(i)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                      previewStage === i ? "border-[#074E5B] text-[#074E5B] bg-[#074E5B]/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Day {s.day}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
                <Send className="w-3.5 h-3.5" /> Send Test
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-8 bg-[#FAFAFA]">
              <div className="max-w-[520px] mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8 min-h-full">
                <div className="space-y-1.5 pb-4 mb-5 border-b border-gray-100 text-[11px]">
                  <p><span className="text-gray-400 font-medium">From:</span> <span className="font-semibold text-gray-800">billing@mlforge.com</span></p>
                  <p><span className="text-gray-400 font-medium">To:</span> <span className="font-semibold text-gray-800">{invoice.email}</span></p>
                  <p><span className="text-gray-400 font-medium">Subject:</span> <span className="font-semibold text-gray-800">{current?.subject}</span></p>
                </div>

                <p className="text-[13px] text-gray-700 leading-relaxed mb-5">
                  {current?.body
                    .replace("{{client}}", invoice.client)
                    .replace("{{invoice}}", invoice.id)
                    .replace("{{amount}}", invoice.amount)}
                </p>

                <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-[12px] font-bold py-2.5 px-5 rounded-lg transition-colors">
                  Pay Invoice
                </button>

                <p className="text-[10px] text-gray-400 font-medium mt-8 pt-4 border-t border-gray-100">
                  Sent via mlforge Invoice on behalf of Jamil Suta. <a href="#" className="underline decoration-gray-300 underline-offset-2">Manage reminder preferences</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
