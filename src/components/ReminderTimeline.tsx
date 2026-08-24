"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { ReminderStage } from "@/types";

interface ReminderTimelineProps {
  stages: ReminderStage[];
  paused?: boolean;
  onPauseToggle?: () => void;
  showPauseAction?: boolean;
  title?: string;
}

export default function ReminderTimeline({
  stages,
  paused = false,
  onPauseToggle,
  showPauseAction = true,
  title = "Payment Reminders",
}: ReminderTimelineProps) {
  return (
    <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-gray-900">{title}</p>
        {showPauseAction && (
          <button
            onClick={onPauseToggle}
            className="text-[9px] font-bold text-gray-500 hover:text-gray-700"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
      <ul className="space-y-2.5">
        {stages.map((stage) => (
          <li key={stage.day} className="flex items-center gap-2.5 text-[11px]">
            {stage.status === "sent" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#074E5B] shrink-0" />
            ) : stage.status === "skipped" ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 shrink-0" />
            )}
            <span className="text-gray-500">Day {stage.day}</span>
            <span
              className={`font-medium ${
                stage.status === "skipped" ? "text-gray-400 line-through" : "text-gray-700"
              }`}
            >
              {stage.subject}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
