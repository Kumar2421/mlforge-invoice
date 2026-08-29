"use client"

import Link from "next/link"
import { useState } from "react"
import { AtSign, MessageCircle, Share2, Globe, ArrowRight } from "lucide-react"
import { Footer } from "@/components/landing/Footer"
import { createClient } from "@/utils/supabase/client"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex w-full items-center justify-between border-b border-[#ececec] px-8 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#22C55E" />
            <path
              d="M9 18C9 14 12 10 18 9C17 13 15 16 11 18C10.5 18.3 9.5 18.3 9 18Z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
          <span className="font-sans text-base font-bold tracking-tight text-[#131313]">Payment Reminders</span>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          <Link href="/#how-it-works" className="text-sm font-medium text-[#131313]">
            How it works
          </Link>
          <Link href="/#features" className="text-sm font-medium text-[#131313]">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-[#131313]">
            Pricing
          </Link>
        </div>

        <Link
          href="/login"
          className="rounded-full bg-[#d6fd70] px-6 py-2.5 text-sm font-semibold text-[#131313] transition-all hover:scale-95 hover:bg-[#131313] hover:text-white"
        >
          Login
        </Link>
      </header>

      <section className="mx-3 mt-3 overflow-hidden rounded-[24px]">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">
          {/* Left panel */}
          <div className="flex flex-col gap-10 bg-[#f2f2f2] px-10 py-16">
            <div>
              <h1 className="text-4xl font-medium leading-tight text-[#131313]">Reach out today</h1>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-[#585858]">
                Questions about the reminder engine, pricing, or connecting your Stripe account &mdash; we read every message.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="text-sm text-[#585858]">Email:</p>
                <a href="mailto:hello@mlforge.in" className="text-lg font-medium text-[#131313]">
                  hello@mlforge.in
                </a>
              </div>

              <div>
                <p className="text-sm text-[#585858]">Support:</p>
                <p className="text-lg font-medium text-[#131313]">Mon&ndash;Fri, 9am&ndash;6pm</p>
              </div>

              {/* <div>
                <p className="text-sm text-[#585858]">Follow us:</p>
                <div className="mt-3 flex gap-3">
                  {[AtSign, MessageCircle, Share2, Globe].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#131313] text-white transition-transform hover:scale-95"
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </a>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Right panel: sky background + form card */}
          <div
            className="relative flex min-h-[640px] items-center justify-center overflow-hidden px-6 py-16"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 0%, #1c1c22 0%, #131313 55%, #0c0c0f 100%)",
            }}
          >

            <div className="relative z-10 w-full max-w-[480px] rounded-[20px] bg-white p-8 shadow-2xl">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10">
                    <ArrowRight className="h-5 w-5 -rotate-45 text-[#22C55E]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-medium text-[#131313]">Message sent</h3>
                  <p className="text-sm text-[#585858]">We&rsquo;ll get back to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#131313]">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-[#ececec] px-4 py-3 text-sm text-[#131313] outline-none transition-colors focus:border-[#22C55E]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#131313]">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Your email address"
                      className="w-full rounded-xl border border-[#ececec] px-4 py-3 text-sm text-[#131313] outline-none transition-colors focus:border-[#22C55E]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#131313]">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full resize-none rounded-xl border border-[#ececec] px-4 py-3 text-sm text-[#131313] outline-none transition-colors focus:border-[#22C55E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#131313] px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-95 hover:bg-[#2a2a2a] disabled:opacity-50"
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6fd70]">
                      <ArrowRight className="h-3 w-3 -rotate-45 text-[#131313]" strokeWidth={2.5} />
                    </div>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
