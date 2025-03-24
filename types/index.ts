export interface Server {
  id: number
  location: string
  provider: string
  distance: number
  ping: number
  url: string
}

export interface TestResult {
  date: string
  download: number
  upload: number
  ping: number
  jitter: number
  server: string
  packetLoss?: number
  latencyStability?: number
}

