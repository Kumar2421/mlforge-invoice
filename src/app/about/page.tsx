import { Navbar } from "@/components/landing/Navbar";
import { About } from "@/components/landing/About";
import { Expertise } from "@/components/landing/Expertise";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "About Us",
  description: "Learn more about mlforge Invoice and our mission to help you get paid faster.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <About />
        <Expertise />
      </div>
      <CtaBanner />
      <Footer />
    </main>
  );
}
