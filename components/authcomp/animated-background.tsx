"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark, theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Get theme colors
    let primaryColor = ""
    let secondaryColor = ""

    switch (theme) {
      case "green":
        primaryColor = isDark ? "rgba(15, 173, 147, 0.2)" : "rgba(15, 173, 147, 0.05)"
        secondaryColor = isDark ? "rgba(86, 220, 33, 0.2)" : "rgba(86, 220, 33, 0.05)"
        break
      case "blue":
        primaryColor = isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.05)"
        secondaryColor = isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.05)"
        break
      case "purple":
        primaryColor = isDark ? "rgba(147, 51, 234, 0.2)" : "rgba(147, 51, 234, 0.05)"
        secondaryColor = isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.05)"
        break
      case "orange":
        primaryColor = isDark ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.05)"
        secondaryColor = isDark ? "rgba(249, 115, 22, 0.2)" : "rgba(249, 115, 22, 0.05)"
        break
      case "pink":
        primaryColor = isDark ? "rgba(219, 39, 119, 0.2)" : "rgba(219, 39, 119, 0.05)"
        secondaryColor = isDark ? "rgba(236, 72, 153, 0.2)" : "rgba(236, 72, 153, 0.05)"
        break
      case "cyan":
        primaryColor = isDark ? "rgba(8, 145, 178, 0.2)" : "rgba(8, 145, 178, 0.05)"
        secondaryColor = isDark ? "rgba(6, 182, 212, 0.2)" : "rgba(6, 182, 212, 0.05)"
        break
      default:
        primaryColor = isDark ? "rgba(15, 173, 147, 0.2)" : "rgba(15, 173, 147, 0.05)"
        secondaryColor = isDark ? "rgba(86, 220, 33, 0.2)" : "rgba(86, 220, 33, 0.05)"
    }

    // Create particles
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.size = Math.random() * 15 + 5
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = Math.random() > 0.5 ? primaryColor : secondaryColor
      }

      update() {
        if (!canvas) return

        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return

        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
      }
    }

    const particles: Particle[] = []
    const particleCount = Math.min(20, Math.floor(window.innerWidth / 100))

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid pattern
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1

      const gridSize = 40

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [isDark, theme])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />
}

