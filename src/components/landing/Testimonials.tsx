'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee-01-utils/marquee"
import { Reveal } from "@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal"

interface Review {
  name: string
  username: string
  body: string
  profile: string
}

const reviews: Review[] = [
  {
    name: "Ken Masters",
    username: "Freelance Developer",
    body: "“I used to spend an hour every Friday writing awkward follow-up emails. Now it just happens, and clients pay faster because the reminders don't wait for me to feel like nagging.”",
    profile: "https://images.shadcnspace.com/assets/profiles/rough.webp",
  },
  {
    name: "Kira Athrun",
    username: "Design Agency Owner",
    body: "“Setup took five minutes. Connected Stripe, picked the default cadence, done. Our average days-to-pay dropped noticeably in the first month.”",
    profile: "https://images.shadcnspace.com/assets/profiles/albert.webp",
  },
  {
    name: "Lirael Nassun",
    username: "Independent Consultant",
    body: "“Read-only was the whole reason I trusted it. It can't touch my money, it just tells clients they owe me &mdash; more firmly each week.”",
    profile: "https://images.shadcnspace.com/assets/profiles/linda.webp",
  },
  {
    name: "Jessica",
    username: "Property Manager",
    body: "Not just for freelancers &mdash; I use it for rent invoices to tenants. The escalating tone means I don't have to be the one sending the firm email.",
    profile: "https://images.shadcnspace.com/assets/profiles/jessica.webp",
  },
  {
    name: "Jenny",
    username: "Marketing Contractor",
    body: "“Flat $9/month versus a percentage cut was an easy call. I keep everything I collect.”",
    profile: "https://images.shadcnspace.com/assets/profiles/jenny.webp",
  },
  {
    name: "Marcus Odenwald",
    username: "Small Business Owner",
    body: "“The mute-per-client option matters more than I expected &mdash; a couple of long-term clients just need a heads up, not an escalation.”",
    profile: "https://images.shadcnspace.com/assets/profiles/albert.webp",
  },
  {
    name: "Priya Nair",
    username: "Freelance Illustrator",
    body: "“I stopped dreading the end of every project. The reminders do the uncomfortable part so I don't have to.”",
    profile: "https://images.shadcnspace.com/assets/profiles/rough.webp",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  profile,
  name,
  username,
  body,
}: Review) => {
  return (
    <Card className="relative h-full w-72 cursor-pointer overflow-hidden border border-gray-150 bg-[#f8f9fa] shadow-none p-6 rounded-none transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-gray-200">
      <CardContent className="p-0 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-3">
          <img
            className="rounded-full object-cover"
            width="40"
            height="40"
            alt={name}
            src={profile}
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground leading-none">{name}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              {username}
            </p>
          </div>
        </div>
        <p className="text-sm text-foreground leading-relaxed italic">{body}</p>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white pb-32 pt-16">
      <div className="mx-auto max-w-7xl px-12">
        <Reveal delay={0}>
          <div className="mb-16">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1 w-1 bg-foreground" />
              <span className="font-mono text-sm font-medium uppercase tracking-widest text-foreground">
                Testimonials
              </span>
            </div>
            <h2 className="mb-8 text-5xl font-medium text-[#d6fd80]">
              People who stopped chasing payments
            </h2>
            <p className="max-w-xl text-base text-gray-600">
              Freelancers, agencies, and small businesses using escalating reminders instead of awkward follow-up emails.
            </p>
          </div>
        </Reveal>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:25s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:25s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="from-white pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r z-10"></div>
          <div className="from-white pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l z-10"></div>
        </div>
      </div>
    </section>
  )
}
