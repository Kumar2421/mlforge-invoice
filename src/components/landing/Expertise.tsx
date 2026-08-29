'use client';

import { Reveal } from '@/components/ui/Reveal';
import { Sparkles, TrendingUp, Users, Lock } from 'lucide-react';

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
            Everything the reminder engine handles for you
          </h2>

          <p className="max-w-xl text-center text-base leading-relaxed text-[#585858]">
            Set it up once. The cadence, the tone, and the stop-on-paid logic run themselves from there.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal delay={100}>
            <ExpertiseCard
              icon={0}
              title="Escalation cadence"
              description="Default Day 3 / 7 / 14 sequence, or set your own timing and tone per client."
            >
              <StageDotsCard />
            </ExpertiseCard>
          </Reveal>

          <Reveal delay={200}>
            <ExpertiseCard
              icon={1}
              title="Payment analytics"
              description="Collection rate, average days-to-pay, and how well each reminder stage actually works."
            >
              <ChartMockupCard />
            </ExpertiseCard>
          </Reveal>

          <Reveal delay={300}>
            <ExpertiseCard
              icon={2}
              title="Client management"
              description="See every client's outstanding balance and on-time rate. Mute reminders per client anytime."
            >
              <ClientRowCard />
            </ExpertiseCard>
          </Reveal>

          <Reveal delay={400}>
            <ExpertiseCard
              icon={3}
              title="Trust & security"
              description="Restricted read-only Stripe key. We can see invoices and payments — nothing else, ever."
            >
              <TrustCard />
            </ExpertiseCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const ICONS = [Sparkles, TrendingUp, Users, Lock];

interface ExpertiseCardProps {
  icon: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

function ExpertiseCard({ icon, title, description, children }: ExpertiseCardProps) {
  const Icon = ICONS[icon % ICONS.length];

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f7f7f7] p-8" style={{ minHeight: '360px' }}>
      <div className="flex flex-col gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6fd70]">
          <Icon className="h-5 w-5 text-[#131313]" strokeWidth={2} />
        </div>

        <h3 className="text-2xl font-medium text-[#131313]">{title}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-[#585858]">{description}</p>
      </div>

      <div className="relative mt-8 flex h-40 items-end justify-end">
        {children}
      </div>
    </div>
  );
}

function StageDotsCard() {
  return (
    <div className="absolute bottom-0 right-0 w-[220px] rounded-2xl bg-white p-4 shadow-xl">
      <p className="text-xs font-medium text-[#585858]">Reminder sequence</p>
      <p className="mt-1 text-sm font-semibold text-[#131313]">Day 3 &rarr; 7 &rarr; 14</p>
      <div className="mt-3 flex items-center gap-1.5">
        {[true, true, false].map((sent, i) => (
          <div key={i} className="flex flex-1 items-center gap-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${sent ? 'bg-[#131313]' : 'border-2 border-[#d6fd70]'}`} />
            {i < 2 && <span className="h-px flex-1 bg-gray-200" />}
          </div>
        ))}
      </div>
      <span className="mt-3 inline-block rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-medium text-[#22C55E]">
        Runs on its own
      </span>
    </div>
  );
}

function ChartMockupCard() {
  return (
    <div className="absolute bottom-0 right-0 w-[220px] rounded-2xl bg-white p-4 shadow-xl">
      <p className="text-xs font-medium text-[#585858]">Collection rate</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-black leading-none text-[#131313]">84%</span>
        <span className="text-[10px] font-semibold text-[#22C55E]">+2.5%</span>
      </div>
      <div className="mt-3 flex items-end gap-1.5">
        <div className="h-6 w-3 rounded bg-[#131313]/15" />
        <div className="h-9 w-3 rounded bg-[#131313]/25" />
        <div className="h-7 w-3 rounded bg-[#131313]/25" />
        <div className="h-12 w-3 rounded bg-[#131313]" />
      </div>
    </div>
  );
}

function ClientRowCard() {
  return (
    <div className="absolute bottom-0 right-0 w-[220px] rounded-2xl bg-white p-4 shadow-xl">
      <p className="text-xs font-medium text-[#585858]">Andi Permana</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-xl font-black leading-none text-[#131313]">$730</span>
        <span className="text-[10px] font-medium text-[#585858]">outstanding</span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#FAFAFA] px-2.5 py-1.5">
        <div className="h-5 w-5 shrink-0 rounded-full bg-[#131313]/10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-medium text-[#131313]">On-time rate</p>
        </div>
        <span className="rounded-full bg-[#f0fdf4] px-1.5 py-0.5 text-[9px] font-semibold text-[#22C55E]">72%</span>
      </div>
    </div>
  );
}

function TrustCard() {
  return (
    <div className="absolute bottom-0 right-0 w-[220px] rounded-2xl bg-white p-4 shadow-xl">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#131313]">
          <Lock className="h-3.5 w-3.5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-xs font-medium text-[#585858]">Access level</p>
          <p className="text-sm font-semibold text-[#131313]">Read-only key</p>
        </div>
      </div>
      <span className="mt-3 inline-block rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-medium text-[#22C55E]">
        invoices:read only
      </span>
    </div>
  );
}
