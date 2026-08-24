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
    username: "@kmasters",
    body: "“Our productivity has nearly doubled since onboarding. Automation features removed repetitive tasks, allowing our team to focus on building instead of managing operations.”",
    profile: "https://images.shadcnspace.com/assets/profiles/rough.webp",
  },
  {
    name: "Kira Athrun",
    username: "@kathrun",
    body: "“What surprised us most was how quickly our team adapted. Minimal learning curve, excellent documentation, and powerful features make it a must-have for modern SaaS companies.”",
    profile: "https://images.shadcnspace.com/assets/profiles/albert.webp",
  },
  {
    name: "Lirael Nassun",
    username: "@lnassun",
    body: "“This is easily one of the most reliable SaaS tools we’ve adopted. The UI is intuitive, integrations are seamless, and it saves us countless hours every week.”",
    profile: "https://images.shadcnspace.com/assets/profiles/linda.webp",
  },
  {
    name: "Jessica",
    username: "@jessica",
    body: "Switching to this platform streamlined our entire workflow. Setup was effortless, performance improved instantly, and our team now ships features faster without worrying about infrastructure.",
    profile: "https://images.shadcnspace.com/assets/profiles/jessica.webp",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "“We evaluated multiple solutions, but this stood out immediately. It’s fast, scalable, and thoughtfully designed for growing teams that need stability without added complexity.”",
    profile: "https://images.shadcnspace.com/assets/profiles/jenny.webp",
  },
  {
    name: "Kira Athrun",
    username: "@kathrun-2",
    body: "“What surprised us most was how quickly our team adapted. Minimal learning curve, excellent documentation, and powerful features make it a must-have for modern SaaS companies.”",
    profile: "https://images.shadcnspace.com/assets/profiles/albert.webp",
  },
  {
    name: "Ken Masters",
    username: "@kmasters-2",
    body: "“Our productivity has nearly doubled since onboarding. Automation features removed repetitive tasks, allowing our team to focus on building instead of managing operations.”",
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
              What they say about us?
            </h2>
            <p className="max-w-xl text-base text-gray-600">
              Here&apos;s what they shared about their experience working with our team.
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
