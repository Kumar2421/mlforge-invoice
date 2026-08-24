import Image from 'next/image';

const LOGOS = [
  {
    src: '/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/692a0fbc1d0331fc768fcaee_logo-1.svg',
    alt: 'Logo 1',
  },
  {
    src: '/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/692a0fbc6e3d4146330879cb_logo-2.svg',
    alt: 'Logo 2',
  },
  {
    src: '/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/692a0fbc964ffb9e2e1f3831_logo-3.svg',
    alt: 'Logo 3',
  },
  {
    src: '/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/692a0fbc0a00730d709003d2_logo-4.svg',
    alt: 'Logo 4',
  },
];

export function LogoMarquee() {
  return (
    <section className="w-full h-24 overflow-hidden bg-white">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation: marquee 25s linear infinite;
        }
      `}</style>
      <div className="py-8">
        <div className="marquee-track flex gap-[72px] w-fit">
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={133}
                height={32}
                className="grayscale opacity-60"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
