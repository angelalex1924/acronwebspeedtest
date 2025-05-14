"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useFirestore } from "@/hooks/use-firestore"
import { useAuth } from "@/context/auth-context"
import { AlertTriangle } from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { testResults, fetchTestResults, error } = useFirestore()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="bg-white/80 shadow-md">
        Debug {error && <AlertTriangle className="ml-1 h-3 w-3 text-red-500" />}
      </Button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border">
          <h3 className="font-medium mb-2">Debug Info</h3>
          <p className="text-xs mb-2">User ID: {user.uid}</p>
          <p className="text-xs mb-2">Saved Results: {testResults.length}</p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
              <p className="mt-1 text-xs">
                If you see an index error, you need to create a Firestore index. Check the console for a link.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Manual fetch triggered")
                fetchTestResults()
              }}
              className="text-xs"
            >
              Refresh Results
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Current results:", testResults)
              }}
              className="text-xs"
            >
              Log Results
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open("https://console.firebase.google.com/", "_blank")
              }}
              className="text-xs"
            >
              Firebase Console
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

