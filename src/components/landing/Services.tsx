'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

export function Services() {
  return (
    <section id="why" className="w-full bg-white">
      <div className="mx-auto px-12 py-24">
        <Reveal delay={0} className="flex flex-col items-center gap-8 text-center md:gap-12">
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-1 w-1 rounded-full bg-black"
            ></div>
            <span
              className="font-mono text-sm font-medium tracking-widest uppercase text-black"
              style={{ letterSpacing: '1.92px' }}
            >
              FEATURES
            </span>
          </div>

          <h2
            className="max-w-3xl text-5xl font-medium leading-tight md:text-6xl text-black"
            style={{
              letterSpacing: '-0.32px',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            Built for anyone who invoices and waits
          </h2>

          <p
            className="max-w-2xl text-base leading-relaxed text-gray-500"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              letterSpacing: '-0.32px',
            }}
          >
            Agencies, contractors, consultants, landlords &mdash; not just freelancers. If you invoice and wait, this is for you.
          </p>

          <Link
            href="/login"
            className="group flex h-12 items-center justify-center gap-2 rounded-full bg-[#131313] px-6 font-mono text-sm font-medium uppercase tracking-wider text-[#d6fd70] transition-transform duration-300 hover:scale-95 hover:bg-white hover:text-[#131313]"
          >
            GET STARTED
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </Reveal>

        <div className="mt-16">
          <div
            className="flex flex-col gap-4 p-4 md:flex-row"
            style={{
              backgroundColor: '#f2f2f2',
              borderRadius: '0',
            }}
          >
            <Reveal delay={100} className="flex-1 md:flex-[1.2] h-full">
              <ServiceCard
                icon={
                  <Image
                    src="/landing/698e4863b7c4e4770533722e_mingcute_ai-fill.svg"
                    alt="AI strategy"
                    width={24}
                    height={24}
                    unoptimized
                  />
                }
                title="Read-only, always"
                description="We never move money and never create invoices. Disconnect anytime, one click."
                bgImage="/landing/696202d02a0dce5f45a031fb_service-img-2.webp"
              />
            </Reveal>

            <Reveal delay={200} className="flex-1 md:flex-[1.2] h-full">
              <ServiceCard
                icon={
                  <Image
                    src="/landing/698e4875214fe570673439cb_basil_chart-pie-solid.svg"
                    alt="Business consulting"
                    width={24}
                    height={24}
                    unoptimized
                  />
                }
                title="Escalating, not spammy"
                description="Gentle at Day 3, firmer at Day 7, final notice at Day 14 &mdash; tone that matches urgency."
                bgImage="/landing/6961fe8f17d6448d5348850c_service-img.webp"
              />
            </Reveal>

            <Reveal delay={300} className="flex-1 md:flex-[1.2] h-full">
              <ServiceCard
                icon={
                  <Image
                    src="/landing/698e487f52e4cd9da04322e0_ic_round-insert-chart.svg"
                    alt="Data & insights"
                    width={24}
                    height={24}
                    unoptimized
                  />
                }
                title="Flat fee, no cut"
                description="$9-15/month. Not a percentage of what you collect. Get paid more, keep more."
                bgImage="/landing/696202de6ed108d94012bd8e_service-img-3.webp"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  bgImage: string
}

function ServiceCard({ icon, title, description, bgImage }: ServiceCardProps) {
  return (
    <div
      className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-none p-6 transition-all duration-500 ease-out cursor-pointer h-full border border-gray-100 hover:border-transparent hover:shadow-2xl"
      style={{
        minHeight: '340px',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Background Image: Hover to reveal and scale */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <Image
          src={bgImage}
          alt={title}
          fill
          className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:bg-[#131313] group-hover:text-white"
          style={{ backgroundColor: '#d6fd70' }}
        >
          {icon}
        </div>
        <div className="transition-all duration-300">
          <h3
            className="text-xl font-medium transition-colors duration-300 group-hover:text-white"
            style={{
              color: '#131313',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            {title}
          </h3>
          <p
            className="mt-2 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-300"
            style={{
              color: '#585858',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            {description}
          </p>
          
        </div>
      </div>
    </div>
  )
}
