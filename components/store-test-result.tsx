"use client"

import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "@/components/ui/use-toast"

interface SpeedTestResult {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter?: number
  finalPing?: number
  packetLoss?: number
  latencyStability?: number
  location?: string
  provider?: string
  networkType?: string
  ipAddress?: string
  isp?: string
  timestamp?: any
  userId?: string
  userEmail?: string | null
}

export async function storeTestResult(result: SpeedTestResult) {
  try {
    // Add timestamp
    const resultWithMetadata = {
      ...result,
      timestamp: serverTimestamp(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      },
    }

    // Store in Firestore
    const docRef = await addDoc(collection(db, "speedTests"), resultWithMetadata)

    toast({
      title: "Test result saved",
      description: "Your speed test result has been saved successfully",
    })

    return docRef.id
  } catch (error) {
    console.error("Error saving test result:", error)
    toast({
      title: "Error saving result",
      description: "There was a problem saving your test result",
      variant: "destructive",
    })
    return null
  }
}

