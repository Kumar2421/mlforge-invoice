import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | mlforge Invoice",
    default: "Payment Reminders - Get Paid, Automatically | mlforge Invoice",
  },
  description:
    "Get paid faster. Automated, escalating payment reminders for anyone who invoices and waits, connected read-only to your own Stripe. Flat monthly fee, no percentage cut.",
  openGraph: {
    title: "mlforge Invoice - Automated Payment Reminders",
    description: "Get paid faster with automated, escalating payment reminders. Connects to your Stripe.",
    url: "https://invoice.mlforge.com", // Placeholder URL
    siteName: "mlforge Invoice",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "mlforge Invoice - Automated Payment Reminders",
    description: "Get paid faster with automated, escalating payment reminders. Connects to your Stripe.",
  },
  metadataBase: new URL("https://invoice.mlforge.com"), // Placeholder URL
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
