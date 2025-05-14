"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  type DocumentData,
  onSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"

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
  date: Timestamp | Date
  deviceType?: string
  networkType?: string
  isp?: string
}

export function useFirestore() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<SpeedTestResult[]>([])
  const [indexError, setIndexError] = useState(false)

  // Save a new speed test result
  const saveTestResult = async (testData: Omit<SpeedTestResult, "userId" | "date">) => {
    if (!user) {
      setError("You must be logged in to save test results")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const result = await addDoc(collection(db, "speedTests"), {
        ...testData,
        userId: user.uid,
        date: Timestamp.now(),
      })

      // Immediately fetch results after saving
      fetchTestResults()

      setLoading(false)
      return result.id
    } catch (err) {
      setError("Failed to save test result")
      setLoading(false)
      return null
    }
  }

  // Fetch user's test results
  const fetchTestResults = async () => {
    if (!user) {
      setTestResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // If we previously encountered an index error, use a simpler query
      let q
      if (indexError) {
        q = query(collection(db, "speedTests"), where("userId", "==", user.uid))
      } else {
        // Try with ordering first
        q = query(collection(db, "speedTests"), where("userId", "==", user.uid), orderBy("date", "desc"))
      }

      const querySnapshot = await getDocs(q)
      const results: SpeedTestResult[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData
        results.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
        } as SpeedTestResult)
      })

      // If we're using the simpler query, sort the results manually
      if (indexError) {
        results.sort((a, b) => {
          const dateA = a.date as Date
          const dateB = b.date as Date
          return dateB.getTime() - dateA.getTime()
        })
      }

      setTestResults(results)
      setLoading(false)
    } catch (err) {
      // Check if it's an index error
      if (err instanceof Error && err.message.includes("index")) {
        setIndexError(true)
        // Try again with the simpler query
        fetchTestResults()
      } else {
        setError("Failed to fetch test results")
      }

      setLoading(false)
    }
  }

  // Set up real-time listener for test results
  useEffect(() => {
    if (!user) {
      setTestResults([])
      return () => {}
    }

    // Use a simpler query that doesn't require a composite index
    const q = query(collection(db, "speedTests"), where("userId", "==", user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: SpeedTestResult[] = []
        snapshot.forEach((doc) => {
          const data = doc.data() as DocumentData
          results.push({
            id: doc.id,
            ...data,
            date: data.date.toDate(),
          } as SpeedTestResult)
        })

        // Sort manually since we're not using orderBy in the query
        results.sort((a, b) => {
          const dateA = a.date as Date
          const dateB = b.date as Date
          return dateB.getTime() - dateA.getTime()
        })

        setTestResults(results)
      },
      (err) => {
        setError("Failed to listen for test results")
      },
    )

    // Clean up listener on unmount
    return () => unsubscribe()
  }, [user])

  return {
    saveTestResult,
    fetchTestResults,
    testResults,
    loading,
    error,
  }
}
