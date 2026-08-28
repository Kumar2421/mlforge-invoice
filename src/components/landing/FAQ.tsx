'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

const faqs = [
  {
    question: 'What does "read-only" mean? Can mlforge Invoice move my money?',
    answer: 'No. When you connect Stripe, you grant a restricted API key that can only read invoice and payment data. We cannot create charges, issue refunds, transfer funds, or modify anything in your Stripe account. This is enforced at the Stripe API level — we literally cannot call those endpoints.',
  },
  {
    question: 'How does the 3-day free trial work?',
    answer: 'When you sign up, your workspace gets a 3-day trial with full access to all features. No credit card required upfront. After 3 days, your dashboard is locked until you subscribe to the Solo ($9/mo) or Pro ($15/mo) plan. Your data is preserved — nothing is deleted.',
  },
  {
    question: 'What happens when my client pays their invoice?',
    answer: 'The moment Stripe confirms payment (via a webhook event), mlforge Invoice automatically stops every active reminder in the sequence for that invoice. Your client will never receive a "please pay" email after they have already paid.',
  },
  {
    question: 'Why is there no percentage cut?',
    answer: 'Most AR automation tools charge 1-3% of every dollar collected. On a $10,000 invoice, that is $100-$300 per invoice — just for sending reminder emails. We believe that is unreasonable. mlforge Invoice charges a flat $9 or $15/mo regardless of how much you collect. You keep every cent your clients pay you.',
  },
  {
    question: 'Can I customize the reminder emails?',
    answer: 'Yes. You control the sender name, sender email address, and reply-to address from your Settings panel. Clients see your brand, not ours. Custom email copy per stage is on our roadmap for a near-term release.',
  },
  {
    question: 'What is the default reminder cadence?',
    answer: 'The default escalation sequence is Day 3, Day 7, and Day 14 after the invoice due date. On the Pro plan, you can customize these intervals per client — for example, giving a long-standing client a gentler schedule.',
  },
  {
    question: 'Do you support payment processors other than Stripe?',
    answer: 'PayPal read-only integration is available on the Pro plan. We plan to support Square, QuickBooks, and direct bank reconciliation in future updates.',
  },
  {
    question: 'Is mlforge Invoice CAN-SPAM and GDPR compliant?',
    answer: 'Yes. Every reminder email includes a one-click unsubscribe link and our physical mailing address, as required by CAN-SPAM (US) and ePrivacy (EU) regulations. Clients can opt out of reminders at any time, and their preference is respected immediately.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E8E8E8] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left"
      >
        <span className="text-base font-semibold text-[#131313] pr-8">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#585858] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
      >
        <p className="text-sm text-[#585858] leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="w-full bg-white py-24">
      <div className="mx-auto px-8 max-w-3xl">
        <Reveal delay={0} className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-1 rounded-full bg-[#131313]"></div>
            <span className="text-sm font-medium tracking-[1.92px] uppercase font-mono text-[#131313]">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-6">
            Common questions
          </h2>
          <p className="text-base text-[#585858] leading-relaxed">
            Everything you need to know about mlforge Invoice.
          </p>
        </Reveal>

        <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden px-8">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 50}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
