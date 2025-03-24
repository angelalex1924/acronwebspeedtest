"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Smartphone, Laptop, Tv, Gamepad, ArrowRight, ArrowDown } from "lucide-react"

interface DeviceSpeedComparisonProps {
  downloadSpeed: number
  uploadSpeed: number
}

interface DeviceRequirement {
  name: string
  icon: React.ReactNode
  downloadRequired: number
  uploadRequired: number
  activities: string[]
}

export function DeviceSpeedComparison({ downloadSpeed, uploadSpeed }: DeviceSpeedComparisonProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  const devices: DeviceRequirement[] = [
    {
      name: "Smartphone",
      icon: <Smartphone className="h-6 w-6" />,
      downloadRequired: 25,
      uploadRequired: 5,
      activities: ["Social media browsing", "HD video streaming", "Video calls", "Mobile gaming", "App downloads"],
    },
    {
      name: "Laptop/PC",
      icon: <Laptop className="h-6 w-6" />,
      downloadRequired: 50,
      uploadRequired: 10,
      activities: ["Web browsing", "4K video streaming", "Video conferencing", "Large file downloads", "Cloud backups"],
    },
    {
      name: "Smart TV",
      icon: <Tv className="h-6 w-6" />,
      downloadRequired: 35,
      uploadRequired: 3,
      activities: [
        "4K video streaming",
        "Multiple simultaneous streams",
        "Smart home integration",
        "App updates",
        "Video calls",
      ],
    },
    {
      name: "Gaming Console",
      icon: <Gamepad className="h-6 w-6" />,
      downloadRequired: 75,
      uploadRequired: 15,
      activities: [
        "Game downloads",
        "Online multiplayer gaming",
        "4K game streaming",
        "Live streaming gameplay",
        "System updates",
      ],
    },
  ]

  const getDeviceStatus = (device: DeviceRequirement) => {
    const downloadStatus = downloadSpeed >= device.downloadRequired
    const uploadStatus = uploadSpeed >= device.uploadRequired

    if (downloadStatus && uploadStatus) {
      return { status: "excellent", message: "Excellent for all activities" }
    } else if (downloadSpeed >= device.downloadRequired * 0.7 && uploadSpeed >= device.uploadRequired * 0.7) {
      return { status: "good", message: "Good for most activities" }
    } else if (downloadSpeed >= device.downloadRequired * 0.4 && uploadSpeed >= device.uploadRequired * 0.4) {
      return { status: "fair", message: "Fair for basic activities" }
    } else {
      return { status: "poor", message: "May struggle with most activities" }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-[#82f01f]"
      case "good":
        return "text-[#a4ff29]"
      case "fair":
        return "text-[#FBAB7E]"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-[#82f01f]/10"
      case "good":
        return "bg-[#a4ff29]/10"
      case "fair":
        return "bg-[#FBAB7E]/10"
      case "poor":
        return "bg-red-500/10"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
      >
        <h3 className="text-xl font-bold mb-4">Device Compatibility</h3>
        <p className="text-gray-600 mb-6">See how your internet speed performs with different devices and activities</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {devices.map((device) => {
            const { status, message } = getDeviceStatus(device)
            const statusColor = getStatusColor(status)
            const statusBg = getStatusBg(status)

            return (
              <motion.div
                key={device.name}
                whileHover={{ scale: 1.03 }}
                className={`bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50 cursor-pointer ${selectedDevice === device.name ? "ring-2 ring-[#82f01f]" : ""}`}
                onClick={() => setSelectedDevice(device.name === selectedDevice ? null : device.name)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mb-3">
                    {device.icon}
                  </div>
                  <h4 className="font-medium mb-2">{device.name}</h4>
                  <div className={`text-xs px-2 py-1 rounded-full ${statusBg} ${statusColor} mb-2`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                  <p className="text-xs text-gray-500">{message}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
        >
          {devices
            .filter((d) => d.name === selectedDevice)
            .map((device) => {
              const { status } = getDeviceStatus(device)
              const statusColor = getStatusColor(status)

              return (
                <div key={device.name}>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mr-3">
                      {device.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{device.name} Requirements</h3>
                      <p className="text-sm text-gray-600">Recommended speeds for optimal performance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <ArrowDown className="h-4 w-4 mr-1 text-[#82f01f]" />
                        Download Speed
                      </h4>
                      <div className="flex items-end gap-4">
                        <div>
                          <div className="text-2xl font-bold">{downloadSpeed.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">Your Speed (Mbps)</div>
                        </div>
                        <div className="text-xl text-gray-400 mb-1">vs</div>
                        <div>
                          <div className="text-2xl font-bold">{device.downloadRequired}</div>
                          <div className="text-xs text-gray-500">Required (Mbps)</div>
                        </div>
                      </div>
                      <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${downloadSpeed >= device.downloadRequired ? "bg-[#82f01f]" : "bg-[#FBAB7E]"}`}
                          style={{ width: `${Math.min((downloadSpeed / device.downloadRequired) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <ArrowRight className="h-4 w-4 mr-1 text-[#82f01f]" />
                        Upload Speed
                      </h4>
                      <div className="flex items-end gap-4">
                        <div>
                          <div className="text-2xl font-bold">{uploadSpeed.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">Your Speed (Mbps)</div>
                        </div>
                        <div className="text-xl text-gray-400 mb-1">vs</div>
                        <div>
                          <div className="text-2xl font-bold">{device.uploadRequired}</div>
                          <div className="text-xs text-gray-500">Required (Mbps)</div>
                        </div>
                      </div>
                      <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${uploadSpeed >= device.uploadRequired ? "bg-[#82f01f]" : "bg-[#FBAB7E]"}`}
                          style={{ width: `${Math.min((uploadSpeed / device.uploadRequired) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Common Activities:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {device.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2"
                        >
                          <div className={`w-2 h-2 rounded-full ${statusColor} mr-2`}></div>
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
        </motion.div>
      )}
    </div>
  )
}

