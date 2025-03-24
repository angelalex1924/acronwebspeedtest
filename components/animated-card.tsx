"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: number
  borderGlow?: boolean
}

export function AnimatedCard({
  children,
  className,
  glowColor = "hsl(var(--primary) / 0.5)",
  intensity = 0.15,
  borderGlow = true,
}: AnimatedCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2

    // Calculate rotation based on mouse position
    const rotateY = (mouseX / width) * 10 * intensity // Max 10 degrees
    const rotateX = -((mouseY / height) * 10 * intensity) // Max 10 degrees

    setRotateX(rotateX)
    setRotateY(rotateY)
    setMouseX(mouseX / width)
    setMouseY(mouseY / height)
  }

  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-card border border-border backdrop-blur-sm transition-all duration-200",
        borderGlow && "shadow-[0_0_15px_hsl(var(--primary)/0.1)]",
        className,
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mouseX * 100}% ${50 + mouseY * 100}%, ${glowColor}, transparent 40%)`,
          opacity: Math.sqrt(mouseX ** 2 + mouseY ** 2) * 0.5,
        }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

