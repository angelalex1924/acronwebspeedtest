"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gauge } from "@/components/gauge"
import { ServerSelector } from "@/components/server-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Wifi,
  ArrowDown,
  ArrowUp,
  Clock,
  Zap,
  Activity,
  Network,
  Repeat,
  Award,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Globe,
  Rocket,
  Cpu,
  Database,
  LogOut,
  User,
  Settings,
  ChevronDown,
  LogIn,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSpeedTest } from "@/hooks/use-speed-test"
import { Logo } from "@/components/logo"
import { NetworkCard } from "@/components/network-card"
import { FloatingParticles } from "@/components/floating-particles"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ConfettiEffect } from "@/components/confetti-effect"
import { SimpleShareButton } from "@/components/simple-share-button"
import { ProviderRating } from "@/components/provider-rating"
import { CookieConsent } from "@/components/cookie-consent"
import { InlineProviderRating } from "@/components/inline-provider-rating"
import { useAuth } from "@/context/auth-context"
import { useFirestore } from "@/hooks/use-firestore"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useThrottle } from "@/hooks/use-throttle"

// Dynamically import components that aren't needed immediately
const ResultsGraph = dynamic(
  () => import("@/components/results-graph").then((mod) => ({ default: mod.ResultsGraph })),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">Loading results...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
)

const SpeedInsights = dynamic(
  () => import("@/components/speed-insights").then((mod) => ({ default: mod.SpeedInsights })),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">Loading insights...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
)

const DeviceSpeedComparison = dynamic(
  () => import("@/components/device-speed-comparison").then((mod) => ({ default: mod.DeviceSpeedComparison })),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">Loading comparison...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
)

const SpeedRank = dynamic(() => import("@/components/speed-rank").then((mod) => ({ default: mod.SpeedRank })), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 w-full bg-gray-200 rounded"></div>
        <p className="mt-4 text-gray-500">Loading ranking...</p>
      </div>
    </div>
  ),
  ssr: false,
})

const SpeedComparison = dynamic(
  () => import("@/components/speed-comparison").then((mod) => ({ default: mod.SpeedComparison })),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">Loading comparison...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
)

const ActivitySuitability = dynamic(
  () => import("@/components/activity-suitability").then((mod) => ({ default: mod.ActivitySuitability })),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">Loading suitability...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
)

