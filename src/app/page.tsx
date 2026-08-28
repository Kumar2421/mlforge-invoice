import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { About } from "@/components/landing/About";
import { Features } from "@/components/landing/Features";
import { Services } from "@/components/landing/Services";
import { Expertise } from "@/components/landing/Expertise";
import { SocialProof } from "@/components/landing/SocialProof";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Blog } from "@/components/landing/Blog";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "mlforge Invoice — Automated Payment Reminders for Overdue Invoices",
  description:
    "Get paid faster with automated, escalating payment reminders. Connects read-only to your Stripe and PayPal accounts. Flat $9/mo fee — no percentage cut of your collected revenue. 3-day free trial.",
  openGraph: {
    title: "mlforge Invoice — Automated Payment Reminders",
    description:
      "Escalating reminder emails for overdue invoices, connected read-only to your own Stripe and PayPal. Flat monthly fee, no percentage cut. Start your 3-day free trial.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <About />
      <Features />
      <Services />
      <Expertise />
      <SocialProof />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Blog />
      <CtaBanner />
      <Footer />

      {/* JSON-LD Structured Data for AI agent discoverability */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "mlforge Invoice",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Automated, escalating payment reminder emails for overdue invoices. Connects read-only to your Stripe account. Flat monthly fee with no percentage cut.",
            offers: [
              {
                "@type": "Offer",
                name: "Solo",
                price: "9.00",
                priceCurrency: "USD",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  billingDuration: "P1M",
                },
              },
              {
                "@type": "Offer",
                name: "Pro",
                price: "15.00",
                priceCurrency: "USD",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  billingDuration: "P1M",
                },
              },
            ],
            featureList: [
              "Read-only Stripe integration",
              "Automated escalating reminders (Day 3, 7, 14)",
              "Auto-stops on payment",
              "Custom sender identity",
              "Collection analytics dashboard",
              "Team workspaces (Pro)",
              "Custom cadence per client (Pro)",
            ],
            url: "https://invoice.mlforge.com",
          }),
        }}
      />

      {/* FAQPage schema for AI snippet eligibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: 'What does "read-only" mean? Can mlforge Invoice move my money?',
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. When you connect Stripe, you grant a restricted API key that can only read invoice and payment data. We cannot create charges, issue refunds, transfer funds, or modify anything in your Stripe account.",
                },
              },
              {
                "@type": "Question",
                name: "Why is there no percentage cut?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most AR automation tools charge 1-3% of every dollar collected. mlforge Invoice charges a flat $9 or $15/mo regardless of how much you collect. You keep every cent your clients pay you.",
                },
              },
              {
                "@type": "Question",
                name: "How does the 3-day free trial work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "When you sign up, your workspace gets a 3-day trial with full access to all features. No credit card required upfront. After 3 days, your dashboard is locked until you subscribe.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
