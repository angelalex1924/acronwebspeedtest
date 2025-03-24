"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  max: number
  label: string
  units: string
  progress: number
  phase: string
  type?: "download" | "upload"
}

export function Gauge({ value, max, label, units, progress, phase, type = "download" }: GaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const percentage = Math.min(value / max, 1) * 100

  // Colors based on type with enhanced gradients
  const primaryColor =
    type === "download"
      ? { start: "#82f01f", end: "#a4ff29", glow: "rgba(130, 240, 31, 0.5)" }
      : { start: "#FBAB7E", end: "#F7CE68", glow: "rgba(251, 171, 126, 0.5)" }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // For high-DPI displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw modern gauge background
    const drawModernGauge = () => {
      // Add subtle glow effect to the entire gauge
      ctx.shadowColor = primaryColor.glow
      ctx.shadowBlur = 10

      // Draw background track with enhanced styling
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
      ctx.lineWidth = 15
      ctx.lineCap = "round"

      // Create a subtle gradient for the background track
      const bgGradient = ctx.createLinearGradient(0, 0, rect.width, 0)
      bgGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)")
      bgGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)")
      ctx.strokeStyle = bgGradient
      ctx.stroke()

      // Reset shadow for other elements
      ctx.shadowBlur = 0

      // Draw progress arc if test is running
      if (phase !== "idle" && phase !== "complete") {
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0)
        gradient.addColorStop(0, primaryColor.start + "80") // 50% opacity
        gradient.addColorStop(1, primaryColor.end + "80") // 50% opacity

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + Math.PI * progress, false)
        ctx.lineWidth = 15
        ctx.lineCap = "round"
        ctx.strokeStyle = gradient
        ctx.stroke()

        // Add subtle pulsing glow to the progress arc
        ctx.shadowColor = primaryColor.glow
        ctx.shadowBlur = 15
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + Math.PI * progress, false)
        ctx.lineWidth = 8
        ctx.strokeStyle = gradient
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // Draw value arc with enhanced styling
      if (value > 0) {
        // Create a more vibrant gradient for the value arc
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0)
        gradient.addColorStop(0, primaryColor.start)
        gradient.addColorStop(0.5, primaryColor.end)
        gradient.addColorStop(1, primaryColor.start)

        // Add glow effect
        ctx.shadowColor = primaryColor.glow
        ctx.shadowBlur = 15

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * percentage) / 100, false)
        ctx.lineWidth = 15
        ctx.lineCap = "round"
        ctx.strokeStyle = gradient
        ctx.stroke()

        // Reset shadow
        ctx.shadowBlur = 0
      }

      // Draw tick marks with enhanced styling
      for (let i = 0; i <= 10; i++) {
        const angle = Math.PI + (Math.PI * i) / 10
        const tickLength = i % 5 === 0 ? 12 : 6

        const innerX = centerX + (radius - 25) * Math.cos(angle)
        const innerY = centerY + (radius - 25) * Math.sin(angle)
        const outerX = centerX + (radius - 25 + tickLength) * Math.cos(angle)
        const outerY = centerY + (radius - 25 + tickLength) * Math.sin(angle)

        ctx.beginPath()
        ctx.moveTo(innerX, innerY)
        ctx.lineTo(outerX, outerY)
        ctx.lineWidth = i % 5 === 0 ? 2.5 : 1.5

        // Make tick marks more visible with gradient
        const tickGradient = ctx.createLinearGradient(innerX, innerY, outerX, outerY)
        tickGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        tickGradient.addColorStop(1, "rgba(255, 255, 255, 0.4)")
        ctx.strokeStyle = tickGradient
        ctx.stroke()

        // Add labels for major ticks with enhanced styling
        if (i % 5 === 0) {
          const labelX = centerX + (radius - 45) * Math.cos(angle)
          const labelY = centerY + (radius - 45) * Math.sin(angle)

          ctx.font = "bold 11px sans-serif"
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(`${Math.round((max * i) / 10)}`, labelX, labelY)
        }
      }

      // Draw center hub with enhanced styling
      ctx.beginPath()
      ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI)
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 18)

      if (value > 0) {
        hubGradient.addColorStop(0, "#ffffff")
        hubGradient.addColorStop(0.7, primaryColor.start)
        hubGradient.addColorStop(1, primaryColor.end)
        ctx.fillStyle = hubGradient
        ctx.shadowColor = primaryColor.glow
        ctx.shadowBlur = 10
      } else {
        // Draw center hub when idle with enhanced styling
        hubGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)")
        hubGradient.addColorStop(1, "rgba(255, 255, 255, 0.3)")
        ctx.fillStyle = hubGradient
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
        ctx.shadowBlur = 10
      }

      ctx.fill()
      ctx.shadowBlur = 0

      // Add glow effect with animation-like pulsing
      ctx.beginPath()
      ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI)
      ctx.fillStyle = `${primaryColor.start}40` // 25% opacity
      ctx.filter = "blur(5px)"
      ctx.fill()
      ctx.filter = "none"

      if (value === 0) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
        ctx.fill()
      }

      // Add decorative outer ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 10, Math.PI, 2 * Math.PI, false)
      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.stroke()

      // Add decorative inner ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius - 30, Math.PI, 2 * Math.PI, false)
      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
      ctx.stroke()

      // Add spectacular light rays effect when complete
      if (phase === "complete" && value > 0) {
        const rayCount = 12
        const rayLength = 15
        const angleOffset = Math.PI + (Math.PI * percentage) / 100

        ctx.save()
        ctx.strokeStyle = primaryColor.start + "70"
        ctx.lineWidth = 2

        for (let i = 0; i < rayCount; i++) {
          const rayAngle = ((Math.PI * 2) / rayCount) * i
          const startX = centerX + (radius + 2) * Math.cos(rayAngle)
          const startY = centerY + (radius + 2) * Math.sin(rayAngle)
          const endX = centerX + (radius + rayLength) * Math.cos(rayAngle)
          const endY = centerY + (radius + rayLength) * Math.sin(rayAngle)

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()
        }

        ctx.restore()
      }
    }

    drawModernGauge()

    // Set up an animation frame to keep the gauge updated
    let animationFrameId: number

    const animate = () => {
      drawModernGauge()
      animationFrameId = requestAnimationFrame(animate)
    }

    // animate() //Commented out because it was causing issues

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [value, max, percentage, progress, phase, primaryColor])

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-40">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Value display - moved BELOW the gauge */}
      <div className="mt-2 flex flex-col items-center">
        <motion.div
          key={`value-${phase}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {phase === "idle" ? (
            <span className="text-2xl text-muted-foreground">Ready</span>
          ) : phase === "connecting" ? (
            <span className="text-2xl text-muted-foreground">Connecting...</span>
          ) : phase === "complete" ? (
            <span className="text-2xl gradient-animation bg-gradient-to-r from-[#82f01f] to-[#a4ff29] bg-clip-text text-transparent">
              Complete
            </span>
          ) : (
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">{value.toFixed(2)}</span>
              <span className="ml-1 text-sm text-muted-foreground">{units}</span>
            </div>
          )}
        </motion.div>

        <div
          className={cn(
            "text-lg font-medium mt-1",
            phase === "download" && "text-[#82f01f]",
            phase === "upload" && "text-[#FBAB7E]",
          )}
        >
          {label}
        </div>
      </div>
    </div>
  )
}

