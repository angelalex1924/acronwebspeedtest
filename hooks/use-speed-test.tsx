"use client"

import { useState, useEffect, useCallback } from "react"
import type { Server, TestResult } from "@/types"
import {
  measurePing,
  measureDownloadSpeed,
  measureUploadSpeed,
  calculateLatencyStability,
  determineConnectionType,
  determineActivitySuitability,
} from "@/lib/speed-test-engine"

// Update the server list to include more geographically diverse options

// Server list with more geographic options
const servers: Server[] = [
  {
    id: 1,
    location: "Local Testing",
    provider: "Browser",
    distance: 0,
    ping: 5,
    url: "local",
  },
  {
    id: 2,
    location: "Frankfurt, Germany",
    provider: "AcronWeb",
    distance: 2100,
    ping: 45,
    url: "eu-central",
  },
  {
    id: 3,
    location: "London, UK",
    provider: "AcronWeb",
    distance: 2400,
    ping: 60,
    url: "eu-west",
  },
  {
    id: 4,
    location: "New York, US",
    provider: "AcronWeb",
    distance: 7900,
    ping: 120,
    url: "us-east",
  },
  {
    id: 5,
    location: "San Francisco, US",
    provider: "AcronWeb",
    distance: 10500,
    ping: 180,
    url: "us-west",
  },
  {
    id: 6,
    location: "Tokyo, Japan",
    provider: "AcronWeb",
    distance: 9300,
    ping: 220,
    url: "ap-northeast",
  },
  {
    id: 7,
    location: "Sydney, Australia",
    provider: "AcronWeb",
    distance: 16000,
    ping: 250,
    url: "ap-southeast",
  },
  {
    id: 8,
    location: "São Paulo, Brazil",
    provider: "AcronWeb",
    distance: 9600,
    ping: 190,
    url: "sa-east",
  },
]

// Mock test history
const mockTestHistory: TestResult[] = [
  {
    date: "2023-03-15 14:30",
    download: 56.78,
    upload: 15.32,
    ping: 18,
    jitter: 2,
    server: "Local Testing",
    packetLoss: 0.5,
    latencyStability: 95,
  },
  {
    date: "2023-03-14 09:15",
    download: 45.12,
    upload: 12.67,
    ping: 22,
    jitter: 3,
    server: "Local Testing",
    packetLoss: 1.2,
    latencyStability: 92,
  },
  {
    date: "2023-03-13 19:45",
    download: 62.45,
    upload: 18.91,
    ping: 15,
    jitter: 1,
    server: "Local Testing",
    packetLoss: 0.3,
    latencyStability: 97,
  },
]

