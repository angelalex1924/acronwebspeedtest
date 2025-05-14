// Define the TestResult type for the speed test history
export interface TestResult {
  date: string
  download: number
  upload: number
  ping: number
  jitter: number
  server: string
  packetLoss: number
  latencyStability: number
}

// Define the SpeedTestResult type for Firestore
export interface SpeedTestResult {
  id?: string
  userId: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter: number
  server: string
  packetLoss: number
  latencyStability: number
  date: Date
  deviceType?: string
  networkType?: string
  isp?: string
}

