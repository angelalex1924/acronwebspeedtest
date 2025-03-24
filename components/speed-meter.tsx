"use client"

import { motion } from "framer-motion"

interface SpeedMeterProps {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  isRunning: boolean
}

export function SpeedMeter({ downloadSpeed, uploadSpeed, ping, isRunning }: SpeedMeterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-[#82f01f]/30 shadow-lg w-64"
    >
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Live Speed Meter</h3>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Download</span>
            <span>{downloadSpeed.toFixed(2)} Mbps</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#82f01f] to-[#a4ff29]"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((downloadSpeed / 1000) * 100, 100)}%`,
                transition: { duration: isRunning ? 0.1 : 0.5 },
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Upload</span>
            <span>{uploadSpeed.toFixed(2)} Mbps</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FBAB7E] to-[#F7CE68]"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((uploadSpeed / 500) * 100, 100)}%`,
                transition: { duration: isRunning ? 0.1 : 0.5 },
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Ping</span>
            <span>{ping} ms</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4158D0] to-[#C850C0]"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((ping / 200) * 100, 100)}%`,
                transition: { duration: isRunning ? 0.1 : 0.5 },
              }}
            />
          </div>
        </div>
      </div>

      {isRunning && (
        <div className="mt-3 flex justify-center">
          <div className="px-2 py-1 bg-[#82f01f]/20 rounded-full text-xs text-[#82f01f] animate-pulse">
            Test in progress...
          </div>
        </div>
      )}
    </motion.div>
  )
}

