import { Reveal } from "@/components/ui/Reveal";

const audiences = [
  { who: "Freelancers", line: "Stop writing the awkward Friday follow-up email." },
  { who: "Agencies & studios", line: "Bookkeeper, owner, and PM share one reminder workspace." },
  { who: "Contractors", line: "Net-30 invoices that actually get paid near day 30." },
  { who: "Consultants", line: "Chase retainers and project invoices without chasing." },
  { who: "Landlords", line: "Rent invoices to tenants, escalating on their own." },
  { who: "Solo SaaS founders", line: "Manual B2B invoices followed up automatically." },
];

export function WhoItsFor() {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal delay={0} className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-[#131313]" />
            <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-[#131313]">
              Who it&apos;s for
            </span>
          </div>
          <h2 className="mb-4 max-w-2xl text-4xl font-bold leading-tight text-[#131313] md:text-5xl">
            Anyone who invoices and waits
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#585858]">
            The freelancer framing was a wedge, not a ceiling. If you send an invoice and
            wait to get paid, this is for you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.who} delay={(i + 1) * 70}>
              <div className="h-full rounded-2xl border border-[#E8E8E8] bg-[#FAFAFA] p-6">
                <h3 className="text-base font-bold text-[#131313]">{a.who}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#585858]">{a.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
