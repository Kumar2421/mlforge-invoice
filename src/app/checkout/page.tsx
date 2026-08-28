"use client";

import { useState } from "react";
import { Check, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { MLForgeMark } from "@/components/icons";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    // Real implementation will redirect to Stripe Checkout
    setTimeout(() => {
      alert("Stripe integration pending: Waiting for API keys");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <MLForgeMark className="w-12 h-12 text-[#074E5B]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Activate Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start your <span className="font-bold text-[#074E5B]">3-day free trial</span> today. Cancel anytime.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[800px]">
        <div className="bg-white shadow sm:rounded-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Plan Details */}
          <div className="p-8 md:w-1/2 bg-[#074E5B] text-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Pro Plan</h3>
              <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                $15
                <span className="ml-1 text-xl font-medium text-white/70">/mo</span>
              </div>
              <p className="mt-4 text-sm text-white/80">
                Everything you need to automate your invoice reminders and get paid faster.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Unlimited automated reminders",
                  "Multiple Stripe & PayPal accounts",
                  "Custom cadence sequences",
                  "Team members access",
                  "Priority support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-[#d6fd70]" />
                    </div>
                    <p className="ml-3 text-sm text-white/90">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20 flex items-center gap-3 text-sm text-white/80 font-medium">
              <ShieldCheck className="w-5 h-5 text-[#d6fd70]" />
              Secure, encrypted payment via Stripe.
            </div>
          </div>

          {/* Checkout UI */}
          <div className="p-8 md:w-1/2 bg-white flex flex-col justify-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Details</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-[200px] flex items-center justify-center text-sm text-gray-500 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 font-mono text-xs px-2 py-1 rounded">Stripe Payment Element</span>
                  <p>Secure payment form will render here.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between text-sm text-[#074E5B] font-medium mb-4">
                  <span>Trial Discount (3 Days)</span>
                  <span>-$15.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-4">
                  <span>Total Due Today</span>
                  <span>$0.00</span>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#d6fd70] hover:bg-[#c4ec5a] text-[#131313] py-3.5 px-4 rounded-xl font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#074E5B]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Start 3-Day Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                You will not be charged until the 3-day trial period ends. Cancel anytime before to avoid charges.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
