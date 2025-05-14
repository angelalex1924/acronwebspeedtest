"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Upload, Clock, Wifi } from "lucide-react"
import Link from "next/link"

interface SpeedTestResult {
  id: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter?: number
  location?: string
  provider?: string
  timestamp: any
  deviceInfo?: {
    userAgent: string
    platform: string
    screenWidth: number
    screenHeight: number
  }
}

export default function ResultsPage() {
  const { user, loading } = useAuth()
  const [results, setResults] = useState<SpeedTestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      if (loading) return
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const q = query(collection(db, "speedTests"), where("userId", "==", user.uid), orderBy("timestamp", "desc"))

        const querySnapshot = await getDocs(q)
        const fetchedResults: SpeedTestResult[] = []

        querySnapshot.forEach((doc) => {
          fetchedResults.push({
            id: doc.id,
            ...doc.data(),
          } as SpeedTestResult)
        })

        setResults(fetchedResults)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [user, loading])

  function formatDate(timestamp: any) {
    if (!timestamp) return "N/A"

    try {
      const date = timestamp.toDate()
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return "Invalid date"
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-3xl bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your test results</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Speed Test Results</h1>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Results Found</CardTitle>
              <CardDescription>You haven't performed any speed tests yet.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/">Run a Speed Test</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#0fad93] to-[#56dc21] text-white">
                  <CardTitle className="flex justify-between items-center">
                    <span>Speed Test</span>
                    <Clock className="h-5 w-5" />
                  </CardTitle>
                  <CardDescription className="text-white/90">{formatDate(result.timestamp)}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Download className="h-5 w-5 mr-2 text-[#0fad93]" />
                        <span className="text-sm font-medium">Download</span>
                      </div>
                      <span className="font-bold">{result.downloadSpeed.toFixed(2)} Mbps</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Upload className="h-5 w-5 mr-2 text-[#56dc21]" />
                        <span className="text-sm font-medium">Upload</span>
                      </div>
                      <span className="font-bold">{result.uploadSpeed.toFixed(2)} Mbps</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wifi className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Ping</span>
                      </div>
                      <span className="font-bold">{result.ping.toFixed(0)} ms</span>
                    </div>

                    {result.jitter && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Jitter</span>
                        <span className="font-bold">{result.jitter.toFixed(1)} ms</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 text-xs text-gray-500">
                  {result.deviceInfo?.platform || "Unknown device"}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

