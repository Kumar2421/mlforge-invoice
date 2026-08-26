'use client';

import Image from 'next/image';
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

export function CtaBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-[24px] bg-black" style={{ aspectRatio: '1416 / 488' }}>
      <Image
        src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/692dd59736012cfb238ae312_cta-bg.avif"
        alt="CTA Background"
        fill
        className="object-cover"
        priority
      />

      <div
        className="absolute inset-0 rounded-[24px]"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0))',
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-center px-10 py-10">
        <div className="mx-7 flex max-w-5xl flex-col gap-4">
          <Reveal delay={0}>
            <div className="flex flex-row items-center gap-4">
              <div className="font-sans text-base font-normal text-white">
                Read-only, always
              </div>
              <div className="flex flex-row">
                <div className="relative h-10 w-10 -ml-3 flex-shrink-0 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e4c804dbf540688e23_users-1.avif"
                    alt="User 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-10 w-10 -ml-3 flex-shrink-0 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e4fe402c7f09028c97_users-2.avif"
                    alt="User 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-10 w-10 -ml-3 flex-shrink-0 overflow-hidden rounded-full border-2 border-white">
                  <Image
                    src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/6998d6e4bfe84c916ea64131_users-3.avif"
                    alt="User 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="pt-8" />

          <Reveal delay={100}>
            <h2 className="font-sans text-5xl font-medium leading-tight text-white" style={{ letterSpacing: '-0.072em' }}>
              Stop chasing payments by hand
            </h2>
          </Reveal>

          <div className="pt-4" />

          <Reveal delay={200}>
            <div className="max-w-[528px] font-sans text-base font-normal leading-relaxed text-white">
              Connect your Stripe account in under a minute. Escalating reminders start
              working the same day, and stop the instant an invoice is paid.
            </div>
          </Reveal>

          <div className="pt-8" />

          <Reveal delay={300}>
            <div>
              <button
                className="relative inline-flex items-center justify-center gap-2 rounded-full p-1 px-4 transition-all duration-300 ease-out"
                style={{
                  backgroundColor: '#d6fd70',
                  transform: 'matrix(1, 0, 0, 1, 0, 0)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d6fd70';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
                }}
              >
                <div className="flex flex-row items-center justify-center gap-2 rounded-full pl-3">
                  <div className="font-mono text-base font-normal tracking-widest text-black">GET STARTED</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#131313]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 2l8 6-8 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
