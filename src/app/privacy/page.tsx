import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | mlforge Invoice',
  description: 'Privacy Policy for mlforge Invoice payment reminder platform.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-mono uppercase tracking-widest text-[#585858] mb-4">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#131313] leading-tight mb-12">
            Privacy Policy
          </h1>

          <div className="prose prose-lg text-[#585858]">
            <p>Last updated: August 28, 2026</p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, such as your name, email address, and payment information. We also collect data from your connected payment processors (e.g., Stripe, PayPal) strictly for the purpose of sending invoice reminders.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and improve our services, including sending automated payment reminders on your behalf, providing customer support, and monitoring the usage of our service.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share your information with third-party service providers (such as hosting and email delivery services) that perform services on our behalf, subject to confidentiality agreements.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. Our access to your payment processors is strictly read-only, ensuring we cannot move funds or modify your core financial data.
            </p>

            <h2 className="text-2xl font-bold text-[#131313] mt-10 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at hello@mlforge.in 
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
