"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Fingerprint, Zap, Key } from "lucide-react"
import type { ReactNode } from "react"

interface FloatingIconProps {
  icon: ReactNode
  delay: number
  x: string
  y: string
}

function FloatingIcon({ icon, delay, x, y }: FloatingIconProps) {
  return (
    <motion.div
      className="absolute w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: ["0px", "15px", "0px"],
        x: ["0px", "5px", "0px"],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay,
        },
        x: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay,
        },
      }}
      style={{ top: y, left: x }}
    >
      {icon}
    </motion.div>
  )
}

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingIcon icon={<Shield className="w-5 h-5 text-[#0fad93]" />} delay={0} x="10%" y="15%" />
      <FloatingIcon icon={<Lock className="w-5 h-5 text-[#56dc21]" />} delay={0.5} x="85%" y="20%" />
      <FloatingIcon icon={<Fingerprint className="w-5 h-5 text-[#ff605c]" />} delay={1} x="75%" y="75%" />
      <FloatingIcon icon={<Zap className="w-5 h-5 text-[#ffbd44]" />} delay={1.5} x="15%" y="80%" />
      <FloatingIcon icon={<Key className="w-5 h-5 text-[#0fad93]" />} delay={2} x="50%" y="10%" />
    </div>
  )
}

