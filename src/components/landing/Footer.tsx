import Image from 'next/image';
import { Reveal } from '@/components/sites/aeline-webflow-io-7f5c9972/shared/Reveal';

export function Footer() {
  return (
    <footer className="w-full bg-transparent">
      <Reveal delay={0}>
        <div className="px-3 pb-3">
        <div className="w-full rounded-[24px] bg-[#131313] p-10 text-white">
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-[552px_736px] gap-12">
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <Image
                    src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/69bc6c8e343f8f1f1832309a_aeline-logo.svg"
                    alt="Aeline"
                    width={114}
                    height={30}
                    priority
                  />
                </div>

                <p className="text-base leading-[1.4] text-white">
                  Easily adapt to changes and scale your operations with our flexible infrastructure,
                  designed to support your business growth.
                </p>

                <div>
                  <label className="mb-4 block text-base font-normal text-white">
                    Subscribe our newsletter
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 rounded-full bg-[#2a2a2a] px-6 py-3 text-base text-white placeholder-[#808080] outline-none transition-colors hover:bg-[#333333] focus:bg-[#333333]"
                    />
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#d6fd70] px-6 py-3 font-semibold text-black transition-all hover:scale-95 hover:bg-white">
                      SUBMIT
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-4">
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Home V.1
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Home V.2
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Home V.3
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Services
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Contact V.1
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Contact V.2
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Contact V.3
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Pricing
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  <a href="#" className="text-base text-[#b8d4a8]">
                    About us V.1
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    About us V.2
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    About us V.3
                  </a>
                  <a href="#" className="text-base text-[#b8d4a8]">
                    Blog
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 border-t border-[#333333] pt-6">
              <div className="flex gap-6">
                <a href="#" className="text-base text-[#b8d4a8]">
                  Style Guide
                </a>
                <a href="#" className="text-base text-[#b8d4a8]">
                  Changelog
                </a>
                <a href="#" className="text-base text-[#b8d4a8]">
                  Licensing
                </a>
              </div>

              <span className="text-base text-[#c7c7c7]">
                © 2026 Aeline Inc. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </footer>
  );
}
