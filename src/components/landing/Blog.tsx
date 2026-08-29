import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const cards = [
  {
    slug: "/blog",
    kicker: "Guide",
    title: "How to ask a client for a late payment (without burning the relationship)",
    summary:
      "Templates for the gentle nudge, the firm follow-up, and the final notice — the same escalation the reminder engine automates.",
  },
  {
    slug: "/compare/no-percentage-cut",
    kicker: "Comparison",
    title: "What a percentage cut actually costs you",
    summary:
      "On $10,000/month collected, a 2% tool costs $200. A flat fee costs $9. Here's the math across revenue levels.",
  },
  {
    slug: "/blog",
    kicker: "Explainer",
    title: "What “read-only” means for your Stripe account",
    summary:
      "A restricted key that reads invoices and payments and nothing else. No charges, no refunds, no transfers — enforced by Stripe.",
  },
];

export function Blog() {
  return (
    <section className="w-full bg-white font-sans">
      <div className="pt-[72px]" />
      <div className="px-6 md:px-[52px]">
        <div className="mx-auto max-w-[1280px] md:px-7">
          <Reveal delay={0} className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-2 bg-black" />
                <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-black">
                  Reading
                </span>
              </div>
              <h2 className="mb-4 text-4xl font-medium leading-tight tracking-[-1.5px] text-black md:text-5xl">
                Getting paid, explained
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-[#585858]">
                Practical notes on late payments, reminder cadence, and running a small
                business without chasing invoices by hand.
              </p>
            </div>
            <Link
              href="/blog"
              className="flex w-fit items-center gap-3 whitespace-nowrap rounded-full bg-[#131313] px-5 py-2 font-mono text-sm font-medium uppercase tracking-[1.92px] text-[#d6fd70] transition-opacity hover:opacity-90"
            >
              View all
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {cards.map((card, index) => (
              <Reveal key={card.title} delay={100 * (index + 1)}>
                <Link
                  href={card.slug}
                  className="group flex h-full flex-col justify-between rounded-[24px] border border-[#E8E8E8] bg-[#FAFAFA] p-6 transition-colors hover:border-[#131313]"
                >
                  <div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#585858]">
                      {card.kicker}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-[#131313]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#585858]">{card.summary}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#131313]">
                    Read
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2.5}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-[72px]" />
    </section>
  );
}
