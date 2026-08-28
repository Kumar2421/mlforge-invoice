import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | mlforge Invoice',
  description: 'Terms of Service for mlforge Invoice payment reminder platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-[#585858] mb-4">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-12">
            Terms of Service
          </h1>

          <div className="prose prose-lg text-[#585858]">
            <p>Last updated: August 28, 2026</p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the mlforge Invoice platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">2. Description of Service</h2>
            <p>
              mlforge Invoice provides an automated payment reminder service that connects to third-party payment processors like Stripe and PayPal in a read-only capacity. We do not move money, create invoices, or modify your accounting data.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the security of your account and any API keys you connect to our service. You agree not to use the service for any illegal or unauthorized purpose.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">4. Payment and Billing</h2>
            <p>
              We offer a 3-day free trial. After the trial, you must subscribe to a paid plan to continue using the service. We charge a flat monthly fee and do not take a percentage of your collected invoices.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">5. Limitation of Liability</h2>
            <p>
              mlforge Invoice shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
