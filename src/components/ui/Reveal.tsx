"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** hero-style content should reveal on mount, not on scroll-into-view */
  triggerOnMount?: boolean;
  as?: "div" | "span";
  style?: CSSProperties;
}

export function Reveal({
  children,
  className,
  delay = 0,
  triggerOnMount = false,
  as = "div",
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerOnMount) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, triggerOnMount]);

  const Comp = as;
  return (
    <Comp
      ref={ref as never}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-[72px] opacity-0",
        className,
      )}
      style={style}
    >
      {children}
    </Comp>
  );
}
