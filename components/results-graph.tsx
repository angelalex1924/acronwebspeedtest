"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Clock } from "lucide-react"
import type { TestResult } from "@/types"
import { motion } from "framer-motion"

interface ResultsGraphProps {
  testHistory: TestResult[]
}

export function ResultsGraph({ testHistory }: ResultsGraphProps) {
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null)
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null)
  const pingCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (testHistory.length === 0) return

    const drawGraph = (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      data: number[],
      color: string,
      maxValue?: number,
    ) => {
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

      const width = rect.width
      const height = rect.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      if (data.length === 0) return

      // Find max value for scaling if not provided
      const max = maxValue || Math.max(...data) * 1.2

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i < 5; i++) {
        const y = height - height * (i / 4)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()

        // Add labels
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`${Math.round((max * i) / 4)}`, 5, y - 5)
      }

      // Draw line
      ctx.beginPath()
      ctx.moveTo(0, height - (data[0] / max) * height)

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, `${color}`)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      // Draw points and connect with lines
      for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * width
        const y = height - (data[i] / max) * height

        ctx.lineTo(x, y)

        // Draw point
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Stroke the line
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Fill area under the line
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.globalAlpha = 0.2
      ctx.fill()
      ctx.globalAlpha = 1
    }

    // Extract data from test history
    const downloadData = testHistory.map((result) => result.download)
    const uploadData = testHistory.map((result) => result.upload)
    const pingData = testHistory.map((result) => result.ping)

    // Draw graphs
    drawGraph(downloadCanvasRef, downloadData, "#00ff85", 1000)
    drawGraph(uploadCanvasRef, uploadData, "#00ff85", 500)
    drawGraph(pingCanvasRef, pingData, "#00ff85", 100)
  }, [testHistory])

  if (testHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground mb-2">No test results yet</p>
        <p className="text-sm text-muted-foreground">Run a speed test to see your results history</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="download" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-1 rounded-full">
          <TabsTrigger
            value="download"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ff85] data-[state=active]:to-[#38ef7d] data-[state=active]:text-white"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Download
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ff85] data-[state=active]:to-[#38ef7d] data-[state=active]:text-white"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="ping"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00ff85] data-[state=active]:to-[#38ef7d] data-[state=active]:text-white"
          >
            <Clock className="mr-2 h-4 w-4" />
            Ping
          </TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-white/30 dark:border-gray-700/30 rounded-2xl shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Download Speed</h3>
                    <p className="text-sm text-muted-foreground">Last {testHistory.length} tests</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00ff85] to-[#38ef7d] text-transparent bg-clip-text">
                      {testHistory[testHistory.length - 1].download.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Mbps</div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <canvas ref={downloadCanvasRef} className="w-full h-full" />
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-white/30 dark:border-gray-700/30 rounded-2xl shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Upload Speed</h3>
                    <p className="text-sm text-muted-foreground">Last {testHistory.length} tests</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00ff85] to-[#38ef7d] text-transparent bg-clip-text">
                      {testHistory[testHistory.length - 1].upload.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Mbps</div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <canvas ref={uploadCanvasRef} className="w-full h-full" />
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="ping" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-white/30 dark:border-gray-700/30 rounded-2xl shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Ping</h3>
                    <p className="text-sm text-muted-foreground">Last {testHistory.length} tests</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00ff85] to-[#38ef7d] text-transparent bg-clip-text">
                      {testHistory[testHistory.length - 1].ping}
                    </div>
                    <div className="text-sm text-muted-foreground">ms</div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <canvas ref={pingCanvasRef} className="w-full h-full" />
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <h3 className="text-lg font-medium mb-4">Test History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 dark:border-gray-700/20">
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Download</th>
                  <th className="text-right p-2">Upload</th>
                  <th className="text-right p-2">Ping</th>
                  <th className="text-right p-2">Server</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((result, index) => (
                  <tr key={index} className="border-b border-white/20 dark:border-gray-700/20">
                    <td className="p-2 text-sm">{result.date}</td>
                    <td className="p-2 text-sm text-right">{result.download.toFixed(2)} Mbps</td>
                    <td className="p-2 text-sm text-right">{result.upload.toFixed(2)} Mbps</td>
                    <td className="p-2 text-sm text-right">{result.ping} ms</td>
                    <td className="p-2 text-sm text-right">{result.server}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

