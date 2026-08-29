"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Save } from "lucide-react";
import { fetchAPI } from "@/utils/api";

type SettingsData = {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  reminderCadenceDays: number[];
  planSlug: "solo" | "pro";
};

export default function SettingsView() {
  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    accountId?: string;
    connectedAt?: string;
    lastSyncedAt?: string;
  }>({ connected: false });
  const [settings, setSettings] = useState<SettingsData>({
    senderName: "",
    senderEmail: "",
    replyToEmail: "",
    reminderCadenceDays: [3, 7, 14],
    planSlug: "solo",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBilling, setIsBilling] = useState(false);

  const fetchStripeStatus = () => {
    setIsLoading(true);
    Promise.all([fetchAPI("/api/v1/stripe/status"), fetchAPI("/api/v1/settings")])
      .then(([stripeRes, settingsRes]) => {
        setStripeStatus(stripeRes);
        setSettings(settingsRes.data);
      })
      .catch((err) => console.error("Failed to load Stripe status", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStripeStatus();
  }, []);

  const handleConnectStripe = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetchAPI("/api/v1/stripe/connect", {
        headers: { Accept: "application/json" },
      });
      if (res.url) {
        window.location.href = res.url;
      } else {
        throw new Error("No authorize URL returned");
      }
    } catch (err) {
      console.error("Failed to connect Stripe", err);
      setIsActionLoading(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!confirm("Are you sure you want to disconnect your Stripe account?")) return;
    setIsActionLoading(true);
    try {
      await fetchAPI("/api/v1/stripe/disconnect", { method: "POST" });
      setStripeStatus({ connected: false });
    } catch (err) {
      console.error("Failed to disconnect Stripe", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSyncStripe = async () => {
    setIsSyncing(true);
    try {
      await fetchAPI("/api/v1/sync", { method: "POST" });
      fetchStripeStatus();
    } catch (err) {
      console.error("Failed to sync Stripe data", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetchAPI("/api/v1/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-10">
      <div className="max-w-[720px] mx-auto space-y-4">
        <div>
          <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Settings</h2>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Manage your account, reminders, and connected apps.</p>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 relative">
          {(isLoading || isActionLoading) && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl z-10">
              <Loader2 className="w-6 h-6 text-[#074E5B] animate-spin" />
            </div>
          )}

          <h3 className="text-[13px] font-bold text-gray-900 mb-1">Connected Accounts</h3>
          <p className="text-[11px] text-gray-400 font-medium mb-4">
            Payment Reminders never moves money or creates invoices &mdash; read-only access only.
          </p>
          <div className="space-y-2.5">
            {stripeStatus.connected ? (
              <div className="flex items-center justify-between px-4 py-3 border border-[#ECECEC] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white text-[11px] font-black">S</span>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900">Stripe ({stripeStatus.accountId?.substring(0, 12)}...)</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Last synced: {formatDate(stripeStatus.lastSyncedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSyncStripe}
                    disabled={isSyncing}
                    className="flex items-center gap-1 text-[9px] font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                    Sync
                  </button>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-[#074E5B]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Read-only
                  </span>
                  <button
                    onClick={handleDisconnectStripe}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 border border-dashed border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF] text-[11px] font-black">S</span>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900">Stripe</p>
                    <p className="text-[10px] text-gray-400 font-medium">Not connected</p>
                  </div>
                </div>
                <button
                  onClick={handleConnectStripe}
                  className="text-[11px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Connect
                </button>
              </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 border border-dashed border-gray-200 rounded-xl opacity-60">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#0070BA]/10 flex items-center justify-center text-[#0070BA] text-[11px] font-black">P</span>
                <div>
                  <p className="text-[12px] font-bold text-gray-900">PayPal</p>
                  <p className="text-[10px] text-gray-400 font-medium">Not connected (Pro tier only)</p>
                </div>
              </div>
              <button disabled className="text-[11px] font-bold text-gray-400 bg-gray-100 px-3.5 py-1.5 rounded-full cursor-not-allowed">
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Default reminder cadence */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-gray-900 mb-4">Default Reminder Cadence</h3>
          <div className="grid grid-cols-3 gap-3">
            {settings.reminderCadenceDays.map((day, index) => {
              const toneMeta =
                index === 0
                  ? { tone: "Gentle", color: "border-amber-200 text-amber-700 bg-amber-50" }
                  : index === 1
                  ? { tone: "Firm", color: "border-orange-200 text-orange-700 bg-orange-50" }
                  : { tone: "Final", color: "border-red-200 text-red-700 bg-red-50" };

              return (
                <label key={index} className="border border-gray-200 rounded-xl p-3 block">
                  <p className="text-[11px] font-bold text-gray-900 mb-2">Reminder {index + 1}</p>
                  <input
                    type="number"
                    min={1}
                    value={day}
                    onChange={(event) => {
                      const nextDays = [...settings.reminderCadenceDays];
                      nextDays[index] = Number(event.target.value);
                      setSettings({ ...settings, reminderCadenceDays: nextDays });
                    }}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] font-medium text-gray-900 focus:outline-none focus:border-[#074E5B]"
                  />
                  <span className={`mt-2 inline-flex text-[9px] font-bold px-2.5 py-1 rounded-full border ${toneMeta.color}`}>{toneMeta.tone}</span>
                </label>
              );
            })}
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-full bg-[#074E5B] px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#053E48] disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save cadence
            </button>
          </div>
        </div>

        {/* Sender identity */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <h3 className="text-[13px] font-bold text-gray-900 mb-4">Sender Identity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">From Name</label>
              <input
                type="text"
                value={settings.senderName}
                onChange={(event) => setSettings({ ...settings, senderName: event.target.value })}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">From Email</label>
              <input
                type="text"
                value={settings.senderEmail}
                onChange={(event) => setSettings({ ...settings, senderEmail: event.target.value })}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Reply-To</label>
              <input
                type="text"
                value={settings.replyToEmail}
                onChange={(event) => setSettings({ ...settings, replyToEmail: event.target.value })}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-[12px] text-gray-900 font-medium focus:outline-none focus:border-[#074E5B]"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-full bg-[#22C55E] px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#16A34A] disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save sender
            </button>
          </div>
        </div>

        {/* Plan & Billing */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-gray-900">Plan &amp; Billing</h3>
            <button
              onClick={async () => {
                setIsBilling(true);
                try {
                  const res = await fetchAPI("/api/v1/billing/portal", { method: "POST" });
                  if (res.url) window.location.href = res.url;
                } catch (e) {
                  console.error("Billing portal failed", e);
                } finally {
                  setIsBilling(false);
                }
              }}
              disabled={isBilling}
              className="text-[10px] font-bold text-[#074E5B] border border-[#074E5B]/30 rounded-full px-3 py-1 hover:bg-[#074E5B]/5 disabled:opacity-50"
            >
              Manage billing
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["solo", "pro"] as const).map((plan) => {
              const current = settings.planSlug === plan;
              const price = plan === "solo" ? "$9" : "$15";
              const blurb =
                plan === "solo"
                  ? "1 Stripe account, unlimited reminders, default cadence."
                  : "PayPal, custom cadence per client, and team members.";
              return (
                <div
                  key={plan}
                  className={`rounded-xl p-4 relative ${current ? "border-2 border-[#074E5B]" : "border border-gray-200"}`}
                >
                  {current && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold text-[#074E5B] bg-[#074E5B]/5 border border-[#074E5B]/20 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                  <p className="text-[12px] font-bold text-gray-900 capitalize">{plan}</p>
                  <p className="text-[20px] font-black text-gray-900 mt-1">
                    {price}
                    <span className="text-[11px] text-gray-400 font-bold">/mo</span>
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-2">{blurb}</p>
                  {!current && (
                    <button
                      onClick={async () => {
                        setIsBilling(true);
                        try {
                          const res = await fetchAPI("/api/v1/billing/checkout", {
                            method: "POST",
                            body: JSON.stringify({ plan }),
                          });
                          if (res.url) window.location.href = res.url;
                        } catch (e) {
                          console.error("Checkout failed", e);
                        } finally {
                          setIsBilling(false);
                        }
                      }}
                      disabled={isBilling}
                      className="mt-3 w-full rounded-full bg-[#22C55E] py-1.5 text-[10px] font-bold text-white hover:bg-[#16A34A] disabled:opacity-50"
                    >
                      {plan === "solo" ? "Switch to Solo" : "Upgrade to Pro"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
