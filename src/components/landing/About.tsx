'use client'

import { Reveal } from '@/components/ui/Reveal'

export function About() {
  return (
    <section id="how-it-works" className="w-full bg-white">
      <div className="pt-[72px]">
        <div className="px-[52px]">
          <div className="mx-auto w-full max-w-[1280px]">
            <Reveal delay={0}>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-1 rounded-full bg-foreground"></div>
                  <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-foreground">
                    How it works
                  </span>
                </div>

                <div className="h-5"></div>

                <div className="w-full max-w-[656px]">
                  <h2 className="text-center text-[56px] font-bold leading-[1.2] text-foreground">
                    Three steps, then{' '}
                    <span className="inline-flex items-center gap-[5.6px]">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 text-lg font-bold text-white">
                        &#128279;
                      </span>
                      never chase
                    </span>{' '}
                    a{' '}
                    <span className="inline-flex items-center gap-[5.6px]">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lime text-lg font-bold text-black">
                        &#128276;
                      </span>
                      late payment
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
                  className="relative overflow-hidden rounded-none p-5 h-full min-h-[220px]"
                  style={{
                    background:
                      'radial-gradient(120% 120% at 0% 0%, #2563EB 0%, #1D4ED8 55%, #1E293B 100%)',
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-16 md:gap-0">
                    <div>
                      <span className="inline-block rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-black">
                        Stripe Connect
                      </span>
                    </div>
                    <div className="rounded-none bg-white p-6 text-black">
                      <div className="text-4xl font-bold">1</div>
                      <p className="mt-2 text-sm leading-relaxed">
                        Connect your Stripe account with a restricted, read-only key.
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
                      We watch for overdue
                    </div>
                    <div className="mt-3 text-4xl font-bold text-foreground">
                      2
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      &ldquo;The moment an invoice passes its due date, an escalating
                      reminder sequence starts on its own.&rdquo;
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#131313] text-xs font-bold text-white">D3</span>
                      <span className="-ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#131313] text-xs font-bold text-white">D7</span>
                      <span className="-ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#22C55E] bg-white text-xs font-bold text-[#22C55E]">D14</span>
                      <span className="ml-2">then it stops</span>
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
                      Escalation Stages
                    </div>
                    <div className="mt-3 text-4xl font-bold text-foreground">
                      3
                    </div>
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-foreground">
                    Day 3, Day 7, Day 14 &mdash; each one firmer than the last.
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400} className="h-full">
                <div
                  className="flex items-center justify-between rounded-none p-5 text-white h-full min-h-[80px]"
                  style={{ backgroundColor: 'rgb(19, 19, 19)' }}
                >
                  <span className="text-sm font-medium">Percentage cut</span>
                  <span className="text-2xl font-bold">0%</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
