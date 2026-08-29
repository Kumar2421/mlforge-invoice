"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Loader2, Mail, Clock } from "lucide-react";
import { MLForgeMark } from "@/components/icons";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/utils/api";

type State = {
  workspaceName: string;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  reminderCadenceDays: number[];
  stripeConnected: boolean;
  onboarded: boolean;
  role: "owner" | "admin" | "member";
};

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [s, setS] = useState<State>({
    workspaceName: "",
    senderName: "",
    senderEmail: "",
    replyToEmail: "",
    reminderCadenceDays: [3, 7, 14],
    stripeConnected: false,
    onboarded: false,
    role: "owner",
  });

  useEffect(() => {
    fetchAPI("/api/v1/onboarding")
      .then((res) => {
        const d = res.data;
        setS((prev) => ({ ...prev, ...d }));
        if (d.onboarded) router.replace("/dashboard");
        if (d.stripeConnected && step === 2) setStep(3);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (patch: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await fetchAPI("/api/v1/onboarding", { method: "PATCH", body: JSON.stringify(patch) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const skip = async () => {
    try {
      await save({ complete: true });
      router.replace("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Skip failed");
    }
  };

  const next = async () => {
    try {
      if (step === 1) await save({ workspaceName: s.workspaceName });
      if (step === 3) {
        await save({
          senderName: s.senderName,
          senderEmail: s.senderEmail,
          replyToEmail: s.replyToEmail || s.senderEmail,
        });
      }
      if (step === 4) {
        await save({ reminderCadenceDays: s.reminderCadenceDays, complete: true });
        router.replace("/dashboard");
        return;
      }
      setStep((n) => Math.min(n + 1, TOTAL_STEPS));
    } catch {
      /* error surfaced by save() */
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#074E5B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F8FA] to-[#EAEFF0] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border border-[#E5ECEB]/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-[#F0F0F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MLForgeMark className="w-7 h-7 text-[#074E5B]" />
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Set up Payment Reminders</h1>
          </div>
          <div className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            Step {step}/{TOTAL_STEPS}
          </div>
        </div>

        <div className="p-8 min-h-[360px]">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3F0] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#0F5A68]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Name your workspace</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Your workspace holds your invoices, clients, and reminder sequences. You can rename it later.
              </p>
              <input
                value={s.workspaceName}
                onChange={(e) => setS({ ...s, workspaceName: e.target.value })}
                placeholder="e.g. Acme Studio"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#074E5B]"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3F0] flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-[#0F5A68]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Connect your Stripe</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                We use a <strong>read-only</strong> restricted key to see which invoices are overdue and when they get
                paid. We can never move money or create charges.
              </p>
              {s.stripeConnected ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" /> Stripe connected
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.location.href = "/api/v1/stripe/connect";
                  }}
                  className="w-full py-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#074E5B] hover:bg-[#F7F8FA] transition-all flex items-center justify-center gap-3 font-bold text-gray-700"
                >
                  <div className="w-6 h-6 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-black text-[10px]">S</div>
                  Connect Stripe Account
                </button>
              )}
              <button
                onClick={() => setStep(3)}
                className="mt-4 text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                I&apos;ll connect later &rarr;
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3F0] flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-[#0F5A68]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Who sends the reminders?</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Reminder emails go out under your name and address, so clients recognise them. Use an address on a
                domain you can verify with your email provider for best deliverability.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[11px] font-semibold text-gray-500">From name</span>
                  <input
                    value={s.senderName}
                    onChange={(e) => setS({ ...s, senderName: e.target.value })}
                    placeholder="Acme Studio"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#074E5B]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold text-gray-500">From email</span>
                  <input
                    value={s.senderEmail}
                    onChange={(e) => setS({ ...s, senderEmail: e.target.value })}
                    placeholder="billing@acme.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#074E5B]"
                  />
                </label>
                <label className="block col-span-2">
                  <span className="text-[11px] font-semibold text-gray-500">Reply-to (optional)</span>
                  <input
                    value={s.replyToEmail}
                    onChange={(e) => setS({ ...s, replyToEmail: e.target.value })}
                    placeholder="you@acme.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#074E5B]"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3F0] flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#0F5A68]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Confirm your reminder cadence</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Days after an invoice&apos;s due date that each escalating reminder goes out. The default works for
                most people — you can fine-tune it later in Settings.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {s.reminderCadenceDays.map((d, i) => (
                  <label key={i} className="border border-gray-200 rounded-xl p-3 block">
                    <span className="text-[11px] font-bold text-gray-900">
                      {["Gentle", "Firm", "Final"][i]}
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={d}
                      onChange={(e) => {
                        const nd = [...s.reminderCadenceDays];
                        nd[i] = Number(e.target.value);
                        setS({ ...s, reminderCadenceDays: nd });
                      }}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#074E5B]"
                    />
                    <span className="mt-1 block text-[10px] text-gray-400">days overdue</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-[#D8E9E3] bg-[#F1F8F5] px-4 py-3">
                <p className="text-[12px] font-bold text-[#0F5A68]">Your 3-day free trial is now active.</p>
                <p className="mt-1 text-[11px] text-[#0F5A68]/80">
                  Full access to every feature. No card required. After 3 days, add a plan from
                  Settings to keep your reminders running.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-[#F0F0F0] flex justify-between items-center">
          <div className="flex gap-2">
            {step > 1 ? (
              <button
                onClick={() => setStep((n) => n - 1)}
                disabled={saving}
                className="px-4 py-2 text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
            ) : null}
            <button
              onClick={skip}
              disabled={saving}
              className="px-4 py-2 text-[11px] font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Skip
            </button>
          </div>
          <button
            onClick={next}
            disabled={saving || (step === 1 && !s.workspaceName.trim())}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-[11px] font-bold transition-all"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {step === TOTAL_STEPS ? "Complete" : "Next"}
            {step !== TOTAL_STEPS && !saving && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
