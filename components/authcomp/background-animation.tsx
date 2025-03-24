"use client"

import { useEffect, useState } from "react"
import { Shield, Lock, Fingerprint, Zap, Globe, Database, Key, Eye } from "lucide-react"

export default function BackgroundAnimation() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Define floating icons with their properties
  const floatingIcons = [
    { icon: <Shield className="w-5 h-5 text-[#0fad93]" />, top: "15%", left: "10%", delay: 0 },
    { icon: <Lock className="w-5 h-5 text-[#56dc21]" />, top: "20%", left: "85%", delay: 0.5 },
    { icon: <Fingerprint className="w-5 h-5 text-[#ff605c]" />, top: "75%", left: "75%", delay: 1 },
    { icon: <Zap className="w-5 h-5 text-[#ffbd44]" />, top: "80%", left: "15%", delay: 1.5 },
    { icon: <Globe className="w-5 h-5 text-[#0fad93]" />, top: "10%", left: "50%", delay: 2 },
    { icon: <Database className="w-5 h-5 text-[#56dc21]" />, top: "40%", left: "20%", delay: 2.5 },
    { icon: <Key className="w-5 h-5 text-[#ff605c]" />, top: "60%", left: "90%", delay: 3 },
    { icon: <Eye className="w-5 h-5 text-[#ffbd44]" />, top: "30%", left: "70%", delay: 3.5 },
  ]

  // Gradient blobs
  const gradientBlobs = [
    { top: "-10%", right: "-10%", width: "60%", height: "60%", colors: "from-[#0fad93]/10 to-[#56dc21]/10" },
    { bottom: "-10%", left: "-10%", width: "60%", height: "60%", colors: "from-[#ffbd44]/10 to-[#ff605c]/10" },
    { top: "30%", left: "40%", width: "40%", height: "40%", colors: "from-[#9333ea]/10 to-[#a855f7]/10" },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(135deg, #f8fbfe 0%, #e6f4f1 100%)" }}
      >
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          {gradientBlobs.map((blob, index) => (
            <div
              key={index}
              className={`absolute rounded-full bg-gradient-to-br ${blob.colors} blur-3xl`}
              style={{
                top: blob.top || "auto",
                right: blob.right || "auto",
                bottom: blob.bottom || "auto",
                left: blob.left || "auto",
                width: blob.width,
                height: blob.height,
              }}
            ></div>
          ))}
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map((item, index) => (
            <div
              key={index}
              className="absolute w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40 animate-float"
              style={{
                top: item.top,
                left: item.left,
                animationDelay: `${item.delay}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

