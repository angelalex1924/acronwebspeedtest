"use client"

import { motion } from "framer-motion"
import { Fingerprint } from "lucide-react"

export function FingerprintLogo() {
  return (
    <motion.div
      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0fad93] to-[#56dc21] flex items-center justify-center shadow-lg overflow-hidden"
      whileHover={{ scale: 1.05, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="relative w-12 h-12">
        {/* Fingerprint icon with animated rings */}
        <Fingerprint className="w-12 h-12 text-white absolute inset-0" />
        <div className="absolute inset-0 w-full h-full rounded-full border-2 border-white/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute inset-2 w-8 h-8 rounded-full border border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>

        {/* Add a pulsing glow effect */}
        <div className="absolute inset-0 w-full h-full rounded-full bg-white/10 animate-pulse"></div>

        {/* Add scanning line effect */}
        <motion.div
          className="absolute left-0 w-full h-1 bg-white/40 blur-sm"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 2.5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </div>
    </motion.div>
  )
}

