"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-[999] bg-transparent pt-3 w-full">
      <div className="px-[52px] py-4">
        <div className="mx-7 max-w-5xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="pr-14 flex-shrink-0">
              <Image
                src="/sites/aeline-webflow-io-7f5c9972/root-8a5edab2/images/69bc6c8e343f8f1f1832309a_aeline-logo.svg"
                alt="Aeline"
                width={114}
                height={30}
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-12 flex-1 justify-center">
              <a href="#" className="text-white font-sans font-normal text-base">
                Home
              </a>
              <a href="#" className="text-white font-sans font-normal text-base">
                Services
              </a>
              <a href="#" className="text-white font-sans font-normal text-base">
                About us
              </a>
              <button className="text-white font-sans font-normal text-base flex items-center gap-2">
                More links
                <ChevronDown className="w-4 h-4" />
              </button>
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
              <a href="#" className="text-white font-sans font-normal text-base">
                Home
              </a>
              <a href="#" className="text-white font-sans font-normal text-base">
                Services
              </a>
              <a href="#" className="text-white font-sans font-normal text-base">
                About us
              </a>
              <button className="text-white font-sans font-normal text-base flex items-center gap-2">
                More links
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
