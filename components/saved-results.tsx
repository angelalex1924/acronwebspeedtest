"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Activity,
  Calendar,
  Server,
  Wifi,
  Database,
  CloudIcon as CloudCheck,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import type { SpeedTestResult } from "@/hooks/use-firestore"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SavedResultsProps {
  results: SpeedTestResult[]
}

export function SavedResults({ results }: SavedResultsProps) {
  const { user } = useAuth()
  const [selectedResult, setSelectedResult] = useState<SpeedTestResult | null>(null)

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground mb-4">You need to be logged in to view saved results</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <CloudCheck className="h-12 w-12 text-[#82f01f]/50 mb-4" />
        <p className="text-muted-foreground mb-2">No saved test results yet</p>
        <p className="text-sm text-muted-foreground mb-4">
          Complete a speed test and click "Save to Cloud" to store it permanently in your account
        </p>
        <Button variant="outline" className="rounded-full" onClick={() => (window.location.hash = "#speedtest")}>
          Run a Speed Test
        </Button>

        {/* Add a note about Firestore indexes */}
        <Alert className="mt-6 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Note about Firestore</AlertTitle>
          <AlertDescription className="text-sm">
            If you've saved results but don't see them here, you may need to create a Firestore index. Check the console
            for a link to create the required index.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-white/30 backdrop-blur-md border-white/30 rounded-2xl shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-[#82f01f] mr-2" />
                <h3 className="text-lg font-medium">Your Saved Test Results</h3>
              </div>
              <Badge variant="outline" className="bg-[#82f01f]/10 text-[#82f01f] border-[#82f01f]/30">
                Stored in Cloud
              </Badge>
            </div>

            {selectedResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Test Details</h4>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedResult(null)} className="text-sm">
                    Back to List
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <ArrowDown className="h-4 w-4 mr-1 text-[#82f01f]" />
                      <span className="text-xs font-medium">Download</span>
                    </div>
                    <div className="text-lg font-bold">
                      {selectedResult.downloadSpeed.toFixed(2)} <span className="text-xs font-normal">Mbps</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <ArrowUp className="h-4 w-4 mr-1 text-[#FBAB7E]" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                    <div className="text-lg font-bold">
                      {selectedResult.uploadSpeed.toFixed(2)} <span className="text-xs font-normal">Mbps</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <Clock className="h-4 w-4 mr-1 text-[#4158D0]" />
                      <span className="text-xs font-medium">Ping</span>
                    </div>
                    <div className="text-lg font-bold">
                      {selectedResult.ping} <span className="text-xs font-normal">ms</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <Activity className="h-4 w-4 mr-1 text-[#C850C0]" />
                      <span className="text-xs font-medium">Jitter</span>
                    </div>
                    <div className="text-lg font-bold">
                      {selectedResult.jitter} <span className="text-xs font-normal">ms</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="text-xs font-medium">Date & Time</span>
                    </div>
                    <div className="text-sm">{formatDate(selectedResult.date as Date)}</div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <Server className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="text-xs font-medium">Server</span>
                    </div>
                    <div className="text-sm">{selectedResult.server}</div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center mb-1">
                      <Wifi className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="text-xs font-medium">Network</span>
                    </div>
                    <div className="text-sm">{selectedResult.networkType || "Unknown"}</div>
                  </div>
                </div>

                {/* Additional metrics */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <h5 className="text-sm font-medium mb-2">Additional Metrics</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600">Packet Loss</div>
                      <div className="text-sm font-medium">{selectedResult.packetLoss}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Latency Stability</div>
                      <div className="text-sm font-medium">{selectedResult.latencyStability}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Download</th>
                      <th className="text-right p-2">Upload</th>
                      <th className="text-right p-2">Ping</th>
                      <th className="text-right p-2">Server</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result.id || index} className="border-b border-white/20 hover:bg-white/10">
                        <td className="p-2 text-sm">{formatDate(result.date as Date)}</td>
                        <td className="p-2 text-sm text-right">{result.downloadSpeed.toFixed(2)} Mbps</td>
                        <td className="p-2 text-sm text-right">{result.uploadSpeed.toFixed(2)} Mbps</td>
                        <td className="p-2 text-sm text-right">{result.ping} ms</td>
                        <td className="p-2 text-sm text-right">{result.server}</td>
                        <td className="p-2 text-sm text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedResult(result)}
                            className="text-xs h-7 px-2"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

