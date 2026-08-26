import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Pricing",
  description: "Simple, flat monthly pricing. No percentage cut of your invoices.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <Pricing />
      </div>
      <CtaBanner />
      <Footer />
    </main>
  );
}
