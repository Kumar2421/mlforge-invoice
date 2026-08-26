"use client"

import { CheckCircle2, TrendingUp } from "lucide-react"
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal'

export function Hero() {
  const cards = [
    <div key="c1" className="flex h-full w-full flex-col justify-between bg-white p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-medium text-[#585858]">Collection rate</p>
        <TrendingUp className="h-3.5 w-3.5 text-[#22C55E]" strokeWidth={2} />
      </div>
      <div>
        <span className="text-[28px] font-black leading-none text-[#131313]">84%</span>
        <p className="mt-1 text-[9px] text-[#585858]">of invoices paid on time</p>
      </div>
    </div>,
    <div key="c2" className="flex h-full w-full flex-col justify-between bg-[#131313] p-4 text-white">
      <p className="text-[10px] font-medium text-white/60">Reminders sent</p>
      <div>
        <span className="text-[28px] font-black leading-none text-white">42</span>
        <p className="mt-1 text-[9px] font-semibold text-[#22C55E]">$18,200 collected</p>
      </div>
    </div>,
    <div key="c3" className="flex h-full w-full flex-col justify-center gap-2 bg-white p-4 text-center">
      <p className="text-[9px] font-medium text-[#585858]">Reminder sequence</p>
      <div className="flex items-center justify-center gap-1">
        <span className="h-2 w-2 rounded-full bg-[#131313]" />
        <span className="h-px w-3 bg-gray-300" />
        <span className="h-2 w-2 rounded-full bg-[#131313]" />
        <span className="h-px w-3 bg-gray-300" />
        <span className="h-2 w-2 rounded-full border-2 border-[#22C55E]" />
      </div>
      <p className="text-[10px] font-semibold text-[#131313]">Day 3 &rarr; 7 &rarr; 14</p>
    </div>,
    <div key="c4" className="flex h-full w-full flex-col items-center justify-center gap-2 bg-white p-4 text-center">
      <span className="text-[30px] font-black leading-none text-[#2563EB]">$730</span>
      <p className="text-[9px] font-semibold text-[#585858]">Andi Permana &middot; outstanding</p>
    </div>,
    <div key="c5" className="flex h-full w-full flex-col justify-between bg-white p-4">
      <p className="text-[10px] font-medium text-[#585858]">Days to pay</p>
      <div>
        <span className="text-[28px] font-black leading-none text-[#2563EB]">9</span>
        <p className="mt-1 text-[9px] text-[#585858]">down from 21</p>
      </div>
    </div>,
    <div key="c6" className="flex h-full w-full flex-col items-center justify-center gap-1 bg-white p-4 text-center">
      <span className="text-[30px] font-black leading-none text-[#22C55E]">$9</span>
      <p className="text-[9px] font-semibold text-[#585858]">flat fee, no cut</p>
    </div>,
    <div key="c7" className="flex h-full w-full flex-col justify-center gap-2 bg-white p-4">
      <p className="text-[9px] font-medium text-[#585858]">Collection rate</p>
      <div className="flex items-end gap-1">
        <div className="h-4 w-2.5 rounded-sm bg-[#2563EB]/25" />
        <div className="h-6 w-2.5 rounded-sm bg-[#2563EB]/45" />
        <div className="h-8 w-2.5 rounded-sm bg-[#2563EB]/70" />
        <div className="h-10 w-2.5 rounded-sm bg-[#2563EB]" />
      </div>
    </div>,
    <div key="c8" className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#131313] p-4 text-center">
      <span className="text-[30px] font-black leading-none text-white">0%</span>
      <p className="text-[9px] font-semibold text-white/60">percentage cut, ever</p>
    </div>,
    <div key="c9" className="flex h-full w-full flex-col items-center justify-center gap-1 bg-white p-4 text-center">
      <span className="text-[30px] font-black leading-none text-[#22C55E]">72%</span>
      <p className="text-[9px] font-semibold text-[#585858]">client on-time rate</p>
    </div>,
  ]

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-clip"
      style={{
        minHeight: "866px", // Reduced by 10px from 876px
        fontSize: "16px",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        lineHeight: "22.4px",
        letterSpacing: "-0.32px",
        borderRadius: "24px",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin3d {
          0% { transform: rotateX(12deg) rotateY(0deg); }
          100% { transform: rotateX(12deg) rotateY(-360deg); }
        }
        .animate-spin-3d {
          animation: spin3d 25s linear infinite;
          transform-style: preserve-3d;
        }
      `}} />

      <img
        src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6929d3408e9ff6a515b9eee8_ai-hero--1-.avif"
        alt="Hero background"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          zIndex: 0,
        }}
      />

      <div
        className="relative z-20 flex flex-col items-center justify-center w-full px-4"
        style={{
          maxWidth: "665px",
          minHeight: "454px",
          paddingTop: "118px",
          paddingBottom: "38px",
        }}
      >
        <div className="w-full">
          <div
            className="flex flex-col items-center justify-center w-full"
            style={{
              maxWidth: "561px",
              margin: "0 auto",
            }}
          >
            <h1
              className="w-full text-center font-bold tracking-tight text-white text-4xl sm:text-5xl md:text-[64px]"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                lineHeight: "1.15",
                letterSpacing: "-2px",
              }}
            >
              <Reveal delay={700} triggerOnMount>
                <div>Get paid faster,</div>
              </Reveal>
              <Reveal delay={780} triggerOnMount>
                <div style={{ opacity: 0.73 }}>automatically</div>
              </Reveal>
            </h1>

            <div style={{ height: "24px" }} />

            <Reveal delay={860} triggerOnMount>
              <div
                className="text-center mx-auto text-white/90 text-sm sm:text-base"
                style={{
                  fontWeight: 400,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: "1.5",
                  letterSpacing: "-0.2px",
                  maxWidth: "580px",
                }}
              >
                Escalating reminder emails for overdue invoices, connected read-only to your own Stripe. Flat monthly fee, no percentage cut.
              </div>
            </Reveal>

            <div style={{ height: "32px" }} />

            <Reveal delay={940} triggerOnMount>
              <div
                className="flex flex-wrap gap-3 justify-center items-center"
              >
                <button
                  className="rounded-full px-6 py-3 text-sm font-medium hover:bg-white/10 hover:scale-95 transition-all duration-300"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgb(255, 255, 255)",
                    backgroundColor: "transparent",
                    border: "2.5px solid rgb(255, 255, 255)",
                    cursor: "pointer",
                  }}
                >
                  SEE PRICING
                </button>

                <button
                  className="rounded-full pl-6 pr-2.5 py-2.5 text-sm font-bold flex items-center gap-3 bg-[#d6fd70] text-[#131313] hover:bg-white hover:scale-95 transition-all duration-300"
                  style={{
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  GET STARTED
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#131313] text-white">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ transform: "rotate(-45deg)" }}
                    >
                      <path
                        d="M2 8H14M14 8L8 2M14 8L8 14"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* 3D Spinning Cylinder Card Layout */}
      <Reveal delay={1050} triggerOnMount className="relative z-20 -mt-2 w-full flex justify-center items-center h-[280px]" style={{ perspective: "1500px" }}>
        <div
          className="relative flex justify-center items-center w-full animate-spin-3d scale-[0.55] xs:scale-75 sm:scale-100"
          style={{
            transformStyle: "preserve-3d",
            height: "200px",
          }}
        >
          {cards.map((card, index) => {
            const angle = index * 40; // 9 cards spaced 40 degrees apart

            return (
              <div
                key={index}
                className="absolute overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer border border-white/20"
                style={{
                  width: "135px",
                  height: "135px",
                  transform: `rotateY(${angle}deg) translateZ(280px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                {card}
              </div>
            )
          })}
        </div>
      </Reveal>

      <Reveal delay={1150} triggerOnMount>
        <div
          className="relative z-20 mt-20 flex flex-col items-center gap-2 text-center"
          style={{
            color: "rgb(255, 255, 255)",
            fontSize: "14px",
            fontWeight: 400,
            letterSpacing: "-0.28px",
          }}
        >
          <div className="flex gap-1.5">
            <CheckCircle2 size={16} style={{ color: "rgb(214, 253, 112)" }} />
          </div>
          <div>Never moves money. Never creates invoices. Read-only, always.</div>
        </div>
      </Reveal>
    </section>
  )
}

