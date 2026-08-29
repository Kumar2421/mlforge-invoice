/**
 * Single source of truth for the public site URL and product metadata.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment (Netlify: Site settings → Env vars)
 * to the production domain, e.g. https://invoice.mlforge.com — every SEO surface
 * (sitemap, robots, canonical, OG, JSON-LD, llms.txt) reads from here.
 */

const RAW_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL || // Netlify injects this
  "https://invoice.mlforge.com";

export const SITE_URL = RAW_URL.replace(/\/$/, "");

export const SITE = {
  name: "mlforge Invoice",
  shortName: "Payment Reminders",
  tagline: "Get paid faster, automatically.",
  description:
    "Automated, escalating payment reminders for overdue invoices. Connect read-only to your Stripe, and mlforge Invoice sends Day 3 / 7 / 14 reminder emails that stop the moment the invoice is paid. Flat monthly fee, no percentage cut, never moves your money.",
  url: SITE_URL,
  ogImage: `${SITE_URL}/opengraph-image`,
  twitter: "@mlforge",
  contactEmail: "hello@mlforge.com",
  pricing: [
    { name: "Solo", price: 9, period: "month", summary: "1 Stripe account, unlimited reminders, default 3-stage cadence." },
    { name: "Pro", price: 15, period: "month", summary: "Everything in Solo, plus PayPal, custom cadence per client, and team members." },
  ],
} as const;

/** Static, indexable marketing routes — consumed by sitemap.ts and llms.txt. */
export const MARKETING_ROUTES: { path: string; changeFrequency: "weekly" | "monthly"; priority: number; title: string }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0, title: "Get paid faster, automatically" },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9, title: "Pricing — flat fee, no percentage cut" },
  { path: "/about", changeFrequency: "monthly", priority: 0.6, title: "About mlforge Invoice" },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7, title: "Blog — getting paid faster" },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4, title: "Contact" },
  { path: "/compare/vs-chaser", changeFrequency: "monthly", priority: 0.8, title: "mlforge Invoice vs Chaser" },
  { path: "/compare/vs-invoicesherpa", changeFrequency: "monthly", priority: 0.8, title: "mlforge Invoice vs InvoiceSherpa" },
  { path: "/compare/vs-enterprise", changeFrequency: "monthly", priority: 0.8, title: "mlforge Invoice vs Kolleno & YayPay" },
  { path: "/compare/no-percentage-cut", changeFrequency: "monthly", priority: 0.8, title: "Invoice reminders without a percentage cut" },
];
