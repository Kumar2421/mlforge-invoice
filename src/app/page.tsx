import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { About } from "@/components/landing/About";
import { ReminderPreview } from "@/components/landing/ReminderPreview";
import { Features } from "@/components/landing/Features";
import { Services } from "@/components/landing/Services";
import { WhoItsFor } from "@/components/landing/WhoItsFor";
import { Expertise } from "@/components/landing/Expertise";
import { SocialProof } from "@/components/landing/SocialProof";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Blog } from "@/components/landing/Blog";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "mlforge Invoice — Automated Payment Reminders for Overdue Invoices",
  description:
    "Get paid faster with automated, escalating payment reminders. Connects read-only to your Stripe. Flat $9/mo fee — no percentage cut of your collected revenue. 3-day free trial.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "mlforge Invoice — Automated Payment Reminders",
    description:
      "Escalating reminder emails for overdue invoices, connected read-only to your own Stripe. Flat monthly fee, no percentage cut.",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <About />
      <ReminderPreview />
      <Features />
      <Services />
      <WhoItsFor />
      <Expertise />
      <SocialProof />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Blog />
      <CtaBanner />
      <Footer />

      {/* SoftwareApplication + Organization + WebSite JSON-LD lives in app/layout.tsx (site-wide). */}

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
                name: "How does the free trial work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "When you sign up, your workspace gets a 3-day trial with full access to all features. No credit card required upfront. After 3 days, your dashboard is locked until you subscribe to the Solo ($9/mo) or Pro ($15/mo) plan.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
