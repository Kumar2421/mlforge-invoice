import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mlforge Invoice vs Kolleno & YayPay — Payment Reminder Comparison',
  description:
    'Compare mlforge Invoice with enterprise AR tools like Kolleno and YayPay. See why small businesses choose a $9/mo flat-fee alternative over enterprise-grade platforms.',
};

const rows = [
  { feature: 'Starting price', us: '$9/mo flat', kolleno: '~£650/user/mo', yaypay: 'Custom (enterprise)' },
  { feature: 'Percentage cut', us: '0%', kolleno: 'None', yaypay: 'None' },
  { feature: 'Setup time', us: '< 2 minutes', kolleno: 'Days–weeks', yaypay: 'Weeks–months' },
  { feature: 'Requires sales call', us: 'No', kolleno: 'Yes', yaypay: 'Yes' },
  { feature: 'Stripe integration', us: 'Read-only', kolleno: 'Full ERP integration', yaypay: 'Full ERP integration' },
  { feature: 'Auto-stop on payment', us: 'Yes', kolleno: 'Yes', yaypay: 'Yes' },
  { feature: 'ML-powered prediction', us: 'No', kolleno: 'Limited', yaypay: 'Yes' },
  { feature: 'Multi-currency', us: 'Via Stripe', kolleno: 'Yes', yaypay: 'Yes' },
  { feature: 'Team reconciliation', us: 'No', kolleno: 'Yes', yaypay: 'Yes' },
  { feature: 'Invoice volume limit', us: 'Unlimited', kolleno: 'Tiered', yaypay: 'Tiered' },
  { feature: 'Free trial', us: '3 days, no card', kolleno: 'Demo only', yaypay: 'Demo only' },
  { feature: 'Best for', us: 'Freelancers & agencies', kolleno: 'Mid-market finance teams', yaypay: 'Enterprise AR departments' },
];

function Cell({ value }: { value: string }) {
  if (value === 'Yes') return <Check className="w-4 h-4 text-emerald-600 mx-auto" />;
  if (value === 'No') return <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span>{value}</span>;
}

export default function VsEnterprise() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-[#585858] mb-4">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-6">
            mlforge Invoice vs Kolleno & YayPay
          </h1>
          <p className="text-lg text-[#585858] leading-relaxed max-w-3xl mb-4">
            Kolleno and YayPay (by Quadient) are enterprise-grade accounts receivable platforms designed for mid-to-large finance teams. They offer predictive analytics, team reconciliation workflows, and deep ERP integrations.
          </p>
          <p className="text-lg text-[#585858] leading-relaxed max-w-3xl mb-4">
            They are also <strong>wildly expensive</strong>. Kolleno starts at £650/user/month. YayPay doesn't publish pricing — you need a sales call and a multi-week implementation.
          </p>
          <p className="text-lg text-[#585858] leading-relaxed max-w-3xl mb-12">
            If you're a freelancer, a solo founder, or a small agency with a Stripe account and overdue invoices, you don't need an enterprise platform. <strong>You need mlforge Invoice for $9/mo.</strong>
          </p>

          <div className="rounded-2xl border border-[#E8E8E8] overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="px-5 py-4 text-sm font-bold text-[#131313]">Feature</th>
                  <th className="px-5 py-4 text-sm font-bold text-[#131313] text-center bg-[#f0fdf4]">mlforge Invoice</th>
                  <th className="px-5 py-4 text-sm font-bold text-[#585858] text-center">Kolleno</th>
                  <th className="px-5 py-4 text-sm font-bold text-[#585858] text-center">YayPay</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="px-5 py-3.5 text-sm text-[#131313] font-medium">{row.feature}</td>
                    <td className="px-5 py-3.5 text-sm text-center bg-[#f0fdf4]/50 font-semibold text-[#131313]">
                      <Cell value={row.us} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-center text-[#585858]">
                      <Cell value={row.kolleno} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-center text-[#585858]">
                      <Cell value={row.yaypay} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-[#131313] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">The right tool for the right job</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Kolleno and YayPay are built for finance departments with 10+ people processing thousands of invoices across multiple ERPs. If that's you, those tools make sense.
              <br /><br />
              But if you're a freelancer, contractor, or small agency that invoices through Stripe and needs automated follow-ups on overdue payments — spending £650/user/month is like renting a 747 to fly to the corner shop.
            </p>
            <ul className="space-y-2 text-white/80 text-sm leading-relaxed mb-6">
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> $9/mo flat — not £650/user/month</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> Live in 2 minutes — not weeks of implementation</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> No sales call required — just sign up</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> Read-only Stripe access — your money stays untouched</li>
            </ul>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#d6fd70] text-[#131313] font-bold px-6 py-3 rounded-full hover:bg-white transition-colors"
            >
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
