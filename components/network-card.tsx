"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface NetworkCardProps {
  icon: ReactNode
  title: string
  value: string
  description: string
  progress?: number
  maxProgress?: number
  reverseProgress?: boolean
  colorTheme?: "green" | "blue" | "purple" | "orange" | "rainbow"
}

export function NetworkCard({
  icon,
  title,
  value,
  description,
  progress,
  maxProgress = 100,
  reverseProgress = false,
  colorTheme = "green",
}: NetworkCardProps) {
  const progressPercentage = progress !== undefined ? Math.min((progress / maxProgress) * 100, 100) : undefined

  // Get color based on theme
  const getProgressColor = () => {
    if (reverseProgress) {
      if (progressPercentage && progressPercentage > 50) {
        return "bg-red-500"
      }
    }

    switch (colorTheme) {
      case "green":
        return "bg-[#82f01f]"
      case "blue":
        return "bg-[#4158D0]"
      case "purple":
        return "bg-[#8E2DE2]"
      case "orange":
        return "bg-[#FF512F]"
      case "rainbow":
        return "bg-gradient-to-r from-[#82f01f] via-[#4158D0] to-[#C850C0]"
      default:
        return "bg-[#82f01f]"
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg"
    >
      <div className="flex items-center mb-2">
        <div className="mr-2">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <div className="text-xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500 mb-2">{description}</div>

      {progress !== undefined && (
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${getProgressColor()} rounded-full`} style={{ width: `${progressPercentage}%` }} />
        </div>
      )}
    </motion.div>
  )
}

