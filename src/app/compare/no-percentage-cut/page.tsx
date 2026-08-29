import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Invoice Reminders Without a Percentage Cut — mlforge Invoice",
  description:
    "Most accounts-receivable tools take 1–3% of every payment they help you collect. mlforge Invoice charges a flat $9/mo and never touches your money. See the real cost difference.",
  alternates: { canonical: `${SITE_URL}/compare/no-percentage-cut` },
};

const costRows = [
  { collected: "$2,000 / mo", flat: "$9", pct2: "$40", pct3: "$60" },
  { collected: "$10,000 / mo", flat: "$9", pct2: "$200", pct3: "$300" },
  { collected: "$25,000 / mo", flat: "$9", pct2: "$500", pct3: "$750" },
  { collected: "$50,000 / mo", flat: "$9", pct2: "$1,000", pct3: "$1,500" },
];

const featureRows: { feature: string; flat: string | boolean; pct: string | boolean }[] = [
  { feature: "Monthly cost", flat: "$9 flat (or $15 Pro)", pct: "1–3% of collected revenue" },
  { feature: "Cost scales with your revenue", flat: false, pct: true },
  { feature: "Cost is predictable", flat: true, pct: false },
  { feature: "Takes a cut of your money", flat: false, pct: true },
  { feature: "Connection type", flat: "Read-only restricted key", pct: "Often full API / bank access" },
  { feature: "Sends escalating reminders", flat: true, pct: true },
  { feature: "Auto-stops when invoice is paid", flat: true, pct: true },
  { feature: "You keep 100% of what clients pay", flat: true, pct: false },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean")
    return value ? (
      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
    ) : (
      <X className="w-4 h-4 text-gray-300 mx-auto" />
    );
  return <span>{value}</span>;
}

export default function NoPercentageCut() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-[#585858] mb-4">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-6">
            Invoice reminders without a percentage cut
          </h1>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-4">
            Many popular accounts-receivable automation tools charge a percentage of every
            dollar they help you collect — typically 1% to 3% per invoice. For sending
            reminder emails.
          </p>
          <p className="text-lg text-[#585858] leading-relaxed max-w-2xl mb-12">
            <strong>mlforge Invoice charges a flat monthly fee.</strong> $9/mo on Solo,
            $15/mo on Pro. It connects to Stripe with a read-only key, so it{" "}
            <em>cannot</em> move your money even if it wanted to. Whether you collect
            $2,000 or $50,000 this month, you pay the same $9 — and you keep every cent
            your clients pay you.
          </p>

          <h2 className="text-2xl font-bold text-[#131313] mb-4">What a percentage cut actually costs</h2>
          <div className="rounded-2xl border border-[#E8E8E8] overflow-hidden mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="px-5 py-4 text-sm font-bold text-[#131313]">You collect</th>
                  <th className="px-5 py-4 text-sm font-bold text-[#131313] text-center bg-[#f0fdf4]">
                    mlforge Invoice (flat)
                  </th>
                  <th className="px-5 py-4 text-sm font-bold text-[#585858] text-center">A 2% tool</th>
                  <th className="px-5 py-4 text-sm font-bold text-[#585858] text-center">A 3% tool</th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row, i) => (
                  <tr key={i} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="px-5 py-3.5 text-sm text-[#131313] font-medium">{row.collected}</td>
                    <td className="px-5 py-3.5 text-sm text-center bg-[#f0fdf4]/50 font-semibold text-[#131313]">
                      {row.flat}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-center text-[#585858]">{row.pct2}</td>
                    <td className="px-5 py-3.5 text-sm text-center text-[#585858]">{row.pct3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-[#131313] mb-4">Flat fee vs percentage cut</h2>
          <div className="rounded-2xl border border-[#E8E8E8] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <th className="px-6 py-4 text-sm font-bold text-[#131313]">Feature</th>
                  <th className="px-6 py-4 text-sm font-bold text-[#131313] text-center bg-[#f0fdf4]">
                    Flat fee (mlforge Invoice)
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-[#585858] text-center">
                    Percentage-cut tools
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr key={i} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="px-6 py-3.5 text-sm text-[#131313] font-medium">{row.feature}</td>
                    <td className="px-6 py-3.5 text-sm text-center bg-[#f0fdf4]/50 font-semibold text-[#131313]">
                      <Cell value={row.flat} />
                    </td>
                    <td className="px-6 py-3.5 text-sm text-center text-[#585858]">
                      <Cell value={row.pct} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-[#131313] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">When a flat fee makes sense</h2>
            <ul className="space-y-2 text-white/80 text-sm leading-relaxed mb-6">
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You collect more than
                ~$500/mo in invoices (the break-even against a 2% tool)
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You want a predictable
                cost that does not grow as you do
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You do not want a tool
                with write access to your payment account
              </li>
              <li className="flex gap-2">
                <Check className="w-4 h-4 text-[#d6fd70] shrink-0 mt-0.5" /> You just need the
                reminder loop, not a full AR platform
              </li>
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
