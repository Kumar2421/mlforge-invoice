import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBanner() {
  return (
    <div className="px-3 pb-3">
      <div className="relative w-full overflow-hidden rounded-[24px] bg-[#131313]">
        <Image
          src="/landing/cta-bg.avif"
          alt=""
          aria-hidden
          fill
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(12,12,15,0.72) 0%, rgba(12,12,15,0.30) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-center px-8 py-14 md:px-14 md:py-20">
          <div className="flex max-w-2xl flex-col gap-5">
            <Reveal delay={0}>
              <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-[#d6fd70]">
                Read-only, always
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-4xl font-medium leading-tight tracking-[-0.03em] text-white md:text-5xl">
                Stop chasing payments by hand
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="max-w-lg text-base leading-relaxed text-white/70">
                Connect your Stripe account in under a minute. Escalating reminders start
                working the same day, and stop the instant an invoice is paid.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <Link
                href="/login"
                className="inline-flex w-fit items-center gap-3 rounded-full bg-[#d6fd70] px-3 py-2 pl-5 font-mono text-sm font-medium uppercase tracking-widest text-[#131313] transition-transform hover:scale-95 hover:bg-white"
              >
                Get started
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#131313]">
                  <ArrowRight className="h-4 w-4 text-white" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
