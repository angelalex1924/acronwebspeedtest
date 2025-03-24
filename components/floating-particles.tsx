"use client"

import { useEffect, useRef } from "react"

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles - use fewer particles for better performance
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
    }[] = []

    // Significantly reduced particle count
    const particleCount = Math.min(window.innerWidth / 100, 20)

    const colors = ["#82f01f", "#a4ff29", "#4158D0", "#FBAB7E"]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1, // Smaller particles
        speedX: (Math.random() - 0.5) * 0.2, // Slower movement
        speedY: (Math.random() - 0.5) * 0.2, // Slower movement
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    // Animation loop - run at a lower framerate for better performance
    let lastFrameTime = 0
    const targetFPS = 15 // Lower FPS for better performance
    const frameInterval = 1000 / targetFPS

    const animate = (timestamp: number) => {
      // Throttle the animation frame rate
      if (timestamp - lastFrameTime < frameInterval) {
        requestAnimationFrame(animate)
        return
      }

      lastFrameTime = timestamp
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle - simplified rendering
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
}

