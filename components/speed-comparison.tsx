"use client"

import { motion } from "framer-motion"
import { BarChart3, ArrowDown, ArrowUp } from "lucide-react"

interface SpeedComparisonProps {
  downloadSpeed: number
  uploadSpeed: number
}

export function SpeedComparison({ downloadSpeed, uploadSpeed }: SpeedComparisonProps) {
  // Average speeds by connection type
  const connectionTypes = [
    { type: "Dial-up", download: 0.056, upload: 0.048 },
    { type: "2G", download: 0.25, upload: 0.1 },
    { type: "3G", download: 3, upload: 1.5 },
    { type: "4G", download: 20, upload: 10 },
    { type: "5G", download: 150, upload: 50 },
    { type: "DSL", download: 15, upload: 5 },
    { type: "Cable", download: 100, upload: 20 },
    { type: "Fiber", download: 500, upload: 250 },
  ]

  // Find closest connection type
  let closestType = connectionTypes[0]
  let minDiff = Number.MAX_VALUE

  connectionTypes.forEach((conn) => {
    const diff = Math.abs(downloadSpeed - conn.download) + Math.abs(uploadSpeed - conn.upload)
    if (diff < minDiff) {
      minDiff = diff
      closestType = conn
    }
  })

  // Calculate where user falls compared to global averages
  const globalAvgDownload = 85 // Global average download speed in Mbps
  const globalAvgUpload = 35 // Global average upload speed in Mbps

  const downloadPercentage = Math.min(Math.round((downloadSpeed / globalAvgDownload) * 100), 300)
  const uploadPercentage = Math.min(Math.round((uploadSpeed / globalAvgUpload) * 100), 300)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <BarChart3 className="mr-2 h-5 w-5 text-[#82f01f]" />
        Speed Comparison
      </h3>

      <div className="mb-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Your connection is most similar to:</p>
          <div className="text-2xl font-bold mt-1">{closestType.type}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-sm text-gray-600 mb-1">Global Average</div>
            <div className="text-xl font-bold">{globalAvgDownload} Mbps</div>
            <div className="text-xs text-gray-500">Download</div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-sm text-gray-600 mb-1">Global Average</div>
            <div className="text-xl font-bold">{globalAvgUpload} Mbps</div>
            <div className="text-xs text-gray-500">Upload</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <ArrowDown className="h-4 w-4 mr-1 text-[#82f01f]" />
              <span className="text-sm font-medium">Your Download</span>
            </div>
            <span className="text-sm font-medium">{downloadPercentage}% of global average</span>
          </div>

          <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="h-full w-px bg-gray-400 ml-[50%]"></div>
              <div className="absolute left-[50%] top-0 transform -translate-x-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                Average
              </div>
            </div>

            <div
              className={`h-full ${downloadPercentage >= 100 ? "bg-gradient-to-r from-[#82f01f] to-[#a4ff29]" : "bg-gradient-to-r from-[#ff605c] to-[#ff8c89]"} rounded-lg flex items-center justify-end px-2`}
              style={{
                width: `${Math.min(Math.max(downloadPercentage, 5), 100)}%`,
                marginLeft: downloadPercentage < 100 ? "0" : "50%",
                marginRight: downloadPercentage >= 100 ? "0" : "50%",
                transform: downloadPercentage < 100 ? "translateX(0)" : "translateX(-50%)",
              }}
            >
              <span className="text-xs font-bold text-white">{downloadSpeed.toFixed(1)} Mbps</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-1 text-[#FBAB7E]" />
              <span className="text-sm font-medium">Your Upload</span>
            </div>
            <span className="text-sm font-medium">{uploadPercentage}% of global average</span>
          </div>

          <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="h-full w-px bg-gray-400 ml-[50%]"></div>
              <div className="absolute left-[50%] top-0 transform -translate-x-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                Average
              </div>
            </div>

            <div
              className={`h-full ${uploadPercentage >= 100 ? "bg-gradient-to-r from-[#FBAB7E] to-[#F7CE68]" : "bg-gradient-to-r from-[#ff605c] to-[#ff8c89]"} rounded-lg flex items-center justify-end px-2`}
              style={{
                width: `${Math.min(Math.max(uploadPercentage, 5), 100)}%`,
                marginLeft: uploadPercentage < 100 ? "0" : "50%",
                marginRight: uploadPercentage >= 100 ? "0" : "50%",
                transform: uploadPercentage < 100 ? "translateX(0)" : "translateX(-50%)",
              }}
            >
              <span className="text-xs font-bold text-white">{uploadSpeed.toFixed(1)} Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

