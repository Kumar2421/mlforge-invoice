"use client"

import { Star } from "lucide-react"
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal'

export function Hero() {
  const cardImages = [
    "69a5007e9793bec9aef0bae6_card.avif",
    "69a5007db9ab99a268357410_card-3.avif",
    "69a5007d21f950db130e28c9_card-6.avif",
    "69a5007eb87553c5aa32934f_card-1.avif",
    "69a5007e27ef20e6e3edd02e_card-4.avif",
    "69a5007e9468539ba66cdd61_card-7.avif",
    "69a5007dd38878bbefc784aa_card-8.avif",
    "69a5007d920bdd6882dc8eb7_card-2.avif",
    "69a5007d1354bb8698409c38_card-5.avif",
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
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 35s linear infinite;
        }
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
                <div>Building the future with</div>
              </Reveal>
              <Reveal delay={780} triggerOnMount>
                <div style={{ opacity: 0.73 }}>AI and strategy</div>
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
                We help organizations unlock growth and efficiency through data-driven consulting and intelligent automation.
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
                  VIEW DEMO
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
          {cardImages.map((image, index) => {
            const angle = index * 40; // 9 cards spaced 40 degrees apart

            return (
              <div
                key={index}
                className="absolute shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer"
                style={{
                  width: "135px",
                  height: "135px",
                  transform: `rotateY(${angle}deg) translateZ(280px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                }}
              >
                <img
                  src={`/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/${image}`}
                  alt={`Card ${index + 1}`}
                  className="w-full h-full object-cover border border-white/20 shadow-2xl"
                  style={{
                    borderRadius: "16px",
                  }}
                />
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
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={16}
                className="fill-lime-400 text-lime-400"
                style={{ color: "rgb(214, 253, 112)" }}
              />
            ))}
          </div>
          <div>Rated 4.9/5 by 4,900+ clients</div>
        </div>
      </Reveal>
    </section>
  )
}

