"use client"

import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Animate logo every 5 seconds
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn("flex items-center", className)}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
    >
      <div className="relative w-10 h-10 mr-2 flex items-center justify-center">
        {/* Logo background */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-tr from-[#82f01f] to-[#a4ff29] rounded-full opacity-90 shadow-lg shadow-[#82f01f]/20 transition-all duration-300",
            isAnimating && "scale-110",
          )}
        />

        {/* Logo icon */}
        <Zap
          className={cn(
            "w-6 h-6 text-white relative z-10 transition-all duration-300",
            isAnimating && "scale-125 text-yellow-100",
          )}
        />

        {/* Animated glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-[#82f01f]/0 transition-all duration-500",
            isAnimating && "bg-[#82f01f]/30 blur-md scale-150",
          )}
        />
      </div>
      <div>
        <div
          className={cn(
            "font-bold text-lg leading-tight bg-gradient-to-r from-[#82f01f] to-[#a4ff29] text-transparent bg-clip-text transition-all duration-300",
            isAnimating && "from-[#9dff3a] to-[#c2ff7a]",
          )}
        >
          Speedtest
        </div>
        <div className="text-xs text-[#82f01f] leading-tight">by AcronWeb</div>
      </div>
    </div>
  )
}

