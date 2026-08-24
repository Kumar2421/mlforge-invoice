import { cn } from "@/lib/utils"

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: React.ReactNode
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row w-full select-none relative",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - var(--gap))); }
        }
        .animate-marquee-h {
          animation: marquee-horizontal var(--duration, 20s) linear infinite;
        }
      `}} />
      <div
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)] min-w-full flex-row animate-marquee-h",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)] min-w-full flex-row animate-marquee-h",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
    </div>
  )
}
