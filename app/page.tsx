import Link from "next/link"
import SpeedTest from "@/components/speed-test"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <PerformanceOptimizer />
      <AnimatedBackground />
      <div className="absolute top-4 right-4 flex space-x-3 z-10">
        <Button
          className="bg-gradient-to-r from-[#0fad93] to-[#56dc21] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button
          className="bg-gradient-to-r from-[#0fad93] to-[#56dc21] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
          asChild
        >
          <Link href="/register">Register</Link>
        </Button>
      </div>
      <SpeedTest />
    </main>
  )
}

