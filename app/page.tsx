"use client"
import { useEffect, useState } from "react"
import SpeedTest from "@/components/speed-test"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <PerformanceOptimizer />
      <AnimatedBackground />
      <SpeedTest />
    </main>
  )
}

