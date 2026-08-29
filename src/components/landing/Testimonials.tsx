'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee-01-utils/marquee"
import { Reveal } from "@/components/ui/Reveal"

interface Reason {
  who: string
  context: string
  body: string
}

// Pre-launch: these are the reasons the product exists, written as the situations
// it's built for — not fabricated customer quotes. Swap for real testimonials
// once early customers give them.
const reasons: Reason[] = [
  {
    who: "The Friday-afternoon email",
    context: "Freelancers",
    body: "You know the invoice is overdue. You just don't want to be the one writing “gentle nudge” for the third time. Now you don't have to.",
  },
  {
    who: "Net-30 that means net-45",
    context: "Contractors",
    body: "Invoices that technically have terms but always drift. An escalating sequence keeps the pressure on without you thinking about it.",
  },
  {
    who: "Read-only was the dealbreaker",
    context: "Consultants",
    body: "A tool that can't touch your money is a tool you can actually connect. It reads invoices and payments — that's the whole permission.",
  },
  {
    who: "Rent invoices to tenants",
    context: "Property managers",
    body: "Not just for freelancers. The escalating tone means you're not the one sending the firm email — the system is.",
  },
  {
    who: "Flat fee, not a percentage",
    context: "Anyone collecting real money",
    body: "On a $10,000 invoice, a 2% tool costs $200 to send reminder emails. This costs $9, whatever you collect.",
  },
  {
    who: "Mute the clients who don't need it",
    context: "Agencies",
    body: "A couple of long-term clients just need a heads-up, not an escalation. Per-client mute handles that in one click.",
  },
]

const firstRow = reasons.slice(0, reasons.length / 2)
const secondRow = reasons.slice(reasons.length / 2)

const ReasonCard = ({ who, context, body }: Reason) => {
  return (
    <Card className="relative h-full w-72 cursor-default overflow-hidden border border-gray-150 bg-[#f8f9fa] shadow-none p-6 rounded-none transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-gray-200">
      <CardContent className="p-0 flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-foreground leading-tight">{who}</p>
          <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-wider">{context}</p>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{body}</p>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white pb-32 pt-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal delay={0}>
          <div className="mb-16">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1 w-1 bg-foreground" />
              <span className="font-mono text-sm font-medium uppercase tracking-widest text-foreground">
                Why people use it
              </span>
            </div>
            <h2 className="mb-8 text-4xl md:text-5xl font-medium text-[#131313]">
              Built for the part of invoicing nobody enjoys
            </h2>
            <p className="max-w-xl text-base text-gray-600">
              The situations mlforge Invoice is designed for. Real quotes will replace these
              as early customers share them.
            </p>
          </div>
        </Reveal>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:25s]">
            {firstRow.map((r) => (
              <ReasonCard key={r.who} {...r} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:25s]">
            {secondRow.map((r) => (
              <ReasonCard key={r.who} {...r} />
            ))}
          </Marquee>
          <div className="from-white pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r z-10" />
          <div className="from-white pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l z-10" />
        </div>
      </div>
    </section>
  )
}
