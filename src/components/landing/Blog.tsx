import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal";

export function Blog() {
  const cards = [
    {
      id: "1",
      title: "Why 71% of Freelancers Get Paid Late (And What Fixes It)",
      image:
        "/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6961c58c9c176be6aada8c2f_blog-img-1_1x.webp",
    },
    {
      id: "2",
      title: "What 'Read-Only' Actually Means for Your Stripe Account",
      image:
        "/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6961c6ca3c9b5f744a47a796_blog-img-2_1x.webp",
    },
    {
      id: "3",
      title: "Writing a Firm Payment Reminder Without Sounding Rude",
      image:
        "/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6961c70052120388fb4e8c2a_blog-img-3_1x.webp",
    },
  ];

  return (
    <section className="w-full bg-white font-sans">
      <div className="pt-[72px]" />

      <div className="px-[52px]">
        <div className="mx-auto max-w-[1280px] px-7">
          <Reveal delay={0} className="mb-16 flex items-end justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-2 bg-black" />
                <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-black">
                  Blog and Articles
                </span>
              </div>

              <h2 className="mb-4 text-5xl font-medium leading-[57.6px] tracking-[-2.88px] text-black">
                Getting paid, explained
              </h2>

              <p className="text-base leading-[22.4px] tracking-[-0.32px] text-[#585858]">
                Practical notes on late payments, reminder cadence, and running
                a small business without chasing invoices by hand.
              </p>
            </div>

            <Link
              href="#"
              className="flex items-center gap-4 whitespace-nowrap rounded-full bg-[#131313] px-5 py-2 font-mono text-sm font-medium uppercase tracking-[1.92px] text-[#d6fd70] transition-opacity hover:opacity-90"
            >
              View All
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </Reveal>

          <div className="mb-16" />

          <div className="grid grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Link
                key={card.id}
                href="#"
                className="group block"
              >
                <Reveal delay={100 * (index + 1)}>
                  <div className="relative overflow-hidden rounded-[24px]">
                    <div className="relative w-full" style={{ aspectRatio: "1" }}>
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />

                      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70">
                        <ArrowUpRight
                          size={18}
                          className="text-white"
                          strokeWidth={2.5}
                        />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent px-6 py-6">
                        <h3 className="text-lg font-medium leading-tight text-white">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-[72px]" />
    </section>
  );
}
