"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Lock,
  UserCheck,
  Fingerprint,
  Layers,
  Globe,
  Zap,
  Sparkles,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Laptop,
  Cloud,
  Database,
  Key,
  Eye,
  ArrowRight,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ModernShowcase() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [activeFeatureSet, setActiveFeatureSet] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null

    if (isAutoRotating) {
      timerId = setInterval(() => {
        setActiveCardIndex((prev) => (prev + 1) % cards.length)
      }, 3000)
    }

    return () => {
      if (timerId) {
        clearInterval(timerId)
      }
    }
  }, [isAutoRotating])

  const handleCardHover = () => {
    setIsAutoRotating(false)
    if (autoRotateTimerRef.current) {
      clearInterval(autoRotateTimerRef.current)
    }
  }

  const handleCardLeave = () => {
    setIsAutoRotating(true)
  }

  const calculateTransform = (index: number) => {
    const isActive = index === activeCardIndex
    const baseRotateX = (mousePosition.y - 0.5) * 10
    const baseRotateY = (mousePosition.x - 0.5) * -10
    const distance = Math.abs(index - activeCardIndex)

    // More dramatic z-index separation
    const zIndex = isActive ? 0 : -distance * 20

    // Calculate horizontal and vertical offsets based on position relative to active card
    const direction = index > activeCardIndex ? 1 : -1
    const xOffset = isActive ? 0 : direction * (distance * 40)
    const yOffset = isActive ? 0 : direction * (distance * 15)

    return {
      rotateX: isActive ? baseRotateX : baseRotateX / 2,
      rotateY: isActive ? baseRotateY : baseRotateY / 2,
      translateZ: zIndex,
      translateX: xOffset,
      translateY: yOffset,
      scale: isActive ? 1 : 1 - distance * 0.1,
      opacity: isActive ? 1 : 1 - distance * 0.2,
    }
  }

  const cards = [
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Secure Authentication",
      description: "Military-grade security protocols protect your identity",
      color: "from-[#0fad93] to-[#40B3A2]",
    },
    {
      icon: <Lock className="w-8 h-8 text-white" />,
      title: "End-to-End Encryption",
      description: "Your data is encrypted at every step of the process",
      color: "from-[#56dc21] to-[#60f000]",
    },
    {
      icon: <UserCheck className="w-8 h-8 text-white" />,
      title: "Identity Verification",
      description: "Multi-step verification ensures you are who you say you are",
      color: "from-[#ff605c] to-[#ff8c89]",
    },
    {
      icon: <Fingerprint className="w-8 h-8 text-white" />,
      title: "Biometric Support",
      description: "Use your fingerprint or face to securely authenticate",
      color: "from-[#ffbd44] to-[#ffda8a]",
    },
    {
      icon: <Layers className="w-8 h-8 text-white" />,
      title: "Multi-factor Auth",
      description: "Add extra layers of security to your account",
      color: "from-[#00ca4e] to-[#56dc21]",
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Global Access",
      description: "Access your account securely from anywhere in the world",
      color: "from-[#0fad93] to-[#56dc21]",
    },
    {
      icon: <Key className="w-8 h-8 text-white" />,
      title: "Passwordless Login",
      description: "Say goodbye to passwords with modern authentication",
      color: "from-[#9333ea] to-[#a855f7]",
    },
    {
      icon: <Eye className="w-8 h-8 text-white" />,
      title: "Privacy Controls",
      description: "Full control over your data and how it's used",
      color: "from-[#3b82f6] to-[#60a5fa]",
    },
  ]

  const featureSets = [
    {
      title: "Core Features",
      features: [
        {
          icon: <Zap />,
          title: "Instant Access",
          description: "Login in seconds with our streamlined authentication process",
          gradient: "from-[#0fad93] to-[#56dc21]",
        },
        {
          icon: <Sparkles />,
          title: "Smart Login",
          description: "AI-powered security adapts to your behavior patterns",
          gradient: "from-[#ffbd44] to-[#ff605c]",
        },
        {
          icon: <Cpu />,
          title: "API Access",
          description: "Developer-friendly APIs make integration seamless",
          gradient: "from-[#0fad93] to-[#56dc21]",
        },
      ],
    },
    {
      title: "Platform Support",
      features: [
        {
          icon: <Smartphone />,
          title: "Mobile Ready",
          description: "Use on any device with our responsive design",
          gradient: "from-[#9333ea] to-[#a855f7]",
        },
        {
          icon: <Laptop />,
          title: "Cross-Platform",
          description: "Works everywhere you need it - desktop, mobile, web",
          gradient: "from-[#3b82f6] to-[#60a5fa]",
        },
        {
          icon: <Cloud />,
          title: "Cloud Sync",
          description: "Always up-to-date with real-time synchronization",
          gradient: "from-[#0fad93] to-[#56dc21]",
        },
      ],
    },
    {
      title: "Enterprise Ready",
      features: [
        {
          icon: <Database />,
          title: "Secure Storage",
          description: "Your data is protected with enterprise-grade encryption",
          gradient: "from-[#ffbd44] to-[#ff605c]",
        },
        {
          icon: <Shield />,
          title: "Compliance",
          description: "Meet regulatory requirements with our compliant solution",
          gradient: "from-[#0fad93] to-[#56dc21]",
        },
        {
          icon: <Key />,
          title: "Access Control",
          description: "Fine-grained access control for your organization",
          gradient: "from-[#9333ea] to-[#a855f7]",
        },
      ],
    },
  ]

  const handlePrevCard = () => {
    setIsAutoRotating(false)
    setActiveCardIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const handleNextCard = () => {
    setIsAutoRotating(false)
    setActiveCardIndex((prev) => (prev + 1) % cards.length)
  }

  const handleCardClick = (index: number) => {
    setActiveCardIndex(index)
    setIsAutoRotating(false)
  }

  const handleFeatureSetChange = (index: number) => {
    setActiveFeatureSet(index)
  }

  return isMobile ? null : (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[700px] bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#0fad93]/10 to-[#56dc21]/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#ffbd44]/10 to-[#ff605c]/10 blur-3xl"></div>
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#9333ea]/10 to-[#a855f7]/10 blur-3xl"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <div className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full border-4 border-[#0fad93]/20 animate-[spin_15s_linear_infinite]"></div>
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 rounded-full border-4 border-[#56dc21]/20 animate-[spin_20s_linear_infinite_reverse]"></div>
        <div className="absolute top-[60%] left-[30%] w-16 h-16 rounded-full border-4 border-[#9333ea]/20 animate-[spin_25s_linear_infinite]"></div>

        {/* Glowing orbs */}
        <div className="absolute top-[30%] right-[20%] w-6 h-6 rounded-full bg-gradient-to-r from-[#0fad93] to-[#56dc21] opacity-70 blur-sm animate-pulse"></div>
        <div className="absolute bottom-[35%] left-[25%] w-8 h-8 rounded-full bg-gradient-to-r from-[#ffbd44] to-[#ff605c] opacity-70 blur-sm animate-pulse"></div>
        <div className="absolute top-[20%] left-[40%] w-4 h-4 rounded-full bg-gradient-to-r from-[#9333ea] to-[#a855f7] opacity-70 blur-sm animate-pulse"></div>

        {/* Geometric shapes */}
        <div className="absolute top-[60%] left-[15%] w-16 h-16 rotate-45 border-2 border-white/20 backdrop-blur-sm animate-[bounce_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-[10%] right-[30%] w-20 h-20 rotate-12 border-2 border-white/20 backdrop-blur-sm animate-[bounce_8s_ease-in-out_infinite_1s]"></div>
        <div className="absolute bottom-[15%] right-[20%] w-12 h-12 rotate-[30deg] border-2 border-white/20 backdrop-blur-sm animate-[bounce_7s_ease-in-out_infinite_0.5s]"></div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      {/* Animated gradient rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
        <div className="absolute inset-0 rounded-full border-8 border-[#0fad93]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute inset-10 rounded-full border-8 border-[#56dc21]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
        <div className="absolute inset-20 rounded-full border-8 border-[#ffbd44]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
        <div className="absolute inset-30 rounded-full border-8 border-[#9333ea]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1.5s]"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* 3D Card Stack */}
        <div className="relative perspective-[1200px] w-full max-w-md h-[300px] flex items-center justify-center z-10 mb-12">
          {/* Glow effect behind cards */}
          <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-[#0fad93]/30 to-[#56dc21]/30 blur-3xl animate-pulse"></div>

          <div className="absolute inset-0 flex items-center justify-center perspective-[1500px]">
            {cards.map((card, index) => {
              const isActive = index === activeCardIndex
              return (
                <motion.div
                  key={index}
                  className={`absolute w-[280px] h-[180px] rounded-2xl bg-gradient-to-br ${card.color} shadow-xl backdrop-blur-sm p-6 flex flex-col justify-between cursor-pointer`}
                  style={{
                    transformStyle: "preserve-3d",
                    filter: isActive ? "none" : "brightness(0.8)",
                    zIndex: cards.length - Math.abs(index - activeCardIndex),
                  }}
                  animate={calculateTransform(index)}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  whileHover={{ scale: 1.05, translateZ: 20, filter: "brightness(1.1)" }}
                  onClick={() => handleCardClick(index)}
                  onMouseEnter={handleCardHover}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      {card.icon}
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-white/50"></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-lg">{card.title}</h3>
                    {index === activeCardIndex && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-white/80 text-xs mt-1"
                      >
                        {card.description}
                      </motion.p>
                    )}
                    <div className="mt-2 w-16 h-1 bg-white/50 rounded-full"></div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Card navigation controls - moved to a better position */}
          <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
            <button
              onClick={handlePrevCard}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex gap-1.5">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeCardIndex ? "bg-gradient-to-r from-[#0fad93] to-[#56dc21]" : "bg-gray-300/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextCard}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="w-full max-w-4xl mx-auto mt-16 z-20">
          {/* Feature Set Tabs */}
          <div className="flex justify-center mb-10">
            {featureSets.map((set, index) => (
              <motion.button
                key={index}
                onClick={() => handleFeatureSetChange(index)}
                className={`px-6 py-3 mx-2 rounded-full text-sm font-medium transition-all ${
                  activeFeatureSet === index
                    ? "bg-gradient-to-r from-[#0fad93] to-[#56dc21] text-white shadow-lg"
                    : "bg-white/30 backdrop-blur-sm text-gray-700 hover:bg-white/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {set.title}
              </motion.button>
            ))}
          </div>

          {/* Feature Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureSet}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {featureSets[activeFeatureSet].features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    background: "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <span className="text-white">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-sm font-medium text-[#0fad93]">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

 
      </div>

      {/* Branding - with higher z-index */}
      <div className="absolute bottom-10 text-center z-30">
     
        <motion.p
          className="text-gray-600 mt-2 max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Next-generation authentication for the modern web
        </motion.p>

      
      </div>

      {/* Enhanced floating elements */}
      <motion.div
        className="absolute top-[15%] right-[10%] z-10"
        animate={{
          rotate: [0, 5, 0, -5, 0],
          y: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0fad93]/10 to-[#56dc21]/10 backdrop-blur-md border border-white/20 shadow-lg"></div>
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] left-[10%] z-10"
        animate={{
          rotate: [0, -5, 0, 5, 0],
          y: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffbd44]/10 to-[#ff605c]/10 backdrop-blur-md border border-white/20 shadow-lg"></div>
      </motion.div>

      {/* New floating elements */}
      <motion.div
        className="absolute top-[40%] left-[20%] z-10"
        animate={{
          rotate: [0, 10, 0, -10, 0],
          scale: [1, 1.05, 1, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-16 h-16 rotate-45 bg-gradient-to-br from-[#9333ea]/10 to-[#a855f7]/10 backdrop-blur-md border border-white/20 shadow-lg"></div>
      </motion.div>

      <motion.div
        className="absolute bottom-[40%] right-[20%] z-10"
        animate={{
          x: [0, 10, 0, -10, 0],
          y: [0, -10, 0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-32 h-12 rounded-lg bg-gradient-to-br from-[#3b82f6]/10 to-[#60a5fa]/10 backdrop-blur-md border border-white/20 shadow-lg"></div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        className="absolute top-[25%] right-[25%] px-4 py-2 rounded-full bg-gradient-to-r from-[#0fad93]/80 to-[#56dc21]/80 text-white text-xs font-medium shadow-lg backdrop-blur-sm z-10"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Secure & Fast
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] left-[25%] px-4 py-2 rounded-full bg-gradient-to-r from-[#ffbd44]/80 to-[#ff605c]/80 text-white text-xs font-medium shadow-lg backdrop-blur-sm z-10"
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Enterprise Ready
      </motion.div>

      <motion.div
        className="absolute top-[60%] right-[15%] px-4 py-2 rounded-full bg-gradient-to-r from-[#9333ea]/80 to-[#a855f7]/80 text-white text-xs font-medium shadow-lg backdrop-blur-sm z-10"
        animate={{
          y: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Cross-Platform
      </motion.div>
    </div>
  )
}

