import { Reveal } from "@/components/ui/Reveal";

const stages = [
  {
    day: "Day 3",
    tone: "Gentle",
    toneClass: "bg-amber-50 text-amber-700 border-amber-200",
    subject: "Friendly reminder: invoice #1043 is overdue",
    body: "Hi Dana, hope all's well. Just a gentle reminder that invoice #1043 for $2,400 is now past its due date. If it's already on the way, thank you — please ignore this.",
  },
  {
    day: "Day 7",
    tone: "Firm",
    toneClass: "bg-orange-50 text-orange-700 border-orange-200",
    subject: "Payment overdue: invoice #1043 ($2,400)",
    body: "Hi Dana, invoice #1043 for $2,400 is now a week overdue. Please arrange payment at your earliest convenience. If there's a problem with the invoice, just reply here.",
  },
  {
    day: "Day 14",
    tone: "Final",
    toneClass: "bg-red-50 text-red-700 border-red-200",
    subject: "Final notice: invoice #1043 is 14 days overdue",
    body: "Hi Dana, this is a final reminder that invoice #1043 for $2,400 is now two weeks overdue. Please settle it promptly to avoid further follow-up.",
  },
];

export function ReminderPreview() {
  return (
    <section className="w-full bg-[#FAFAFA] py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal delay={0} className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-[#131313]" />
            <span className="font-mono text-sm font-medium uppercase tracking-[1.92px] text-[#131313]">
              What clients receive
            </span>
          </div>
          <h2 className="mb-4 max-w-2xl text-4xl font-bold leading-tight text-[#131313] md:text-5xl">
            Three emails. Firmer each time. Then it stops.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#585858]">
            Every reminder goes out from your name and address, with your text. The moment
            Stripe confirms payment, the rest of the sequence is cancelled.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stages.map((stage, i) => (
            <Reveal key={stage.day} delay={(i + 1) * 90}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white">
                <div className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-3">
                  <span className="text-sm font-bold text-[#131313]">{stage.day}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${stage.toneClass}`}>
                    {stage.tone}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="text-[11px] font-medium text-[#9a9a9a]">
                    From: Acme Studio &lt;billing@acme.com&gt;
                  </div>
                  <div className="text-sm font-bold leading-snug text-[#131313]">{stage.subject}</div>
                  <p className="text-sm leading-relaxed text-[#585858]">{stage.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360} className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#22C55E]">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
          Invoice #1043 paid on Day 9 → Day 14 reminder never sent
        </Reveal>
      </div>
    </section>
  );
}
