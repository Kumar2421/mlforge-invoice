"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { MLForgeMark } from "@/components/icons";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-[#E6ECEA] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-[#F0F0F0] flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <MLForgeMark className="w-8 h-8 text-[#074E5B]" />
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Welcome to mlforge Invoice</h1>
          </div>
          <div className="text-[11px] font-bold text-gray-400">Step {step} of 3</div>
        </div>

        {/* Content */}
        <div className="p-10">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3F0] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#0F5A68]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Set up your workspace</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Your workspace is where your invoices, clients, and automated reminders will live. We've created a default one for you.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Personal Workspace</h3>
                  <p className="text-xs text-gray-500">You can rename this later in settings.</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3F0] flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-[#0F5A68]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Connect your billing</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                mlforge Invoice needs read-only access to your Stripe account to track overdue invoices and know when to stop sending reminders.
              </p>
              <button 
                onClick={() => {
                  window.location.href = "/api/v1/stripe/connect";
                }}
                className="w-full py-4 rounded-xl border-2 border-[#E5E7EB] hover:border-[#074E5B] hover:bg-[#F7F8FA] transition-all flex items-center justify-center gap-3 font-bold text-gray-700"
              >
                <div className="w-6 h-6 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-black text-[10px]">S</div>
                Connect Stripe Account
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">You can also do this later from the dashboard.</p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">You're all set!</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Your 3-day free trial starts today. Head over to the dashboard to sync your first invoices and set up your reminder sequences.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F0F0F0] bg-gray-50/50 flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Back
            </button>
          ) : <div></div>}
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[12px] font-bold transition-all"
          >
            {step === 3 ? "Go to Dashboard" : "Continue"}
            {step !== 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
