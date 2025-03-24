"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create grid points - use fewer points for better performance
    const gridSize = 50 // Larger spacing for better performance
    const points: { x: number; y: number; originX: number; originY: number }[] = []

    const createGrid = () => {
      points.length = 0
      const spacing = gridSize

      // Create fewer points for better performance
      const maxPoints = 80 // Significantly reduced number of points
      let pointCount = 0

      for (let x = 0; x < canvas.width + spacing; x += spacing) {
        for (let y = 0; y < canvas.height + spacing; y += spacing) {
          if (pointCount < maxPoints) {
            points.push({
              x,
              y,
              originX: x,
              originY: y,
            })
            pointCount++
          }
        }
      }
    }

    createGrid()
    window.addEventListener("resize", createGrid)

    // Animation variables
    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop - run at a lower framerate for better performance
    let lastFrameTime = 0
    const targetFPS = 15 // Lower FPS for better performance
    const frameInterval = 1000 / targetFPS

    const animate = (timestamp: number) => {
      // Throttle the animation frame rate
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      lastFrameTime = timestamp
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "rgba(130, 240, 31, 0.05)"
      ctx.lineWidth = 1

      // Only process a subset of points each frame for better performance
      const maxConnectionsPerFrame = 40
      let connectionCount = 0

      for (let i = 0; i < points.length; i++) {
        const point = points[i]

        // Calculate distance from mouse
        const dx = mouseX - point.originX
        const dy = mouseY - point.originY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        // Move points based on mouse position
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 10
          point.x = point.originX + (dx * force) / 10
          point.y = point.originY + (dy * force) / 10
        } else {
          // Return to original position
          point.x += (point.originX - point.x) * 0.05
          point.y += (point.originY - point.y) * 0.05
        }

        // Draw connections between points - limit the number of connections
        if (connectionCount < maxConnectionsPerFrame) {
          for (let j = i + 1; j < points.length; j++) {
            const nextPoint = points[j]
            const dx = point.x - nextPoint.x
            const dy = point.y - nextPoint.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < gridSize * 1.5) {
              ctx.beginPath()
              ctx.moveTo(point.x, point.y)
              ctx.lineTo(nextPoint.x, nextPoint.y)
              ctx.stroke()
              connectionCount++

              if (connectionCount >= maxConnectionsPerFrame) break
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", createGrid)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Simplified static gradient background */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#82f01f]/5 to-[#a4ff29]/5 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#4158D0]/5 to-[#C850C0]/5 blur-3xl"></div>
    </div>
  )
}

