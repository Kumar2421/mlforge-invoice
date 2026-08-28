import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

const steps = [
  { icon: CreditCard, title: "1. Connect Stripe", detail: "Read-only access to invoices and payments." },
  { icon: ShieldCheck, title: "2. Set your sender", detail: "Choose the email identity clients will see." },
  { icon: CheckCircle2, title: "3. Activate reminders", detail: "Start sequences for overdue invoices." },
];

export default function OnboardingView({ onOpenSettings }: { onOpenSettings: () => void }) {
  return <main className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10"><section className="w-full max-w-2xl rounded-3xl border border-[#E6ECEA] bg-white p-8 shadow-sm"><span className="inline-flex rounded-full bg-[#EAF3F0] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0F5A68]">Get started</span><h2 className="mt-4 text-2xl font-black tracking-tight text-gray-900">Connect Stripe to start protecting overdue invoices.</h2><p className="mt-2 max-w-xl text-[12px] leading-relaxed text-gray-500">Payment Reminders reads your invoices and payments, sends escalating reminders only when an invoice is overdue, and stops as soon as it is paid.</p><div className="mt-7 grid gap-3 sm:grid-cols-3">{steps.map(({ icon: Icon, title, detail }) => <div className="rounded-2xl border border-[#EDF1EF] p-4" key={title}><Icon className="h-5 w-5 text-[#0F5A68]" /><p className="mt-4 text-[11px] font-black text-gray-800">{title}</p><p className="mt-1 text-[10px] leading-relaxed text-gray-400">{detail}</p></div>)}</div><button onClick={onOpenSettings} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#22C55E] px-4 py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-[#16A34A]">Connect Stripe <ArrowRight className="h-4 w-4" /></button></section></main>;
}
