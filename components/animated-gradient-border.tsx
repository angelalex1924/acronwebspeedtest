"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedGradientBorderProps {
  children: ReactNode
  className?: string
}

export function AnimatedGradientBorder({ children, className = "" }: AnimatedGradientBorderProps) {
  return (
    <div className={`relative rounded-2xl ${className}`}>
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#0fad93] via-[#56dc21] to-[#0fad93] opacity-70 blur-[2px]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
        {children}
      </div>
    </div>
  )
}

