import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mlforge Invoice vs InvoiceSherpa — Payment Reminder Comparison',
  description:
    'Compare mlforge Invoice and InvoiceSherpa for automated invoice reminders. See pricing differences, transaction fees, and why Stripe-first businesses choose mlforge Invoice.',
};

const rows = [
  { feature: 'Starting price', us: '$9/mo flat', them: '~$41/mo' },
  { feature: 'Transaction fee', us: '0% — never', them: '1% per invoice (waivable)' },
  { feature: 'Setup time', us: '< 2 minutes', them: '~10 minutes' },
  { feature: 'Stripe integration', us: 'Read-only restricted key', them: 'Full API access' },
  { feature: 'Auto-stop on payment', us: true, them: true },
  { feature: 'Custom escalation cadence', us: 'Pro plan ($15/mo)', them: 'All plans' },
  { feature: 'Recurring billing', us: false, them: true },
  { feature: 'Payment plans', us: false, them: true },
  { feature: 'QuickBooks integration', us: 'Roadmap', them: true },
  { feature: 'Team workspaces', us: 'Pro plan', them: 'Enterprise plan' },
  { feature: 'Free trial', us: '3 days, no card', them: '14 days' },
  { feature: 'Target user', us: 'Freelancers & agencies on Stripe', them: 'Small service businesses' },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean')
    return value ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span>{value}</span>;
}

export default function VsInvoiceSherpa() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-[#585858] mb-4">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-6">
            mlforge Invoice vs InvoiceSherpa
          </h1>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-4">
            InvoiceSherpa is a popular automation tool for sending invoice reminders, managing recurring billing, and offering payment plans. It integrates with QuickBooks and FreshBooks and is popular with small service businesses.
          </p>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-4">
            The catch? InvoiceSherpa charges a <strong>1% transaction fee on every invoice</strong> you process through them. On a $5,000 invoice, that's $50 — just for sending a reminder email. Over a year of invoicing, those fees add up fast.
          </p>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-12">
            <strong>mlforge Invoice charges $9/mo flat.</strong> No transaction fees, no percentage cuts. Whether you collect $500 or $50,000 in a month, you pay the same.
          </p>

          <div className="rounded-2xl border border-[#E8E8E8] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="px-6 py-4 text-sm font-bold text-[#131313]">Feature</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#131313] text-center bg-[#f0fdf4]">mlforge Invoice</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#585858] text-center">InvoiceSherpa</th>
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

          {/* Cost comparison callout */}
          <div className="mt-8 bg-[#FAFAFA] border border-[#E8E8E8] rounded-2xl p-8">
            <h3 className="text-lg font-bold text-[#131313] mb-4">Real cost comparison</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-[#E8E8E8]">
                <p className="text-sm font-bold text-[#131313] mb-2">Freelancer invoicing $10,000/mo</p>
                <div className="space-y-1.5 text-sm text-[#585858]">
                  <p>InvoiceSherpa: $41/mo + 1% = <strong className="text-rose-600">$141/mo</strong></p>
                  <p>mlforge Invoice: <strong className="text-emerald-600">$9/mo flat</strong></p>
                  <p className="text-xs text-[#22C55E] font-bold mt-2">You save $1,584/year</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#E8E8E8]">
                <p className="text-sm font-bold text-[#131313] mb-2">Agency invoicing $50,000/mo</p>
                <div className="space-y-1.5 text-sm text-[#585858]">
                  <p>InvoiceSherpa: $83/mo + 1% = <strong className="text-rose-600">$583/mo</strong></p>
                  <p>mlforge Invoice: <strong className="text-emerald-600">$15/mo flat (Pro)</strong></p>
                  <p className="text-xs text-[#22C55E] font-bold mt-2">You save $6,816/year</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#131313] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">When to choose mlforge Invoice over InvoiceSherpa</h2>
            <ul className="space-y-2 text-white/80 text-sm leading-relaxed mb-6">
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You don't want to pay a percentage of your revenue for reminder emails</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You use Stripe as your primary invoicing platform</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You want a tool that never touches or moves your money</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You don't need recurring billing or payment plans (just reminders)</li>
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
