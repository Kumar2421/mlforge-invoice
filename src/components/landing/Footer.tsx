import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

export function Footer() {
  return (
    <footer className="w-full bg-transparent">
      <Reveal delay={0}>
        <div className="px-3 pb-3">
        <div className="w-full rounded-[24px] bg-[#131313] p-[45px] text-white">
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-[552px_736px] gap-12">
              <div className="flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="14" fill="#22C55E" />
                      <path
                        d="M9 18C9 14 12 10 18 9C17 13 15 16 11 18C10.5 18.3 9.5 18.3 9 18Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </svg>
                    <span className="text-base font-bold tracking-tight text-white">Payment Reminders</span>
                  </div>
                  <span className="ml-[34px] text-xs font-medium text-white/50">by mlforge</span>
                </div>

                <p className="text-base leading-[1.4] text-white">
                  Escalating payment reminders for anyone who invoices and waits,
                  connected read-only to your own Stripe.
                </p>

                <div>
                  <label className="mb-4 block text-base font-normal text-white">
                    Get notified when we launch
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 rounded-full bg-[#2a2a2a] px-6 py-3 text-base text-white placeholder-[#808080] outline-none transition-colors hover:bg-[#333333] focus:bg-[#333333]"
                    />
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#d6fd70] px-6 py-3 font-semibold text-black transition-all hover:scale-95 hover:bg-white">
                      SUBMIT
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-4">
                  <span className="text-base font-medium text-white">Product</span>
                  <a href="#how-it-works" className="text-base text-[#b8d4a8]">
                    How it works
                  </a>
                  <a href="#features" className="text-base text-[#b8d4a8]">
                    Features
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-base font-medium text-white">Account</span>
                  <a href="/login" className="text-base text-[#b8d4a8]">
                    Login
                  </a>
                  <a href="#pricing" className="text-base text-[#b8d4a8]">
                    Pricing
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-base font-medium text-white">More</span>
                  <a href="/contact" className="text-base text-[#b8d4a8]">
                    Contact
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Blog
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 border-t border-[#333333] pt-6">
              <div className="flex gap-6">
                <a href="/privacy" className="text-base text-[#b8d4a8]">
                  Privacy
                </a>
                <a href="/terms" className="text-base text-[#b8d4a8]">
                  Terms
                </a>
              </div>

              <span className="text-base text-[#c7c7c7]">
                © 2026 mlforge. Read-only, always.
              </span>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </footer>
  );
}
