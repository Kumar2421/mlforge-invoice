'use client';

import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

export function Expertise() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal delay={0} className="flex flex-col items-center justify-center mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-1 rounded-full bg-[#131313]" />
            <span className="text-sm font-medium tracking-widest text-[#131313] uppercase">
              Expertise
            </span>
          </div>

          <h2 className="mb-6 max-w-2xl text-center text-5xl font-medium leading-tight text-[#131313]">
            Where human insight meets intelligent technology
          </h2>

          <p className="max-w-xl text-center text-base leading-relaxed text-[#585858]">
            We help businesses harness technology not to replace human creativity, but to amplify it — enabling smarter decisions and faster.
          </p>
        </Reveal>

        <div className="rounded-[24px] bg-[#f2f2f2] p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Reveal delay={100}>
              <ExpertiseCard
                title="Automation & optimization"
                description="Streamline your operations through intelligent workflow automation that saves time, reduces errors, and boosts productivity."
              >
                <div className="flex items-center gap-2">
                  <Pill text="Professional" />
                  <Pill text="Strategic" />
                  <Pill text="AI-Focused" />
                  <Pill text="Startup Feel" />
                </div>
              </ExpertiseCard>
            </Reveal>

            <Reveal delay={200}>
              <ExpertiseCard
                title="Data analytics & insights"
                description="Transform raw data into strategic insight using advanced analytics, dashboards, and predictive modeling."
              >
                <ChartMockup />
              </ExpertiseCard>
            </Reveal>

            <Reveal delay={300}>
              <ExpertiseCard
                title="Digital transformation"
                description="We guide organizations through full-scale digital evolution — modernizing systems, processes, and decision-making frameworks."
              >
                <div className="flex items-center gap-2">
                  <Pill text="Smarter" />
                  <Pill text="Grow Faster" />
                  <Pill text="Build Smart" />
                  <Pill text="Simple" />
                </div>
              </ExpertiseCard>
            </Reveal>

            <Reveal delay={400}>
              <ExpertiseCard
                title="Experience intelligence"
                description="Combine data and design to deliver smarter, more personalized digital experiences that connect with users."
              >
                <DecorativeMockup />
              </ExpertiseCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExpertiseCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ExpertiseCard({ title, description, children }: ExpertiseCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[12px] bg-white p-3">
      <div className="flex h-24 w-full items-center justify-center md:h-96">
        {children}
      </div>

      <div className="w-full px-4 py-4">
        <h3 className="mb-2 text-lg font-medium text-[#131313]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[#585858]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <div className="inline-block rounded-full border border-[#131313] px-3 py-1 text-xs font-medium text-[#131313]">
      {text}
    </div>
  );
}

function ChartMockup() {
  return (
    <div className="flex items-end gap-1">
      <div className="h-8 w-2 rounded bg-gray-300" />
      <div className="h-12 w-2 rounded bg-gray-300" />
      <div className="h-10 w-2 rounded bg-gray-300" />
      <div className="h-16 w-2 rounded bg-[#d6fd70]" />
      <div className="h-6 w-2 rounded bg-gray-300" />
    </div>
  );
}

function DecorativeMockup() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <div className="h-8 w-8 rounded-lg bg-gray-400" />
        <div className="h-8 w-20 rounded-lg bg-gray-300" />
      </div>
      <div className="flex gap-1">
        <span className="inline-block rounded-full bg-gray-300 px-2 py-1 text-xs text-gray-500">+2.5%</span>
      </div>
      <div className="flex gap-2">
        <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-500">Strategy</span>
        <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-500">Design</span>
      </div>
    </div>
  );
}
