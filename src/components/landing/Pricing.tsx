import { Check, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

export function Pricing() {
  const cards = [
    {
      name: 'STARTER PLAN',
      description: 'Perfect for small teams beginning to explore AI and automation.',
      price: '$2,500',
      features: [
        'Strategy consultation (up to 10 hours)',
        'Business process mapping',
        'Basic AI workflow setup',
        'Email support'
      ],
      featured: false
    },
    {
      name: 'GROWTH PLAN',
      description: 'Designed for growing companies ready to integrate AI into their operations.',
      price: '$8,500',
      features: [
        'Dedicated consultant',
        'End-to-end automation setup',
        'Predictive analytics dashboards',
        'AI-driven reporting & insights'
      ],
      featured: true
    },
    {
      name: 'ENTERPRISE PLAN',
      description: 'Custom-built for enterprises seeking full-scale transformation optimization.',
      price: '$10,500',
      features: [
        'Tailored AI implementation roadmap',
        'Custom automation architecture',
        'Advanced data analytics',
        '24/7 premium support'
      ],
      featured: false
    }
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto px-8 max-w-7xl">
        <Reveal delay={0} className="flex flex-col items-center justify-center text-center mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-1 rounded-full bg-[#131313]"></div>
            <span className="text-sm font-medium tracking-[1.92px] uppercase font-mono text-[#131313]">
              Pricing
            </span>
          </div>

          <h2 className="text-5xl font-medium mb-6 text-[#131313] max-w-2xl leading-tight">
            Flexible Plans Built for Every Stage of Growth
          </h2>

          <p className="text-base text-[#585858] mb-8 max-w-2xl leading-relaxed">
            Whether you&apos;re just starting your AI journey or scaling enterprise-wide innovation, we offer tailored solutions that grow with you.
          </p>

          <button className="flex items-center gap-2 px-6 py-3 bg-[#131313] text-[#d6fd70] rounded-full hover:bg-black transition-colors font-mono uppercase text-sm font-medium tracking-wide">
            <span>GET STARTED</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#f2f2f2] p-3 rounded-2xl">
          {cards.map((card, index) => (
            <Reveal key={index} delay={(index + 1) * 100} className={cn(
              'rounded-xl p-5 flex flex-col',
              card.featured
                ? 'bg-[#d6fd70] md:scale-100'
                : 'bg-white'
            )}>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center font-medium',
                    card.featured
                      ? 'bg-[#131313] text-[#d6fd70]'
                      : 'bg-[#d6fd70] text-[#131313]'
                  )}
                >
                  {card.featured ? '★' : '▲'}
                </div>
                <span className="text-xs font-medium tracking-widest uppercase">
                  {card.name}
                </span>
              </div>

              <p className={cn(
                'text-sm mb-5 leading-relaxed',
                card.featured ? 'text-[#131313]' : 'text-[#585858]'
              )}>
                {card.description}
              </p>

              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-4xl font-bold text-[#131313]">
                  {card.price}
                </span>
                <span className="text-sm text-[#585858]">/month</span>
              </div>

              <div className="border-t border-current opacity-20 mb-5"></div>

              <ul className="space-y-3 mb-6 flex-grow">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#131313] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className={cn(
                      'text-sm leading-relaxed',
                      card.featured ? 'text-[#131313]' : 'text-[#585858]'
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className={cn(
                'w-full py-3 px-5 rounded-full font-mono uppercase text-sm font-medium tracking-wider transition-all',
                card.featured
                  ? 'bg-[#131313] text-[#d6fd70] hover:bg-black'
                  : 'bg-[#131313] text-[#d6fd70] hover:bg-black'
              )}>
                GET STARTED
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
