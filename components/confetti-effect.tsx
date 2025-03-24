"use client"

import { useEffect, useRef } from "react"

interface ConfettiEffectProps {
  isActive: boolean
}

export function ConfettiEffect({ isActive }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Confetti particles
    const particles: {
      x: number
      y: number
      size: number
      color: string
      speed: number
      angle: number
      rotation: number
      rotationSpeed: number
      shape: "circle" | "square" | "triangle" | "line" | "star"
    }[] = []

    // Colors
    const colors = [
      "#82f01f",
      "#a4ff29",
      "#FBAB7E",
      "#F7CE68",
      "#4158D0",
      "#C850C0",
      "#00f2fe",
      "#4facfe",
      "#f093fb",
      "#f5576c",
    ]

    // Create particles
    for (let i = 0; i < 200; i++) {
      const shapes = ["circle", "square", "triangle", "line", "star"]
      const shape = shapes[Math.floor(Math.random() * shapes.length)] as
        | "circle"
        | "square"
        | "triangle"
        | "line"
        | "star"
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100, // Start above the canvas
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 1,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        shape,
      })
    }

    // Animation
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let allFallen = true

      particles.forEach((particle) => {
        // Update position
        particle.y += particle.speed
        particle.x += Math.sin(particle.angle) * 1.5
        particle.rotation += particle.rotationSpeed

        // Check if any particles are still visible
        if (particle.y < canvas.height + 50) {
          allFallen = false
        }

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.fillStyle = particle.color
        ctx.strokeStyle = particle.color

        // Draw different shapes
        switch (particle.shape) {
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
            ctx.fill()
            break
          case "square":
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
            break
          case "triangle":
            ctx.beginPath()
            ctx.moveTo(0, -particle.size / 2)
            ctx.lineTo(particle.size / 2, particle.size / 2)
            ctx.lineTo(-particle.size / 2, particle.size / 2)
            ctx.closePath()
            ctx.fill()
            break
          case "line":
            ctx.beginPath()
            ctx.moveTo(-particle.size / 2, 0)
            ctx.lineTo(particle.size / 2, 0)
            ctx.lineWidth = 2
            ctx.stroke()
            break
          case "star":
            const spikes = 5
            const outerRadius = particle.size / 2
            const innerRadius = particle.size / 4

            ctx.beginPath()
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius
              const angle = (Math.PI * i) / spikes
              ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
            }
            ctx.closePath()
            ctx.fill()
            break
        }

        ctx.restore()
      })

      // Stop animation if all particles have fallen
      if (allFallen) {
        cancelAnimationFrame(animationId)
      } else {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ opacity: isActive ? 1 : 0 }} />
  )
}

