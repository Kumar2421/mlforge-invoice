import { Check, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

export function Pricing() {
  const cards = [
    {
      name: 'SOLO',
      description: 'For one person chasing their own invoices.',
      price: '$9',
      features: [
        '1 Stripe account, read-only',
        'Unlimited overdue-invoice reminders',
        'Default Day 3 / 7 / 14 cadence',
        'Editable reminder templates',
        'Your own sender name & email',
        'Collection analytics dashboard',
        'Email support',
      ],
      featured: false,
    },
    {
      name: 'PRO',
      description: 'For teams and anyone who needs per-client control.',
      price: '$15',
      features: [
        'Everything in Solo',
        'Custom cadence per client',
        'Per-client reminder mute',
        'Team members & shared workspace',
        'PayPal, read-only (coming soon)',
        'Priority support',
      ],
      featured: true,
    },
  ];

  return (
    <section id="pricing" className="w-full bg-white py-20">
      <div className="mx-auto px-8 max-w-7xl">
        <Reveal delay={0} className="flex flex-col items-center justify-center text-center mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-1 rounded-full bg-[#131313]"></div>
            <span className="text-sm font-medium tracking-[1.92px] uppercase font-mono text-[#131313]">
              Pricing
            </span>
          </div>

          <h2 className="text-5xl font-medium mb-6 text-[#131313] max-w-2xl leading-tight">
            Flat fee. No percentage cut.
          </h2>

          <p className="text-base text-[#585858] mb-4 max-w-2xl leading-relaxed">
            Other tools take a cut of what you collect. We charge a flat monthly fee &mdash; you
            keep everything you get paid.
          </p>
          <p className="text-sm font-semibold text-[#0F5A68] mb-8">
            3-day free trial · no credit card required
          </p>

          <a
            href="/login"
            className="flex items-center gap-2 px-6 py-3 bg-[#131313] text-[#d6fd70] rounded-full hover:bg-black transition-colors font-mono uppercase text-sm font-medium tracking-wide"
          >
            <span>Start free trial</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#f2f2f2] p-3 rounded-2xl max-w-3xl mx-auto">
          {cards.map((card, index) => (
            <Reveal
              key={index}
              delay={(index + 1) * 100}
              className={cn(
                'rounded-xl p-5 flex flex-col',
                card.featured ? 'bg-[#d6fd70] md:scale-100' : 'bg-white',
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center font-medium',
                    card.featured ? 'bg-[#131313] text-[#d6fd70]' : 'bg-[#d6fd70] text-[#131313]',
                  )}
                >
                  {card.featured ? '★' : '▲'}
                </div>
                <span className="text-xs font-medium tracking-widest uppercase">{card.name}</span>
              </div>

              <p
                className={cn(
                  'text-sm mb-5 leading-relaxed',
                  card.featured ? 'text-[#131313]' : 'text-[#585858]',
                )}
              >
                {card.description}
              </p>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-[#131313]">{card.price}</span>
                <span className="text-sm text-[#585858]">/month</span>
              </div>
              <p className={cn('text-[11px] mb-5', card.featured ? 'text-[#131313]/70' : 'text-[#9a9a9a]')}>
                after your 3-day free trial
              </p>

              <div className="border-t border-current opacity-20 mb-5"></div>

              <ul className="space-y-3 mb-6 flex-grow">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#131313] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span
                      className={cn(
                        'text-sm leading-relaxed',
                        card.featured ? 'text-[#131313]' : 'text-[#585858]',
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/login"
                className="w-full py-3 px-5 rounded-full font-mono uppercase text-sm font-medium tracking-wider transition-all block text-center bg-[#131313] text-[#d6fd70] hover:bg-black"
              >
                Start free trial
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-[12px] text-[#9a9a9a]">
          We never move money and never create invoices. Read-only Stripe access, always.
        </p>
      </div>
    </section>
  );
}
