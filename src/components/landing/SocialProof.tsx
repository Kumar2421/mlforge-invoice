import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

const stats = [
  { value: '84%', label: 'Average collection rate improvement in the first month' },
  { value: '9 days', label: 'Average days-to-pay (down from 21 without reminders)' },
  { value: '$0', label: 'Percentage cut of your collected revenue' },
  { value: '< 2 min', label: 'Time to connect your Stripe account and go live' },
];

export function SocialProof() {
  return (
    <section className="w-full bg-[#131313] py-20">
      <div className="mx-auto px-8 max-w-7xl">
        <Reveal delay={0} className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            The numbers speak for themselves
          </h2>
          <p className="text-base text-white/60 max-w-xl leading-relaxed">
            Freelancers, agencies, and small businesses use mlforge Invoice to collect overdue payments faster without lifting a finger.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Reveal key={index} delay={(index + 1) * 100}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-[#d6fd70] mb-3">{stat.value}</p>
                <p className="text-sm text-white/60 leading-relaxed">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
