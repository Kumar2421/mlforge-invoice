"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { MLForgeMark } from "@/components/icons";
import { fetchAPI } from "@/utils/api";

export default function ActivatePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"solo" | "pro">("solo");

  const handleActivate = async () => {
    setIsProcessing(true);
    // Mock successful payment flow
    try {
      await fetchAPI("/api/v1/settings/plan", {
        method: "POST",
        body: JSON.stringify({ plan: selectedPlan }),
      });
      // Redirect to dashboard after successful payment
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* Left Column - Plan Details */}
        <div className="md:w-1/2 p-8 md:p-12 bg-gray-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MLForgeMark className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <MLForgeMark className="w-8 h-8 text-white" />
              <span className="text-xl font-bold tracking-tight">mlforge Invoice</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">
              Your free trial has ended.
            </h2>
            <p className="text-gray-400 mb-8 font-medium">
              Activate your account to restore dashboard access and keep your automated reminders running.
            </p>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedPlan === "solo" ? "border-green-500 bg-white/10" : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setSelectedPlan("solo")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">Solo Plan</h3>
                  <span className="text-2xl font-black">$9<span className="text-sm font-medium text-gray-400">/mo</span></span>
                </div>
                <p className="text-sm text-gray-400">1 Stripe account, unlimited reminders, default cadence.</p>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedPlan === "pro" ? "border-green-500 bg-white/10" : "border-gray-700 hover:border-gray-600"
                }`}
                onClick={() => setSelectedPlan("pro")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    Pro Plan <span className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Popular</span>
                  </h3>
                  <span className="text-2xl font-black">$15<span className="text-sm font-medium text-gray-400">/mo</span></span>
                </div>
                <p className="text-sm text-gray-400">Everything in Solo + PayPal, custom cadences, and priority support.</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-10 text-sm text-gray-500 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            Secure payment via Stripe
          </div>
        </div>

        {/* Right Column - Mock Checkout */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Activation</h3>
          <p className="text-sm text-gray-500 mb-8 font-medium">
            (This is a mock checkout flow. In production, this will redirect to Stripe Checkout.)
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600 font-medium pb-4 border-b border-gray-100">
              <span>{selectedPlan === "solo" ? "Solo Plan (Monthly)" : "Pro Plan (Monthly)"}</span>
              <span className="text-gray-900 font-bold">{selectedPlan === "solo" ? "$9.00" : "$15.00"}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total Due Today</span>
              <span>{selectedPlan === "solo" ? "$9.00" : "$15.00"}</span>
            </div>
          </div>

          <button
            onClick={handleActivate}
            disabled={isProcessing}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Subscribe & Activate <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
