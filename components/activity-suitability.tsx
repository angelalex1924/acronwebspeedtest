"use client"

import { Monitor, Gamepad, Video, VideoIcon } from "lucide-react"
import { motion } from "framer-motion"

type SuitabilityLevel = "excellent" | "good" | "fair" | "poor"

interface ActivitySuitabilityProps {
  webBrowsing: SuitabilityLevel
  gaming: SuitabilityLevel
  videoStreaming: SuitabilityLevel
  videoCalls: SuitabilityLevel
}

export function ActivitySuitability({ webBrowsing, gaming, videoStreaming, videoCalls }: ActivitySuitabilityProps) {
  // Map suitability levels to colors and dot counts
  const getSuitabilityInfo = (level: SuitabilityLevel) => {
    switch (level) {
      case "excellent":
        return { color: "#82f01f", dots: 4, label: "Excellent" }
      case "good":
        return { color: "#a4ff29", dots: 3, label: "Good" }
      case "fair":
        return { color: "#FBAB7E", dots: 2, label: "Fair" }
      case "poor":
        return { color: "#ff605c", dots: 1, label: "Poor" }
    }
  }

  const activities = [
    {
      name: "Web Browsing",
      icon: <Monitor className="h-6 w-6" />,
      level: webBrowsing,
      description: "Loading websites, online shopping, social media",
    },
    {
      name: "Gaming",
      icon: <Gamepad className="h-6 w-6" />,
      level: gaming,
      description: "Online multiplayer games, cloud gaming",
    },
    {
      name: "Video Streaming",
      icon: <Video className="h-6 w-6" />,
      level: videoStreaming,
      description: "YouTube, Netflix, streaming services",
    },
    {
      name: "Video Calls",
      icon: <VideoIcon className="h-6 w-6" />,
      level: videoCalls,
      description: "Zoom, Teams, video conferencing",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6">Connection Suitability</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activities.map((activity) => {
          const { color, dots, label } = getSuitabilityInfo(activity.level)

          return (
            <div key={activity.name} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center mb-3 relative group">
                <div className="text-gray-700 group-hover:scale-110 transition-transform">{activity.icon}</div>
                {/* Add spectacular glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 blur-md transition-opacity"></div>
              </div>

              <h4 className="font-medium text-center">{activity.name}</h4>

              <div className="flex space-x-1 mt-2 mb-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < dots ? "" : "bg-gray-300"} transition-all duration-300 hover:scale-125`}
                    style={{ backgroundColor: i < dots ? color : "" }}
                  />
                ))}
              </div>

              <span className="text-sm" style={{ color }}>
                {label}
              </span>

              <p className="text-xs text-gray-600 text-center mt-2">{activity.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl">
        <h4 className="font-medium mb-2">What This Means</h4>
        <ul className="text-sm space-y-1">
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#82f01f] mr-2"></span>
            <span>
              <strong>Excellent:</strong> Perfect performance with no issues
            </span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#a4ff29] mr-2"></span>
            <span>
              <strong>Good:</strong> Works well with occasional minor issues
            </span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#FBAB7E] mr-2"></span>
            <span>
              <strong>Fair:</strong> Works with some limitations or quality reduction
            </span>
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#ff605c] mr-2"></span>
            <span>
              <strong>Poor:</strong> May not work reliably or at all
            </span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

