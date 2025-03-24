"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Wifi, Download, Upload, Clock, Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface SpeedInsightsProps {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter: number
  packetLoss: number
  latencyStability: number
}

export function SpeedInsights({
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  packetLoss,
  latencyStability,
}: SpeedInsightsProps) {
  // Calculate ratings
  const downloadRating = getRating(downloadSpeed, 0, 1000)
  const uploadRating = getRating(uploadSpeed, 0, 500)
  const pingRating = getRating(ping, 100, 0, true) // Reverse scale for ping (lower is better)
  const jitterRating = getRating(jitter, 50, 0, true) // Reverse scale for jitter (lower is better)
  const packetLossRating = getRating(packetLoss, 10, 0, true) // Reverse scale for packet loss (lower is better)
  const latencyStabilityRating = getRating(latencyStability, 0, 100)

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    downloadRating * 0.3 +
      uploadRating * 0.2 +
      pingRating * 0.2 +
      jitterRating * 0.1 +
      packetLossRating * 0.1 +
      latencyStabilityRating * 0.1,
  )

  // Get recommendations based on scores
  const recommendations = getRecommendations(downloadRating, uploadRating, pingRating, jitterRating, packetLossRating)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#82f01f] to-[#a4ff29] flex items-center justify-center text-white text-2xl font-bold mr-4">
              {overallScore}
            </div>
            <div>
              <h3 className="text-xl font-bold">Overall Rating</h3>
              <p className="text-sm text-gray-600">
                {overallScore >= 80
                  ? "Excellent"
                  : overallScore >= 60
                    ? "Good"
                    : overallScore >= 40
                      ? "Average"
                      : "Poor"}{" "}
                connection quality
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            {getScoreIndicator(downloadRating, <Download className="h-4 w-4" />)}
            {getScoreIndicator(uploadRating, <Upload className="h-4 w-4" />)}
            {getScoreIndicator(pingRating, <Clock className="h-4 w-4" />)}
            {getScoreIndicator(jitterRating, <Activity className="h-4 w-4" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RatingCard
            title="Download"
            value={`${downloadSpeed.toFixed(2)} Mbps`}
            rating={downloadRating}
            icon={<Download className="h-5 w-5 text-[#82f01f]" />}
          />
          <RatingCard
            title="Upload"
            value={`${uploadSpeed.toFixed(2)} Mbps`}
            rating={uploadRating}
            icon={<Upload className="h-5 w-5 text-[#82f01f]" />}
          />
          <RatingCard
            title="Ping"
            value={`${ping} ms`}
            rating={pingRating}
            icon={<Clock className="h-5 w-5 text-[#82f01f]" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RatingCard
            title="Jitter"
            value={`${jitter} ms`}
            rating={jitterRating}
            icon={<Activity className="h-5 w-5 text-[#82f01f]" />}
          />
          <RatingCard
            title="Packet Loss"
            value={`${packetLoss}%`}
            rating={packetLossRating}
            icon={<AlertTriangle className="h-5 w-5 text-[#82f01f]" />}
          />
          <RatingCard
            title="Latency Stability"
            value={`${latencyStability}%`}
            rating={latencyStabilityRating}
            icon={<Wifi className="h-5 w-5 text-[#82f01f]" />}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
      >
        <h3 className="text-xl font-bold mb-4">Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start">
              {rec.type === "good" ? (
                <CheckCircle className="h-5 w-5 text-[#82f01f] mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{rec.title}</p>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
      >
        <h3 className="text-xl font-bold mb-4">Connection Analysis</h3>
        <p className="text-gray-600 mb-4">
          Based on your test results, here's an analysis of your internet connection:
        </p>

        <div className="space-y-2">
          <div>
            <h4 className="font-medium">Suitable for:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {getSuitabilityBadge("Web Browsing", downloadSpeed >= 5, true)}
              {getSuitabilityBadge("Video Streaming", downloadSpeed >= 25, downloadSpeed >= 5)}
              {getSuitabilityBadge("4K Streaming", downloadSpeed >= 35, downloadSpeed >= 15)}
              {getSuitabilityBadge(
                "Video Calls",
                downloadSpeed >= 3 && uploadSpeed >= 3 && ping <= 100,
                downloadSpeed >= 1.5 && uploadSpeed >= 1.5 && ping <= 150,
              )}
              {getSuitabilityBadge(
                "Online Gaming",
                ping <= 50 && jitter <= 10 && packetLoss <= 2,
                ping <= 100 && jitter <= 20 && packetLoss <= 5,
              )}
              {getSuitabilityBadge("Large Downloads", downloadSpeed >= 50, downloadSpeed >= 20)}
              {getSuitabilityBadge("Cloud Backup", uploadSpeed >= 10, uploadSpeed >= 3)}
              {getSuitabilityBadge(
                "Remote Work",
                downloadSpeed >= 10 && uploadSpeed >= 5 && ping <= 100,
                downloadSpeed >= 5 && uploadSpeed >= 2 && ping <= 150,
              )}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Connection Type:</h4>
            <p className="text-sm text-gray-600 mt-1">
              {downloadSpeed >= 1000
                ? "Fiber Gigabit"
                : downloadSpeed >= 100
                  ? "High-speed Broadband/Fiber"
                  : downloadSpeed >= 25
                    ? "Standard Broadband"
                    : downloadSpeed >= 5
                      ? "Basic Broadband"
                      : "Slow Connection / Mobile Data"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function RatingCard({
  title,
  value,
  rating,
  icon,
}: { title: string; value: string; rating: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-6 rounded-full ${i < Math.ceil(rating / 20) ? "bg-[#82f01f]" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function getScoreIndicator(score: number, icon: React.ReactNode) {
  let bgColor = "bg-red-500"
  if (score >= 80) bgColor = "bg-[#82f01f]"
  else if (score >= 60) bgColor = "bg-yellow-500"
  else if (score >= 40) bgColor = "bg-orange-500"

  return <div className={`${bgColor} rounded-full p-2 text-white`}>{icon}</div>
}

function getRating(value: number, min: number, max: number, reverse = false): number {
  // Calculate percentage between min and max
  let percentage = ((value - min) / (max - min)) * 100

  // Clamp between 0 and 100
  percentage = Math.max(0, Math.min(100, percentage))

  // Reverse if needed (for metrics where lower is better)
  if (reverse) {
    percentage = 100 - percentage
  }

  return Math.round(percentage)
}

function getRecommendations(
  downloadRating: number,
  uploadRating: number,
  pingRating: number,
  jitterRating: number,
  packetLossRating: number,
) {
  const recommendations: { type: "good" | "bad"; title: string; description: string }[] = []

  // Add recommendations based on ratings
  if (downloadRating < 40) {
    recommendations.push({
      type: "bad",
      title: "Slow download speed",
      description:
        "Your download speed is below average. Consider upgrading your internet plan or checking for network issues.",
    })
  } else if (downloadRating >= 80) {
    recommendations.push({
      type: "good",
      title: "Excellent download speed",
      description:
        "Your download speed is excellent and suitable for all online activities including 4K streaming and large file downloads.",
    })
  }

  if (uploadRating < 40) {
    recommendations.push({
      type: "bad",
      title: "Slow upload speed",
      description: "Your upload speed is below average. This may affect video calls, file sharing, and cloud backups.",
    })
  } else if (uploadRating >= 80) {
    recommendations.push({
      type: "good",
      title: "Excellent upload speed",
      description:
        "Your upload speed is excellent and suitable for video conferencing, live streaming, and cloud backups.",
    })
  }

  if (pingRating < 40) {
    recommendations.push({
      type: "bad",
      title: "High latency (ping)",
      description: "Your connection has high latency. This may cause lag in online gaming and video calls.",
    })
  } else if (pingRating >= 80) {
    recommendations.push({
      type: "good",
      title: "Low latency (ping)",
      description:
        "Your connection has low latency, which is excellent for real-time applications like gaming and video calls.",
    })
  }

  if (jitterRating < 40) {
    recommendations.push({
      type: "bad",
      title: "High jitter",
      description:
        "Your connection has inconsistent latency. This may cause stuttering in video calls and online gaming.",
    })
  }

  if (packetLossRating < 40) {
    recommendations.push({
      type: "bad",
      title: "High packet loss",
      description:
        "Your connection is dropping data packets. This can cause disconnections and poor quality in real-time applications.",
    })
  }

  // If all ratings are good, add a general positive recommendation
  if (recommendations.length === 0 || (recommendations.length === 1 && recommendations[0].type === "good")) {
    recommendations.push({
      type: "good",
      title: "Well-balanced connection",
      description: "Your internet connection is well-balanced and suitable for most online activities.",
    })
  }

  return recommendations
}

function getSuitabilityBadge(activity: string, isGood: boolean, isOk: boolean) {
  let bgColor = "bg-red-500"
  let textColor = "text-white"

  if (isGood) {
    bgColor = "bg-[#82f01f]/20"
    textColor = "text-gray-800"
  } else if (isOk) {
    bgColor = "bg-yellow-500/20"
    textColor = "text-gray-800"
  } else {
    bgColor = "bg-red-500/20"
    textColor = "text-gray-800"
  }

  return (
    <div className={`${bgColor} ${textColor} text-xs rounded-full px-3 py-1 flex items-center justify-center`}>
      {activity} {isGood ? "✓" : isOk ? "~" : "✗"}
    </div>
  )
}