// Update the useSpeedTest hook to track finalPing
export function useSpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [ping, setPing] = useState(0)
  const [finalPing, setFinalPing] = useState(0) // Add state for final ping
  const [jitter, setJitter] = useState(0)
  const [packetLoss, setPacketLoss] = useState(0)
  const [latencyStability, setLatencyStability] = useState(0)
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [testPhase, setTestPhase] = useState<"idle" | "connecting" | "download" | "upload" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [testHistory, setTestHistory] = useState<TestResult[]>(() => {
    // Try to load test history from localStorage
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("speedtest_history")
      return savedHistory ? JSON.parse(savedHistory) : mockTestHistory
    }
    return mockTestHistory
  })
  const [networkType, setNetworkType] = useState("Broadband")
  const [ipAddress, setIpAddress] = useState("Local")
  const [isp, setIsp] = useState("Browser")
  const [activitySuitability, setActivitySuitability] = useState({
    webBrowsing: "poor" as const,
    gaming: "poor" as const,
    videoStreaming: "poor" as const,
    videoCalls: "poor" as const,
  })

  // Initialize with default server
  useEffect(() => {
    if (!selectedServer && servers.length > 0) {
      setSelectedServer(servers[0])
    }

    // Try to get network info
    const fetchNetworkInfo = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        if (response.ok) {
          const data = await response.json()
          setIpAddress(data.ip || "Local")

          try {
            // Use ipapi.co to get more detailed ISP information
            const infoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`)
            if (infoResponse.ok) {
              const infoData = await infoResponse.json()
              // Improved ISP name extraction to preserve company names like "COSMOTE SA"
              let ispName = infoData.org || infoData.isp || infoData.asn || "Unknown Provider"

              // If org starts with "AS" followed by numbers, it's an ASN - try to extract the company name
              if (ispName.match(/^AS\d+\s/)) {
                // Remove the ASN prefix but keep the full company name
                ispName = ispName.replace(/^AS\d+\s/, "")
              }

              // Special case for OTENET which is now COSMOTE SA
              if (ispName.includes("OTENET") || ispName.includes("OTEnet")) {
                ispName = "COSMOTE SA"
              }

              setIsp(ispName)
            }
          } catch (e) {
            console.log("Could not fetch ISP info")
            // Try alternative API for ISP info
            try {
              const altResponse = await fetch(`https://ipinfo.io/${data.ip}/json`)
              if (altResponse.ok) {
                const altData = await altResponse.json()
                let ispName = altData.org || altData.company || "Unknown Provider"

                // If org starts with "AS" followed by numbers, it's an ASN - try to extract the company name
                if (ispName.match(/^AS\d+\s/)) {
                  // Remove the ASN prefix but keep the full company name
                  ispName = ispName.replace(/^AS\d+\s/, "")
                }

                // Special case for OTENET which is now COSMOTE SA
                if (ispName.includes("OTENET") || ispName.includes("OTEnet")) {
                  ispName = "COSMOTE SA"
                }

                setIsp(ispName)
              }
            } catch (err) {
              setIsp("Unknown Provider")
            }
          }
        }
      } catch (e) {
        console.log("Using local network information")
        setIpAddress("Local")

        // Try to get ISP info from navigator if available
        try {
          if (navigator.connection) {
            const conn = navigator.connection as any
            if (conn.type) {
              setIsp(conn.type !== "unknown" ? conn.type : "Local Network")
            } else {
              setIsp("Local Network")
            }
          } else {
            setIsp("Local Network")
          }
        } catch (err) {
          setIsp("Local Network")
        }
      }

      // Set network type using navigator.connection if available
      try {
        if (navigator.connection) {
          const conn = navigator.connection as any
          if (conn.effectiveType) {
            const connectionTypes: Record<string, string> = {
              "slow-2g": "Slow 2G",
              "2g": "2G",
              "3g": "3G",
              "4g": "4G/LTE",
              "5g": "5G/NR",
            }
            setNetworkType(connectionTypes[conn.effectiveType] || conn.effectiveType || "Broadband")
          }
        }
      } catch (e) {
        // Fallback to default
      }
    }

    fetchNetworkInfo()
  }, [selectedServer, servers])

  // Save test history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && testHistory.length > 0) {
      localStorage.setItem("speedtest_history", JSON.stringify(testHistory))
    }
  }, [testHistory])

  // Start a speed test
  const startTest = useCallback(async () => {
    if (isRunning || !selectedServer) return

    setIsRunning(true)
    setTestPhase("connecting")
    setDownloadSpeed(0)
    setUploadSpeed(0)
    setPing(0)
    setFinalPing(0) // Reset final ping
    setJitter(0)
    setProgress(0)
    setPacketLoss(0)
    setLatencyStability(0)

    try {
      // Show connecting message for a moment
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Measure ping with more iterations for better accuracy
      setTestPhase("connecting")
      const pingResult = await measurePing(15) // Increased from 12 to 15 for better accuracy
      setPing(pingResult.ping)
      setJitter(pingResult.jitter)
      setPacketLoss(pingResult.packetLoss)
      setFinalPing(pingResult.finalPing) // Store the final ping measurement

      // Calculate latency stability
      const stability = calculateLatencyStability(pingResult.ping, pingResult.jitter)
      setLatencyStability(stability)

      // Measure download speed with optimized duration
      setTestPhase("download")
      const downloadResult = await measureDownloadSpeed(20000, (speed, testProgress) => {
        // Reduced from 25000 to 20000
        setDownloadSpeed(speed)
        setProgress(testProgress)
      })
      setDownloadSpeed(downloadResult)

      // Short pause between tests
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Measure upload speed with optimized duration
      setTestPhase("upload")
      setProgress(0)
      const uploadResult = await measureUploadSpeed(20000, (speed, testProgress) => {
        // Reduced from 25000 to 20000
        setUploadSpeed(speed)
        setProgress(testProgress)
      })
      setUploadSpeed(uploadResult)

      // Determine connection type
      setNetworkType(determineConnectionType(downloadResult, uploadResult, pingResult.ping))

      // Determine activity suitability
      const suitability = determineActivitySuitability(
        downloadResult,
        uploadResult,
        pingResult.ping,
        pingResult.jitter,
        pingResult.packetLoss,
      )
      setActivitySuitability(suitability)

      // Mark test as complete
      setTestPhase("complete")

      // Add to test history
      const newResult: TestResult = {
        date: new Date().toLocaleString(),
        download: downloadResult,
        upload: uploadResult,
        ping: pingResult.ping,
        finalPing: pingResult.finalPing, // Include final ping in test history
        jitter: pingResult.jitter,
        server: selectedServer?.location || "Unknown",
        packetLoss: pingResult.packetLoss,
        latencyStability: stability,
      }

      setTestHistory((prev) => [newResult, ...prev])
    } catch (error) {
      console.error("Speed test failed:", error)
      // Show error message to user
      alert("Speed test failed. Please try again or select a different server.")
    } finally {
      setIsRunning(false)
    }
  }, [isRunning, selectedServer])

  const stopTest = useCallback(() => {
    setIsRunning(false)
    setTestPhase("idle")
    setProgress(0)
    // Reset all values when canceling
    setDownloadSpeed(0)
    setUploadSpeed(0)
    setPing(0)
    setFinalPing(0)
    setJitter(0)
    setPacketLoss(0)
    setLatencyStability(0)
  }, [])

  const selectServer = useCallback((server: Server) => {
    setSelectedServer(server)
  }, [])

  return {
    downloadSpeed,
    uploadSpeed,
    ping,
    finalPing, // Add finalPing to the returned values
    jitter,
    packetLoss,
    latencyStability,
    selectedServer,
    servers,
    testPhase,
    progress,
    testHistory,
    isRunning,
    startTest,
    stopTest,
    selectServer,
    networkType,
    ipAddress,
    isp,
    activitySuitability,
  }
}

