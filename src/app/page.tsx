import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Expertise } from "@/components/landing/Expertise";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { Blog } from "@/components/landing/Blog";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <About />
      <Services />
      <Expertise />
      <Pricing />
      <Testimonials />
      <Blog />
      <CtaBanner />
      <Footer />
    </main>
  );
}
