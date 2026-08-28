import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mlforge Invoice vs Chaser — Payment Reminder Comparison',
  description:
    'Compare mlforge Invoice and Chaser for automated payment reminders. See pricing, features, and why freelancers choose mlforge Invoice over Chaser for Stripe-connected invoice follow-ups.',
};

const rows = [
  { feature: 'Starting price', us: '$9/mo flat', them: '~$50/mo (tiered)' },
  { feature: 'Percentage cut', us: '0% — never', them: 'None (but higher base cost)' },
  { feature: 'Setup time', us: '< 2 minutes', them: '~30 minutes' },
  { feature: 'Stripe integration', us: 'Read-only restricted key', them: 'Full API access required' },
  { feature: 'Auto-stop on payment', us: true, them: true },
  { feature: 'Custom escalation cadence', us: 'Pro plan ($15/mo)', them: 'All plans' },
  { feature: 'Team workspaces', us: 'Pro plan', them: 'Higher tiers' },
  { feature: 'QuickBooks / Xero sync', us: 'Roadmap', them: true },
  { feature: 'Credit checking', us: false, them: true },
  { feature: 'Payment portal', us: false, them: true },
  { feature: 'Free trial', us: '3 days, no card', them: '14 days' },
  { feature: 'Target user', us: 'Freelancers & small agencies on Stripe', them: 'SMBs using accounting software' },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean')
    return value ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span>{value}</span>;
}

export default function VsChaser() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-[#585858] mb-4">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-6">
            mlforge Invoice vs Chaser
          </h1>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-4">
            Chaser is a powerful accounts receivable platform built for businesses that manage invoicing through Xero or QuickBooks. It offers credit checking, a customer payment portal, and deep accounting integrations.
          </p>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-12">
            <strong>mlforge Invoice is different.</strong> It's purpose-built for freelancers, contractors, and small agencies who invoice through Stripe and just need one thing: automated reminder emails that stop the moment they get paid. No accounting software required, no complex setup, and no percentage cut.
          </p>

          <div className="rounded-2xl border border-[#E8E8E8] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="px-6 py-4 text-sm font-bold text-[#131313]">Feature</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#131313] text-center bg-[#f0fdf4]">mlforge Invoice</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#585858] text-center">Chaser</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="px-6 py-3.5 text-sm text-[#131313] font-medium">{row.feature}</td>
                    <td className="px-6 py-3.5 text-sm text-center bg-[#f0fdf4]/50 font-semibold text-[#131313]">
                      <Cell value={row.us} />
                    </td>
                    <td className="px-6 py-3.5 text-sm text-center text-[#585858]">
                      <Cell value={row.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-[#131313] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">When to choose mlforge Invoice over Chaser</h2>
            <ul className="space-y-2 text-white/80 text-sm leading-relaxed mb-6">
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You invoice through Stripe and don't use Xero or QuickBooks</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You want to pay $9/mo instead of $50+/mo</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You want read-only access that never touches your money</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You want to be live in under 2 minutes, not 30</li>
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
