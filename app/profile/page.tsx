"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFirestore } from "@/hooks/use-firestore"
import Link from "next/link"
import {
  User,
  ArrowLeft,
  Shield,
  Clock,
  Activity,
  Award,
  CheckCircle,
  AlertTriangle,
  Wifi,
  Database,
  BarChart3,
  Calendar,
} from "lucide-react"
import { updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { testResults } = useFirestore()
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      setDisplayName(user.displayName || "")
      setPhotoURL(user.photoURL || "")
    }
  }, [user])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/login")
    }
  }, [mounted, loading, user, router])

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError("")

    try {
      await updateProfile(auth.currentUser!, {
        displayName,
        photoURL,
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaveError("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate stats from test results
  const calculateStats = () => {
    if (!testResults || testResults.length === 0) {
      return {
        avgDownload: 0,
        avgUpload: 0,
        avgPing: 0,
        maxDownload: 0,
        totalTests: 0,
        lastTest: null,
      }
    }

    const totalDownload = testResults.reduce((sum, test) => sum + test.downloadSpeed, 0)
    const totalUpload = testResults.reduce((sum, test) => sum + test.uploadSpeed, 0)
    const totalPing = testResults.reduce((sum, test) => sum + test.ping, 0)
    const maxDownload = Math.max(...testResults.map((test) => test.downloadSpeed))
    const lastTest = new Date(Math.max(...testResults.map((test) => (test.date as Date).getTime())))

    return {
      avgDownload: totalDownload / testResults.length,
      avgUpload: totalUpload / testResults.length,
      avgPing: totalPing / testResults.length,
      maxDownload,
      totalTests: testResults.length,
      lastTest,
    }
  }

  const stats = calculateStats()

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="group flex items-center text-gray-600 hover:text-[#82f01f]"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Speed Test
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Profile info */}
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#82f01f] to-[#a4ff29] relative">
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-[#82f01f] to-[#a4ff29] text-white">
                        {user.displayName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") ||
                          user.email?.[0] ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <CardContent className="pt-20 pb-6 text-center">
                  <h2 className="text-2xl font-bold mb-1">{user.displayName || user.email?.split("@")[0]}</h2>
                  <p className="text-gray-500 mb-4">{user.email}</p>

                  <div className="flex justify-center gap-2 mb-6">
                    <Badge variant="outline" className="bg-[#82f01f]/10 text-[#82f01f] border-[#82f01f]/30">
                      <Shield className="mr-1 h-3 w-3" /> Verified User
                    </Badge>
                    <Badge variant="outline" className="bg-[#4158D0]/10 text-[#4158D0] border-[#4158D0]/30">
                      <Clock className="mr-1 h-3 w-3" /> Member since{" "}
                      {new Date(user.metadata.creationTime!).toLocaleDateString()}
                    </Badge>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-[#82f01f]">{stats.totalTests}</p>
                      <p className="text-sm text-gray-500">Tests Run</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#4158D0]">{stats.maxDownload.toFixed(1)}</p>
                      <p className="text-sm text-gray-500">Max Speed (Mbps)</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10"
                    >
                      <Link href="/settings">
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Tabs */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm p-1 rounded-full overflow-x-auto">
                  <TabsTrigger
                    value="overview"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Test History
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Achievements
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl">
                    <CardHeader>
                      <CardTitle>Speed Test Overview</CardTitle>
                      <CardDescription>Your internet performance at a glance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-md">
                          <div className="flex items-center mb-2">
                            <Wifi className="h-5 w-5 mr-2 text-[#82f01f]" />
                            <span className="text-sm font-medium">Avg Download</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {stats.avgDownload.toFixed(2)}{" "}
                            <span className="text-sm font-normal text-gray-500">Mbps</span>
                          </div>
                        </div>
                        <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-md">
                          <div className="flex items-center mb-2">
                            <Database className="h-5 w-5 mr-2 text-[#FBAB7E]" />
                            <span className="text-sm font-medium">Avg Upload</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {stats.avgUpload.toFixed(2)} <span className="text-sm font-normal text-gray-500">Mbps</span>
                          </div>
                        </div>
                        <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-md">
                          <div className="flex items-center mb-2">
                            <Activity className="h-5 w-5 mr-2 text-[#4158D0]" />
                            <span className="text-sm font-medium">Avg Ping</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {stats.avgPing.toFixed(0)} <span className="text-sm font-normal text-gray-500">ms</span>
                          </div>
                        </div>
                      </div>

                      {stats.lastTest && (
                        <div className="bg-white/50 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-md mb-6">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                            <span className="text-sm font-medium">Last Test</span>
                          </div>
                          <div className="text-lg">{stats.lastTest.toLocaleString()}</div>
                        </div>
                      )}

                      {testResults.length === 0 ? (
                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertTriangle className="h-4 w-4 text-blue-500" />
                          <AlertTitle>No test results yet</AlertTitle>
                          <AlertDescription>
                            Run your first speed test and save the results to see your statistics here.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <AlertTitle>Your internet is being monitored</AlertTitle>
                          <AlertDescription>
                            Continue running tests regularly to track your internet performance over time.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white rounded-full"
                      >
                        <Link href="/">Run New Test</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl">
                    <CardHeader>
                      <CardTitle>Test History</CardTitle>
                      <CardDescription>Your recent speed test results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {testResults.length === 0 ? (
                        <div className="text-center py-12">
                          <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-600 mb-2">No test history yet</h3>
                          <p className="text-gray-500 mb-6">Run your first speed test and save the results</p>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white rounded-full"
                          >
                            <Link href="/">Run Speed Test</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto -mx-4 px-4">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left p-2 text-gray-600">Date</th>
                                <th className="text-right p-2 text-gray-600">Download</th>
                                <th className="text-right p-2 text-gray-600">Upload</th>
                                <th className="text-right p-2 text-gray-600">Ping</th>
                                <th className="text-right p-2 text-gray-600">Server</th>
                              </tr>
                            </thead>
                            <tbody>
                              {testResults.slice(0, 5).map((result, index) => (
                                <tr key={result.id || index} className="border-b border-gray-100 hover:bg-white/50">
                                  <td className="p-2 text-sm">{(result.date as Date).toLocaleString()}</td>
                                  <td className="p-2 text-sm text-right font-medium text-[#82f01f]">
                                    {result.downloadSpeed.toFixed(2)} Mbps
                                  </td>
                                  <td className="p-2 text-sm text-right font-medium text-[#FBAB7E]">
                                    {result.uploadSpeed.toFixed(2)} Mbps
                                  </td>
                                  <td className="p-2 text-sm text-right font-medium text-[#4158D0]">
                                    {result.ping} ms
                                  </td>
                                  <td className="p-2 text-sm text-right">{result.server}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                    {testResults.length > 5 && (
                      <CardFooter className="flex justify-center">
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10"
                        >
                          <Link href="/">View All Results</Link>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="achievements">
                  <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl">
                    <CardHeader>
                      <CardTitle>Your Achievements</CardTitle>
                      <CardDescription>Milestones and badges you've earned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`bg-white/50 backdrop-blur-md rounded-xl p-4 border ${testResults.length > 0 ? "border-[#82f01f]/30" : "border-gray-200"} shadow-md`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${testResults.length > 0 ? "bg-[#82f01f]/10" : "bg-gray-100"}`}
                            >
                              <Award
                                className={`h-6 w-6 ${testResults.length > 0 ? "text-[#82f01f]" : "text-gray-400"}`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">First Test</h3>
                              <p className="text-sm text-gray-500">Run your first speed test</p>
                            </div>
                            {testResults.length > 0 && <CheckCircle className="h-5 w-5 text-[#82f01f] ml-auto" />}
                          </div>
                        </div>

                        <div
                          className={`bg-white/50 backdrop-blur-md rounded-xl p-4 border ${testResults.length >= 5 ? "border-[#82f01f]/30" : "border-gray-200"} shadow-md`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${testResults.length >= 5 ? "bg-[#82f01f]/10" : "bg-gray-100"}`}
                            >
                              <Award
                                className={`h-6 w-6 ${testResults.length >= 5 ? "text-[#82f01f]" : "text-gray-400"}`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">Consistent Tester</h3>
                              <p className="text-sm text-gray-500">Run 5 or more speed tests</p>
                            </div>
                            {testResults.length >= 5 && <CheckCircle className="h-5 w-5 text-[#82f01f] ml-auto" />}
                          </div>
                        </div>

                        <div
                          className={`bg-white/50 backdrop-blur-md rounded-xl p-4 border ${stats.maxDownload >= 100 ? "border-[#82f01f]/30" : "border-gray-200"} shadow-md`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.maxDownload >= 100 ? "bg-[#82f01f]/10" : "bg-gray-100"}`}
                            >
                              <Award
                                className={`h-6 w-6 ${stats.maxDownload >= 100 ? "text-[#82f01f]" : "text-gray-400"}`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">Speed Demon</h3>
                              <p className="text-sm text-gray-500">Achieve 100+ Mbps download</p>
                            </div>
                            {stats.maxDownload >= 100 && <CheckCircle className="h-5 w-5 text-[#82f01f] ml-auto" />}
                          </div>
                        </div>

                        <div
                          className={`bg-white/50 backdrop-blur-md rounded-xl p-4 border ${stats.avgPing <= 20 && testResults.length > 0 ? "border-[#82f01f]/30" : "border-gray-200"} shadow-md`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.avgPing <= 20 && testResults.length > 0 ? "bg-[#82f01f]/10" : "bg-gray-100"}`}
                            >
                              <Award
                                className={`h-6 w-6 ${stats.avgPing <= 20 && testResults.length > 0 ? "text-[#82f01f]" : "text-gray-400"}`}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">Low Latency</h3>
                              <p className="text-sm text-gray-500">Achieve average ping under 20ms</p>
                            </div>
                            {stats.avgPing <= 20 && testResults.length > 0 && (
                              <CheckCircle className="h-5 w-5 text-[#82f01f] ml-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

