'use client'

import Image from 'next/image'
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal'

export function About() {
  return (
    <section className="w-full bg-white">
      <div className="pt-[72px]">
        <div className="px-[52px]">
          <div className="mx-auto w-full max-w-[1280px]">
            <Reveal delay={0}>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-1 rounded-full bg-foreground"></div>
                  <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-foreground">
                    About us
                  </span>
                </div>

                <div className="h-5"></div>

                <div className="w-full max-w-[656px]">
                  <h2 className="text-center text-[56px] font-bold leading-[1.2] text-foreground">
                    A global consulting partner dedicated to building{' '}
                    <span className="inline-flex items-center gap-[5.6px]">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 text-lg font-bold text-white">
                        ⚙
                      </span>
                      smarter
                    </span>{' '}
                    and{' '}
                    <span className="inline-flex items-center gap-[5.6px]">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lime text-lg font-bold text-black">
                        💡
                      </span>
                      more adaptive
                    </span>
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="h-20"></div>

            <style dangerouslySetInnerHTML={{ __html: `
              @media (min-width: 768px) {
                .about-grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                  grid-template-rows: 202.391px 88px !important;
                }
                .md-span-2 {
                  grid-row: span 2 !important;
                }
              }
            `}} />

            <div
              className="about-grid grid grid-cols-1 gap-4 w-full"
            >
              <Reveal delay={100} style={{}} className="h-full md-span-2">
                <div
                  className="relative overflow-hidden rounded-none bg-blue-500 p-5 h-full min-h-[220px]"
                >
                  <Image
                    src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/693671b05ed33655d4b7ce17_card-about-img.avif"
                    alt="Person"
                    fill
                    className="object-cover"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-16 md:gap-0">
                    <div>
                      <Image
                        src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/692a148227a37705feded0ce_ipsum-logo.svg"
                        alt="Ipsum Logo"
                        width={80}
                        height={30}
                        className="h-auto w-20"
                      />
                    </div>
                    <div className="rounded-none bg-white p-6 text-black">
                      <div className="text-4xl font-bold">120+</div>
                      <p className="mt-2 text-sm leading-relaxed">
                        Collaborating with leading AI and cloud technology
                        providers.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200} style={{}} className="h-full md-span-2">
                <div
                  className="rounded-none p-5 h-full flex flex-col justify-between min-h-[220px]"
                  style={{
                    backgroundColor: 'rgb(242, 242, 242)',
                  }}
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Commitment to measurable
                    </div>
                    <div className="mt-3 text-4xl font-bold text-foreground">
                      100%
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      &ldquo;Their automation strategy completely reshaped how we work.
                      It&apos;s efficient, intelligent, and seamless.&rdquo;
                    </p>
                    <div className="flex gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                        <Image
                          src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e4c804dbf540688e23_users-1.avif"
                          alt="User 1"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative -ml-3 h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                        <Image
                          src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e4fe402c7f09028c97_users-2.avif"
                          alt="User 2"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative -ml-3 h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                        <Image
                          src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e4bfe84c916ea64131_users-3.avif"
                          alt="User 3"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative -ml-3 h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                        <Image
                          src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e43cf07256024b75c1_users-4.avif"
                          alt="User 4"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300} className="h-full">
                <div
                  className="rounded-none p-5 h-full min-h-[140px]"
                  style={{ backgroundColor: 'rgb(214, 253, 112)' }}
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Data Points
                    </div>
                    <div className="mt-3 text-4xl font-bold text-foreground">
                      520k+
                    </div>
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-foreground">
                    Analyzed monthly to power smarter business strategies.
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400} className="h-full">
                <div
                  className="flex items-center justify-between rounded-none p-5 text-white h-full min-h-[80px]"
                  style={{ backgroundColor: 'rgb(19, 19, 19)' }}
                >
                  <span className="text-sm font-medium">Continents</span>
                  <span className="text-2xl font-bold">20+</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
