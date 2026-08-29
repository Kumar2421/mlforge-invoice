import { SITE, SITE_URL, MARKETING_ROUTES } from "@/lib/site";

// https://llmstxt.org/ — a concise, plain-text product summary for AI agents and
// answer engines. Served at /llms.txt.

export const dynamic = "force-static";

export function GET() {
  const pages = MARKETING_ROUTES.filter((r) => r.path !== "/")
    .map((r) => `- [${r.title}](${SITE_URL}${r.path})`)
    .join("\n");

  const pricing = SITE.pricing
    .map((p) => `- **${p.name}** — $${p.price}/${p.period}: ${p.summary}`)
    .join("\n");

  const body = `# ${SITE.name}

> ${SITE.description}

## What it is

${SITE.name} ("${SITE.shortName}") is a focused SaaS tool that automates chasing
overdue invoices. It does one job: the moment an invoice passes its due date, it
sends a sequence of escalating reminder emails (Day 3, Day 7, Day 14 — each firmer
than the last) and stops immediately when the invoice is paid.

## What it deliberately does NOT do

- It never creates invoices — it is not an invoicing or accounting tool.
- It never moves money and never takes a percentage of what you collect.
- It connects to Stripe with a read-only restricted key. It cannot create charges,
  issue refunds, or transfer funds.

## Who it is for

Anyone who sends invoices and gets paid late: freelancers, agencies, contractors,
consultants, solo SaaS founders, and small businesses. Stripe-connected today;
PayPal and manual invoice tracking on the roadmap.

## How it works

1. Connect Stripe (read-only restricted key) — under two minutes.
2. ${SITE.name} watches your invoices for overdue status.
3. When an invoice is overdue, an escalating reminder sequence begins automatically.
4. Reminders are sent from your own sender identity (your name, your email).
5. When Stripe confirms payment, every remaining reminder for that invoice stops.

## Pricing

Flat monthly fee. No percentage cut of collected payments.

${pricing}

3-day free trial, no credit card required.

## Positioning vs alternatives

Most accounts-receivable automation tools either (a) charge 1–3% of every dollar
collected, or (b) require full accounting-software integration and cost $50+/month.
${SITE.name} is a flat-fee, Stripe-native, read-only alternative for people who
just need the reminder loop.

## Key pages

${pages}

## Links

- Homepage: ${SITE_URL}
- Pricing: ${SITE_URL}/pricing
- Sign up / free trial: ${SITE_URL}/login
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
