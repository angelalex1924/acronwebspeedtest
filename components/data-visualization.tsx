"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DataPoint {
  label: string
  value: number
}

interface DataVisualizationProps {
  title: string
  description?: string
  data: DataPoint[]
  type?: "bar" | "line" | "pie" | "donut"
  height?: number
  className?: string
}

export function DataVisualization({
  title,
  description,
  data,
  type = "bar",
  height = 300,
  className,
}: DataVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark, theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with a small delay to ensure the DOM is fully rendered
    setTimeout(() => {
      // Get the actual dimensions of the canvas element
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get theme colors
      let colors: string[] = []

      switch (theme) {
        case "green":
          colors = ["rgba(15, 173, 147, 0.8)", "rgba(86, 220, 33, 0.8)", "rgba(255, 189, 68, 0.8)"]
          break
        case "blue":
          colors = ["rgba(37, 99, 235, 0.8)", "rgba(59, 130, 246, 0.8)", "rgba(96, 165, 250, 0.8)"]
          break
        case "purple":
          colors = ["rgba(147, 51, 234, 0.8)", "rgba(168, 85, 247, 0.8)", "rgba(192, 132, 252, 0.8)"]
          break
        default:
          colors = ["rgba(15, 173, 147, 0.8)", "rgba(86, 220, 33, 0.8)", "rgba(255, 189, 68, 0.8)"]
      }

      // Set dimensions
      const width = rect.width
      const chartHeight = height - 40 // Leave space for labels
      const padding = 40

      // Find max value for scaling
      const maxValue = Math.max(...data.map((d) => d.value)) * 1.2 || 1 // Ensure non-zero

      // Draw based on chart type
      if (type === "bar") {
        // Draw background grid
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        ctx.lineWidth = 1

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
          const y = padding + ((chartHeight - padding * 2) / 5) * i
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(width - padding, y)
          ctx.stroke()
        }

        // Draw bars
        const barWidth = (width - padding * 2) / data.length / 2
        const barSpacing = (width - padding * 2) / data.length

        data.forEach((point, index) => {
          const barHeight = (point.value / maxValue) * (chartHeight - padding * 2)
          const x = padding + barSpacing * index + barSpacing / 4
          const y = chartHeight - barHeight

          // Draw bar
          ctx.fillStyle = colors[index % colors.length]
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
          ctx.fill()

          // Draw label
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(point.label, x + barWidth / 2, chartHeight - 10)

          // Draw value
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5)
        })
      } else if (type === "line") {
        // Draw background grid
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        ctx.lineWidth = 1

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
          const y = padding + ((chartHeight - padding * 2) / 5) * i
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(width - padding, y)
          ctx.stroke()
        }

        // Draw line
        ctx.strokeStyle = colors[0]
        ctx.lineWidth = 3
        ctx.lineJoin = "round"
        ctx.beginPath()

        data.forEach((point, index) => {
          const x = padding + ((width - padding * 2) / (data.length - 1)) * index
          const y = chartHeight - (point.value / maxValue) * (chartHeight - padding * 2)

          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          // Draw point
          ctx.fillStyle = colors[0]
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fill()

          // Draw label
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(point.label, x, chartHeight - 10)

          // Draw value
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(point.value.toString(), x, y - 10)
        })

        ctx.stroke()

        // Add gradient under the line
        const gradient = ctx.createLinearGradient(0, padding, 0, chartHeight)
        gradient.addColorStop(0, colors[0].replace("0.8", "0.3"))
        gradient.addColorStop(1, colors[0].replace("0.8", "0"))

        ctx.fillStyle = gradient
        ctx.beginPath()

        // Start from the bottom left
        ctx.moveTo(padding, chartHeight)

        // Draw the line path again
        data.forEach((point, index) => {
          const x = padding + ((width - padding * 2) / (data.length - 1)) * index
          const y = chartHeight - (point.value / maxValue) * (chartHeight - padding * 2)
          ctx.lineTo(x, y)
        })

        // Complete the path to the bottom right
        ctx.lineTo(width - padding, chartHeight)
        ctx.closePath()
        ctx.fill()
      } else if (type === "pie" || type === "donut") {
        const centerX = width / 2
        const centerY = chartHeight / 2
        // Ensure radius is positive and reasonable
        const radius = Math.max(10, Math.min(centerX, centerY) - padding)

        // Calculate total value
        const total = data.reduce((sum, point) => sum + point.value, 0) || 1 // Ensure non-zero

        // Draw pie/donut segments
        let startAngle = -Math.PI / 2 // Start from top

        data.forEach((point, index) => {
          const sliceAngle = (point.value / total) * 2 * Math.PI
          const endAngle = startAngle + sliceAngle

          // Draw segment
          ctx.fillStyle = colors[index % colors.length]
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()
          ctx.fill()

          // Draw label line and text
          const midAngle = startAngle + sliceAngle / 2
          const labelRadius = radius * 1.2
          const labelX = centerX + Math.cos(midAngle) * labelRadius
          const labelY = centerY + Math.sin(midAngle) * labelRadius

          // Draw line
          ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
          ctx.beginPath()
          ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
          ctx.lineTo(labelX, labelY)
          ctx.stroke()

          // Draw label
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
          ctx.font = "10px sans-serif"
          ctx.textAlign = midAngle < Math.PI ? "left" : "right"
          ctx.fillText(`${point.label} (${Math.round((point.value / total) * 100)}%)`, labelX, labelY)

          startAngle = endAngle
        })

        // Draw donut hole if type is donut
        if (type === "donut") {
          ctx.fillStyle = isDark ? "rgb(31, 41, 55)" : "rgb(255, 255, 255)"
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }, 100) // Small delay to ensure DOM is ready
  }, [data, type, height, isDark, theme])

  return (
    <Card className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white", className)}>
      <CardHeader>
        <CardTitle className={isDark ? "text-white" : ""}>{title}</CardTitle>
        {description && <CardDescription className={isDark ? "text-gray-400" : ""}>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

