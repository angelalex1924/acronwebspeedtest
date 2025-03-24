"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AuthDebug() {
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const checkLocalStorage = () => {
    const storageItems: Record<string, string> = {}

    // Check for common auth tokens
    const tokenKeys = [
      "googleAuthToken",
      "googleRefreshToken",
      "githubToken",
      "twitterToken",
      "twitterTokenSecret",
      "microsoftToken",
      "user",
    ]

    tokenKeys.forEach((key) => {
      const value = localStorage.getItem(key)
      if (value) {
        try {
          // Try to parse JSON if possible
          storageItems[key] = JSON.parse(value)
        } catch {
          // Otherwise store as string
          storageItems[key] = value
        }
      }
    })

    setDebugInfo(storageItems)
    setShowDebug(true)
  }

  return (
    <div className="mt-4">
      <Button variant="outline" size="sm" onClick={checkLocalStorage} className="text-xs">
        Debug Auth
      </Button>

      {showDebug && debugInfo && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