// Add a new component for displaying saved test results
const SavedResults = dynamic(
  () => import("@/components/saved-results").then((mod) => ({ default: mod.SavedResults })),
  {
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-200 rounded"></div>
          <p className="mt-4 text-gray-500">Loading saved results...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
)

export default function SpeedTest() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showConfetti, setShowConfetti] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [showProviderRating, setShowProviderRating] = useState(false)
  const [resultSaved, setResultSaved] = useState(false)
  const { user, logout, loading } = useAuth()
  const { saveTestResult, testResults, fetchTestResults } = useFirestore()
  const router = useRouter()

  // Memoize the first name calculation to prevent unnecessary recalculations
  const firstName = useMemo(() => {
    if (!user) return ""

    if (user.displayName) {
      return user.displayName.split(" ")[0]
    } else if (user.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }, [user])

  const {
    downloadSpeed,
    uploadSpeed,
    ping,
    finalPing,
    jitter,
    selectedServer,
    servers,
    testPhase,
    progress,
    testHistory,
    startTest,
    stopTest,
    selectServer,
    isRunning,
    packetLoss,
    latencyStability,
    networkType,
    ipAddress,
    isp,
    activitySuitability,
  } = useSpeedTest()

  // Throttle progress updates to improve performance
  const throttledProgress = useThrottle(progress, 100)

  useEffect(() => {
    setMounted(true)
    // Simulate a shorter loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Show confetti when test completes
  useEffect(() => {
    if (testPhase === "complete" && !testCompleted) {
      setShowConfetti(true)
      setTestCompleted(true)
      setResultSaved(false)

      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)

      return () => clearTimeout(timer)
    }

    if (testPhase !== "complete") {
      setTestCompleted(false)
    }
  }, [testPhase, testCompleted])

  // Add this useEffect to fetch results when the component mounts
  useEffect(() => {
    if (user) {
      fetchTestResults()
    }
  }, [user, fetchTestResults])

  const handleStartTest = () => {
    startTest()
    setTestCompleted(false)
    setResultSaved(false)
  }

  // Function to navigate to a page
  const navigateTo = (path: string) => {
    router.push(path)
  }

  // Function to save test result to Firestore
  const handleSaveResult = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your test results",
        variant: "destructive",
      })
      return
    }

    if (resultSaved) {
      toast({
        title: "Already Saved",
        description: "This test result has already been saved",
      })
      return
    }

    const testData = {
      downloadSpeed,
      uploadSpeed,
      ping: finalPing || ping,
      jitter,
      server: selectedServer?.location || "Unknown",
      packetLoss,
      latencyStability,
      deviceType: navigator.userAgent,
      networkType,
      isp,
    }

    const resultId = await saveTestResult(testData)

    if (resultId) {
      setResultSaved(true)
      toast({
        title: "Test Result Saved",
        description: "Your speed test result has been saved successfully",
      })

      // Explicitly fetch results after saving
      fetchTestResults()

      // Switch to the saved tab to show the results
      const savedTab = document.querySelector('[data-value="saved"]') as HTMLElement
      if (savedTab) {
        savedTab.click()
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to save test result. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] flex flex-col items-center justify-center">
        <div className="text-center">
          <Logo className="mx-auto mb-8" />
          <div className="relative w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#82f01f] to-[#a4ff29] animate-pulse"
              style={{ width: "100%", animation: "pulse 1.5s infinite" }}
            ></div>
          </div>
          <p className="mt-4 text-gray-600">Initializing Speed Test...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] flex flex-col items-center justify-center overflow-hidden relative"
    >
      {/* Toaster for notifications */}
      <Toaster />

      {/* Confetti effect when test completes */}
      {showConfetti && <ConfettiEffect isActive={showConfetti} />}

      {/* Animated background */}
      <FloatingParticles />

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#82f01f]/10 to-[#a4ff29]/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#4158D0]/10 to-[#C850C0]/10 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Logo className="h-12 w-auto" />

        <div className="flex items-center gap-4">
          {!isMobile && (
            <>
              <Link
                href="/privacy-policy"
                className="text-sm font-medium text-gray-600 hover:text-[#82f01f] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm font-medium text-gray-600 hover:text-[#82f01f] transition-colors">
                Terms of Use
              </Link>
            </>
          )}

          {/* Auth Section */}
          {loading ? (
            // Loading state
            <div className="h-10 w-32 bg-gray-200/50 animate-pulse rounded-full"></div>
          ) : user ? (
            // Logged in state - Modern and spectacular design
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white/80 backdrop-blur-sm border border-[#82f01f]/30 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full pl-3 pr-4 h-11">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 border-2 border-[#82f01f]">
                        <AvatarImage src={user.photoURL || ""} alt={firstName} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-[#82f01f] to-[#a4ff29] text-white font-medium">
                          {firstName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium text-gray-800 max-w-[100px] truncate">{firstName}</span>
                        <span className="text-xs text-gray-500">Account</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 bg-white/90 backdrop-blur-md border border-[#82f01f]/20 shadow-xl rounded-xl"
                >
                  <DropdownMenuLabel className="text-[#82f01f] font-medium">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#82f01f]/10" />
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-[#82f01f]/10 cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4 text-[#82f01f]" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-[#82f01f]/10 cursor-pointer">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4 text-[#82f01f]" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#82f01f]/10" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="rounded-lg hover:bg-red-50 text-red-600 cursor-pointer flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            // Logged out state - Modern and spectacular design
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button
                asChild
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10 hover:text-[#82f01f] transition-all duration-300 shadow-md hover:shadow-lg rounded-full px-5"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>

              <Button
                asChild
                className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-full px-5 relative overflow-hidden group"
              >
                <Link href="/register">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#82f01f]/0 via-white/20 to-[#82f01f]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative z-10">Register</span>
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#82f01f] to-[#a4ff29] text-transparent bg-clip-text mb-4">
            Test Your Internet Speed
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get accurate measurements of your download speed, upload speed, ping, and jitter with our advanced testing
            technology
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-[#82f01f] text-[#82f01f]">
              <Zap className="w-3 h-3 mr-1" /> Real-time Tests
            </Badge>
            <Badge variant="outline" className="border-[#82f01f] text-[#82f01f]">
              <Globe className="w-3 h-3 mr-1" /> Global Servers
            </Badge>
            <Badge variant="outline" className="border-[#82f01f] text-[#82f01f]">
              <Activity className="w-3 h-3 mr-1" /> Advanced Metrics
            </Badge>
            <Badge variant="outline" className="border-[#82f01f] text-[#82f01f]">
              <Sparkles className="w-3 h-3 mr-1" /> Interactive UI
            </Badge>
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="border-0 overflow-hidden bg-white/70 backdrop-blur-xl shadow-xl shadow-[#82f01f]/5 rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="speedtest" className="w-full">
                <TabsList
                  className={`grid w-full ${isMobile ? "grid-cols-4" : "grid-cols-6"} mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-full`}
                >
                  <TabsTrigger
                    value="speedtest"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <Wifi className="mr-2 h-4 w-4" />
                    {!isMobile && "Speed Test"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    {!isMobile && "Results"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="insights"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    {!isMobile && "Insights"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    {!isMobile && "Cloud Saved"}
                  </TabsTrigger>
                  {!isMobile && (
                    <>
                      <TabsTrigger
                        value="devices"
                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                      >
                        <Network className="mr-2 h-4 w-4" />
                        Devices
                      </TabsTrigger>
                      <TabsTrigger
                        value="ranking"
                        className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                      >
                        <Award className="mr-2 h-4 w-4" />
                        Ranking
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>

                <TabsContent value="speedtest" className="mt-0">
                  {/* Alert for real tests */}
                  {!testCompleted && !isRunning && (
                    <Alert className="mb-6 border-blue-300 bg-blue-50">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      <AlertTitle className="text-blue-700">Real Network Tests</AlertTitle>
                      <AlertDescription className="text-blue-600">
                        This app now performs real network tests using actual servers. Results will vary based on your
                        current connection.
                      </AlertDescription>
                    </Alert>
                  )}

                  {testCompleted && (
                    <Alert
                      className={`mb-6 ${downloadSpeed > 50 ? "border-green-300 bg-green-50" : "border-orange-300 bg-orange-50"}`}
                    >
                      {downloadSpeed > 50 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      <AlertTitle className={downloadSpeed > 50 ? "text-green-700" : "text-orange-700"}>
                        {downloadSpeed > 50 ? "Great Connection!" : "Connection Analysis"}
                      </AlertTitle>
                      <AlertDescription className={downloadSpeed > 50 ? "text-green-600" : "text-orange-600"}>
                        {downloadSpeed > 50
                          ? `Your download speed of ${downloadSpeed.toFixed(2)} Mbps is good for most online activities.`
                          : `Your download speed of ${downloadSpeed.toFixed(2)} Mbps may limit some online activities.`}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={testPhase}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="w-full mb-4"
                        >
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-inner">
                            <Gauge
                              value={
                                testPhase === "download" ? downloadSpeed : testPhase === "upload" ? uploadSpeed : 0
                              }
                              max={testPhase === "download" ? 1000 : 500}
                              label={
                                testPhase === "download" ? "Download" : testPhase === "upload" ? "Upload" : "Ready"
                              }
                              units="Mbps"
                              progress={throttledProgress}
                              phase={testPhase}
                              type={testPhase === "upload" ? "upload" : "download"}
                            />
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex gap-4 mt-4">
                        <Button
                          onClick={handleStartTest}
                          disabled={isRunning || !selectedServer}
                          size={isMobile ? "default" : "lg"}
                          className={cn(
                            "bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white border-0 shadow-lg shadow-[#82f01f]/20",
                            "transition-all duration-300 ease-out rounded-full",
                            (isRunning || !selectedServer) && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {isRunning ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2">
                                <Repeat className="h-4 w-4" />
                              </span>
                              Testing...
                            </span>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-4 w-4" />
                              Start Test
                            </>
                          )}
                        </Button>
                        {isRunning && (
                          <Button
                            onClick={stopTest}
                            variant="outline"
                            size={isMobile ? "default" : "lg"}
                            className="border-[#82f01f]/50 text-[#82f01f] hover:bg-[#82f01f]/10 rounded-full"
                          >
                            Cancel
                          </Button>
                        )}

                        {/* Save Result Button */}
                        {testPhase === "complete" && user && (
                          <Button
                            onClick={handleSaveResult}
                            disabled={resultSaved}
                            variant="outline"
                            size={isMobile ? "default" : "lg"}
                            className={cn(
                              "border-[#82f01f]/50 text-[#82f01f] hover:bg-[#82f01f]/10 rounded-full",
                              resultSaved && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <Database className="mr-2 h-4 w-4" />
                            {resultSaved ? "Saved to Cloud" : "Save to Cloud"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                          className="bg-white/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/30 shadow-md hover:shadow-lg transition-shadow hover:bg-[#82f01f]/10"
                        >
                          <div className="flex items-center mb-2">
                            <ArrowDown className="h-4 w-4 mr-2 text-[#82f01f]" />
                            <span className="text-sm font-medium text-[#82f01f]">Download</span>
                          </div>
                          <div className="text-xl md:text-3xl font-bold">
                            {downloadSpeed.toFixed(2)}{" "}
                            <span className="text-sm md:text-lg font-normal text-muted-foreground">Mbps</span>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="bg-white/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/30 shadow-md hover:shadow-lg transition-shadow hover:bg-[#FBAB7E]/10"
                        >
                          <div className="flex items-center mb-2">
                            <ArrowUp className="h-4 w-4 mr-2 text-[#FBAB7E]" />
                            <span className="text-sm font-medium text-[#FBAB7E]">Upload</span>
                          </div>
                          <div className="text-xl md:text-3xl font-bold">
                            {uploadSpeed.toFixed(2)}{" "}
                            <span className="text-sm md:text-lg font-normal text-muted-foreground">Mbps</span>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="bg-white/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/30 shadow-md hover:shadow-lg transition-shadow hover:bg-[#4158D0]/10"
                        >
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-[#4158D0]" />
                            <span className="text-sm font-medium text-[#4158D0]">Ping</span>
                          </div>
                          <div className="text-xl md:text-3xl font-bold">
                            {ping} <span className="text-sm md:text-lg font-normal text-muted-foreground">ms</span>
                          </div>
                          {testPhase === "complete" && finalPing > 0 && (
                            <div className="text-xs text-gray-500 mt-1">Final: {finalPing} ms</div>
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="bg-white/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/30 shadow-md hover:shadow-lg transition-shadow hover:bg-[#C850C0]/10"
                        >
                          <div className="flex items-center mb-2">
                            <Activity className="h-4 w-4 mr-2 text-[#C850C0]" />
                            <span className="text-sm font-medium text-[#C850C0]">Jitter</span>
                          </div>
                          <div className="text-xl md:text-3xl font-bold">
                            {jitter} <span className="text-sm md:text-lg font-normal text-muted-foreground">ms</span>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-white/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/30 shadow-md hover:bg-[#00f2fe]/10"
                      >
                        <ServerSelector
                          servers={servers}
                          selectedServer={selectedServer}
                          onSelectServer={selectServer}
                          disabled={isRunning}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Activity Suitability */}
                  {testPhase === "complete" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="mt-6"
                    >
                      <ActivitySuitability
                        webBrowsing={activitySuitability.webBrowsing}
                        gaming={activitySuitability.gaming}
                        videoStreaming={activitySuitability.videoStreaming}
                        videoCalls={activitySuitability.videoCalls}
                      />
                    </motion.div>
                  )}

                  {/* Add this after the Activity Suitability section */}
                  {testPhase === "complete" && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-sm text-gray-600">
                        This test result is temporarily stored in your session. Click "Save to Cloud" to permanently
                        store it in your account.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Saved results can be viewed in the "Cloud Saved" tab.
                      </p>
                    </motion.div>
                  )}

                  {/* Additional network information cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
                  >
                    <NetworkCard
                      icon={<Network className="h-5 w-5 text-[#F7CE68]" />}
                      title="Network Type"
                      value={networkType}
                      description="Your current connection type"
                    />
                    <NetworkCard
                      icon={<Database className="h-5 w-5 text-[#4facfe]" />}
                      title="ISP"
                      value={isp}
                      description="Your internet service provider"
                    />
                    <NetworkCard
                      icon={<Cpu className="h-5 w-5 text-[#f093fb]" />}
                      title="IP Address"
                      value={ipAddress}
                      description="Your public IP address"
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                  <ResultsGraph testHistory={testHistory} />
                </TabsContent>

                <TabsContent value="insights" className="mt-0">
                  <div className="mt-6">
                    <SpeedInsights
                      downloadSpeed={downloadSpeed}
                      uploadSpeed={uploadSpeed}
                      ping={ping}
                      jitter={jitter}
                      packetLoss={packetLoss}
                      latencyStability={latencyStability}
                    />
                  </div>
                </TabsContent>

                {/* New tab for saved results */}
                <TabsContent value="saved" className="mt-0">
                  <SavedResults results={testResults} />
                </TabsContent>

                {!isMobile && (
                  <>
                    <TabsContent value="devices" className="mt-0">
                      <DeviceSpeedComparison downloadSpeed={downloadSpeed} uploadSpeed={uploadSpeed} />
                    </TabsContent>

                    <TabsContent value="ranking" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SpeedRank downloadSpeed={downloadSpeed} uploadSpeed={uploadSpeed} ping={ping} />
                        <SpeedComparison downloadSpeed={downloadSpeed} uploadSpeed={uploadSpeed} />
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-6 flex flex-col items-center gap-4">
          {testPhase === "complete" && (
            <>
              <SimpleShareButton
                downloadSpeed={downloadSpeed}
                uploadSpeed={uploadSpeed}
                ping={ping}
                finalPing={finalPing}
                jitter={jitter}
                server={selectedServer?.location || "Unknown"}
              />

              {/* Inline Provider Rating */}
              <InlineProviderRating providerName={isp} />
            </>
          )}
        </div>

        {/* Provider Rating Modal */}
        <ProviderRating
          providerName={isp}
          isVisible={showProviderRating}
          onClose={() => setShowProviderRating(false)}
        />
      </div>

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Footer */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 mt-8 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Acron Web – Sole Proprietorship. All rights reserved.
        </p>
        {isMobile && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex justify-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-xs font-medium text-gray-600 hover:text-[#82f01f] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs font-medium text-gray-600 hover:text-[#82f01f] transition-colors">
                Terms of Use
              </Link>
            </div>

            {user ? (
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10"
                >
                  <Link href="/profile">
                    <User className="mr-1 h-3 w-3" />
                    Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10"
                >
                  <Link href="/settings">
                    <Settings className="mr-1 h-3 w-3" />
                    Settings
                  </Link>
                </Button>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                  className="text-xs border-red-300 text-red-500 hover:bg-red-50"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="text-xs bg-gradient-to-r from-[#82f01f] to-[#a4ff29] text-white">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

