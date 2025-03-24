"use client"

import { motion } from "framer-motion"
import { Award, Flame, Zap, ArrowDown, ArrowUp, Clock } from "lucide-react"

interface SpeedRankProps {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
}

export function SpeedRank({ downloadSpeed, uploadSpeed, ping }: SpeedRankProps) {
  // Calculate overall score (weighted)
  const downloadScore = Math.min(downloadSpeed / 500, 1) * 100 * 0.6
  const uploadScore = Math.min(uploadSpeed / 200, 1) * 100 * 0.3
  const pingScore = Math.min(Math.max(0, (200 - ping) / 200), 1) * 100 * 0.1

  const overallScore = Math.round(downloadScore + uploadScore + pingScore)

  // Determine rank
  let rank = "Unranked"
  let rankColor = "text-gray-400"
  let rankIcon = <Award className="h-6 w-6" />

  if (overallScore >= 90) {
    rank = "Exceptional"
    rankColor = "text-[#82f01f]"
    rankIcon = <Flame className="h-6 w-6 text-[#82f01f]" />
  } else if (overallScore >= 75) {
    rank = "Excellent"
    rankColor = "text-green-500"
    rankIcon = <Zap className="h-6 w-6 text-green-500" />
  } else if (overallScore >= 60) {
    rank = "Very Good"
    rankColor = "text-blue-500"
    rankIcon = <Award className="h-6 w-6 text-blue-500" />
  } else if (overallScore >= 40) {
    rank = "Good"
    rankColor = "text-yellow-500"
    rankIcon = <Award className="h-6 w-6 text-yellow-500" />
  } else if (overallScore >= 20) {
    rank = "Average"
    rankColor = "text-orange-500"
    rankIcon = <Award className="h-6 w-6 text-orange-500" />
  } else if (overallScore > 0) {
    rank = "Below Average"
    rankColor = "text-red-500"
    rankIcon = <Award className="h-6 w-6 text-red-500" />
  }

  // Global percentile (simulated)
  const globalPercentile = Math.min(Math.round(overallScore * 0.9), 99)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <Award className="mr-2 h-5 w-5 text-[#82f01f]" />
        Speed Ranking
      </h3>

      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center mb-4 relative">
          <div
            className="absolute inset-1 rounded-full"
            style={{
              background: `conic-gradient(${overallScore > 0 ? "#82f01f" : "#e5e7eb"} ${overallScore}%, transparent 0)`,
            }}
          />
          <div className="absolute inset-3 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{overallScore}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center">
            {rankIcon}
            <h4 className={`text-2xl font-bold ml-2 ${rankColor}`}>{rank}</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">Faster than {globalPercentile}% of users worldwide</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <ArrowDown className="h-4 w-4 mr-1 text-[#82f01f]" />
              <span className="text-sm font-medium">Download</span>
            </div>
            <span className="text-sm font-medium">{Math.round(downloadScore / 0.6)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#82f01f] to-[#a4ff29] rounded-full"
              style={{ width: `${Math.round(downloadScore / 0.6)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-1 text-[#FBAB7E]" />
              <span className="text-sm font-medium">Upload</span>
            </div>
            <span className="text-sm font-medium">{Math.round(uploadScore / 0.3)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#FBAB7E] to-[#F7CE68] rounded-full"
              style={{ width: `${Math.round(uploadScore / 0.3)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-[#4158D0]" />
              <span className="text-sm font-medium">Ping</span>
            </div>
            <span className="text-sm font-medium">{Math.round(pingScore / 0.1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#4158D0] to-[#C850C0] rounded-full"
              style={{ width: `${Math.round(pingScore / 0.1)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

