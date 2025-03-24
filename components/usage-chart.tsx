"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "../context/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartProps {
  data: number[]
  labels: string[]
  title: string
  description?: string
}

export function UsageChart({ data, labels, title, description }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark, theme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Calculate max value for scaling
    const maxValue = Math.max(...data) * 1.2

    // Draw background grid
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Get theme colors
    let primaryColor = ""
    let secondaryColor = ""

    switch (theme) {
      case "green":
        primaryColor = "rgba(15, 173, 147, 0.8)"
        secondaryColor = "rgba(86, 220, 33, 0.8)"
        break
      case "blue":
        primaryColor = "rgba(37, 99, 235, 0.8)"
        secondaryColor = "rgba(59, 130, 246, 0.8)"
        break
      case "purple":
        primaryColor = "rgba(147, 51, 234, 0.8)"
        secondaryColor = "rgba(168, 85, 247, 0.8)"
        break
      case "orange":
        primaryColor = "rgba(234, 88, 12, 0.8)"
        secondaryColor = "rgba(249, 115, 22, 0.8)"
        break
      case "pink":
        primaryColor = "rgba(219, 39, 119, 0.8)"
        secondaryColor = "rgba(236, 72, 153, 0.8)"
        break
      case "cyan":
        primaryColor = "rgba(8, 145, 178, 0.8)"
        secondaryColor = "rgba(6, 182, 212, 0.8)"
        break
      default:
        primaryColor = "rgba(15, 173, 147, 0.8)"
        secondaryColor = "rgba(86, 220, 33, 0.8)"
    }

    // Draw bars
    const barWidth = chartWidth / data.length / 2
    const barSpacing = chartWidth / data.length

    // Create gradient for bars
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, primaryColor)
    gradient.addColorStop(1, secondaryColor)

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + barSpacing * index + barSpacing / 4
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
      ctx.fill()

      // Draw label
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15)

      // Draw value
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })
  }, [data, labels, isDark, theme])

  return (
    <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className={isDark ? "text-white" : ""}>{title}</CardTitle>
        {description && <CardDescription className={isDark ? "text-gray-400" : ""}>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <canvas ref={canvasRef} width={500} height={250} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

