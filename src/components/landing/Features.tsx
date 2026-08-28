import { Check, X, ArrowUpRight, Shield, Zap, Clock, DollarSign, Mail, BarChart3 } from 'lucide-react';
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Read-only. Always.',
      description: 'We never move money, create invoices, or modify your Stripe or PayPal data. A restricted API key gives us read-only access to invoices and payment events — nothing else.',
      highlight: true,
    },
    {
      icon: Zap,
      title: 'Automated escalation',
      description: 'The moment an invoice passes its due date, an escalating 3-stage reminder sequence kicks in automatically. Day 3 is polite. Day 7 is firm. Day 14 is final.',
    },
    {
      icon: Clock,
      title: 'Auto-stops on payment',
      description: 'When Stripe confirms the invoice is paid, every active reminder in the sequence is instantly cancelled. No awkward "please pay" emails after the client already has.',
    },
    {
      icon: DollarSign,
      title: 'Flat fee, zero cut',
      description: 'Other tools take 1-3% of every dollar you collect. We charge $9/mo or $15/mo flat. You keep 100% of what your clients pay you.',
    },
    {
      icon: Mail,
      title: 'Your brand, your sender',
      description: 'Reminders go out from your own email address and domain. Clients see your name, not ours. Configure sender identity, reply-to, and tone in settings.',
    },
    {
      icon: BarChart3,
      title: 'Collection analytics',
      description: 'Track collection rates, average days-to-pay, and outstanding amounts in a live dashboard. Know exactly where your money is at any given moment.',
    },
  ];

  return (
    <section id="features" className="w-full bg-[#FAFAFA] py-24">
      <div className="mx-auto px-8 max-w-7xl">
        <Reveal delay={0} className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-1 rounded-full bg-[#131313]"></div>
            <span className="text-sm font-medium tracking-[1.92px] uppercase font-mono text-[#131313]">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#131313] max-w-3xl leading-tight mb-6">
            Everything you need to get paid on time
          </h2>
          <p className="text-base text-[#585858] max-w-2xl leading-relaxed">
            Built for freelancers, agencies, and small businesses who invoice through Stripe or PayPal and are tired of manually chasing late payments.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={index} delay={(index + 1) * 80}>
                <div className={`rounded-2xl p-6 h-full ${feature.highlight ? 'bg-[#131313] text-white' : 'bg-white border border-[#E8E8E8]'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${feature.highlight ? 'bg-[#d6fd70] text-[#131313]' : 'bg-[#F2F2F2] text-[#131313]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${feature.highlight ? 'text-white' : 'text-[#131313]'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${feature.highlight ? 'text-white/70' : 'text-[#585858]'}`}>
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
