"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-[999] bg-transparent pt-3 w-full">
      <div className="px-[52px] py-4">
        <div className="mx-7 max-w-5xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="pr-14 flex-shrink-0 flex items-center gap-2.5">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#22C55E" />
                <path
                  d="M9 18C9 14 12 10 18 9C17 13 15 16 11 18C10.5 18.3 9.5 18.3 9 18Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
              <span className="text-white font-sans font-bold text-base tracking-tight">Payment Reminders</span>
            </Link>

            <div className="hidden lg:flex items-center gap-12 flex-1 justify-center">
              <a href="#how-it-works" className="text-white font-sans font-normal text-base">
                How it works
              </a>
              <a href="#features" className="text-white font-sans font-normal text-base">
                Features
              </a>
              <a href="#pricing" className="text-white font-sans font-normal text-base">
                Pricing
              </a>
            </div>

            <Link
              href="/login"
              className={cn(
                "flex-shrink-0 ml-4 lg:ml-0",
                "px-6 py-2.5",
                "bg-lime text-primary",
                "rounded-full",
                "font-sans font-medium text-base",
                "transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]",
                "hover:scale-95 hover:bg-white",
                "whitespace-nowrap"
              )}
            >
              Login
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-[18px] flex-shrink-0 -mr-4.5"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="lg:hidden mt-4 pt-4 pb-4 border-t border-white/20 flex flex-col gap-4">
              <a href="#how-it-works" className="text-white font-sans font-normal text-base">
                How it works
              </a>
              <a href="#features" className="text-white font-sans font-normal text-base">
                Features
              </a>
              <a href="#pricing" className="text-white font-sans font-normal text-base">
                Pricing
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
