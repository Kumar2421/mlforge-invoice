"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function SettingsView() {
  return (
    <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-10">
      <div className="max-w-[720px] mx-auto space-y-4">
        <div>
          <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Settings</h2>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Manage your account, reminders, and connected apps.</p>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-gray-900 mb-1">Connected Accounts</h3>
          <p className="text-[11px] text-gray-400 font-medium mb-4">
            mlforge Invoice never moves money or creates invoices &mdash; read-only access only.
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-4 py-3 border border-[#ECECEC] rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white text-[11px] font-black">S</span>
                <div>
                  <p className="text-[12px] font-bold text-gray-900">Stripe</p>
                  <p className="text-[10px] text-gray-400 font-medium">Last synced 4 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[9px] font-bold text-[#074E5B]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Read-only
                </span>
                <button className="text-[10px] font-bold text-gray-400 hover:text-red-500">Disconnect</button>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border border-dashed border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#0070BA] flex items-center justify-center text-white text-[11px] font-black">P</span>
                <div>
                  <p className="text-[12px] font-bold text-gray-900">PayPal</p>
                  <p className="text-[10px] text-gray-400 font-medium">Not connected</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] px-3.5 py-1.5 rounded-full transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Default reminder cadence */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-gray-900 mb-4">Default Reminder Cadence</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { day: 3, tone: "Gentle", color: "border-amber-200 text-amber-700 bg-amber-50" },
              { day: 7, tone: "Firm", color: "border-orange-200 text-orange-700 bg-orange-50" },
              { day: 14, tone: "Final", color: "border-red-200 text-red-700 bg-red-50" },
            ].map((s) => (
              <div key={s.day} className="border border-gray-200 rounded-xl p-3">
                <p className="text-[11px] font-bold text-gray-900 mb-2">Day {s.day}</p>
                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>{s.tone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sender identity */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-gray-900 mb-4">Sender Identity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">From Name</label>
              <input type="text" defaultValue="Jamil Suta" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">From Email</label>
              <input type="text" defaultValue="billing@mlforge.com" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Reply-To</label>
              <input type="text" defaultValue="jamil@mlforge.com" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]" />
            </div>
          </div>
        </div>

        {/* Plan & Billing */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-gray-900 mb-4">Plan &amp; Billing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-[#074E5B] rounded-xl p-4 relative">
              <span className="absolute top-3 right-3 text-[9px] font-bold text-[#074E5B] bg-[#074E5B]/5 border border-[#074E5B]/20 px-2 py-0.5 rounded-full">Current Plan</span>
              <p className="text-[12px] font-bold text-gray-900">Solo</p>
              <p className="text-[20px] font-black text-gray-900 mt-1">$9<span className="text-[11px] text-gray-400 font-bold">/mo</span></p>
              <p className="text-[10px] text-gray-500 font-medium mt-2">1 Stripe account, unlimited reminders, default cadence.</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-[12px] font-bold text-gray-900">Pro</p>
              <p className="text-[20px] font-black text-gray-900 mt-1">$15<span className="text-[11px] text-gray-400 font-bold">/mo</span></p>
              <p className="text-[10px] text-gray-500 font-medium mt-2">+ PayPal, custom cadence per client, priority support.</p>
              <button className="w-full mt-3 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[11px] font-bold py-2 rounded-lg transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
