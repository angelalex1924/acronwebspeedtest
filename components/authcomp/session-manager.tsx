"use client"

import { useSessions } from "../hooks/use-sessions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, AlertTriangle } from "lucide-react"
import { useTheme } from "../context/theme-context"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export function SessionManager() {
  const { sessions, loading, terminateSession, terminateAllOtherSessions } = useSessions()
  const { isDark } = useTheme()

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("mobile")) {
      return <Smartphone className="w-5 h-5" />
    } else if (device.toLowerCase().includes("tablet")) {
      return <Tablet className="w-5 h-5" />
    } else {
      return <Monitor className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className={isDark ? "text-white" : ""}>Active Sessions</CardTitle>
          <CardDescription className={isDark ? "text-gray-400" : ""}>Loading your active sessions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-theme-primary animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={isDark ? "text-white" : ""}>Active Sessions</CardTitle>
          <CardDescription className={isDark ? "text-gray-400" : ""}>Manage your active login sessions</CardDescription>
        </div>
        {sessions.length > 1 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Terminate All Other Sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
              <AlertDialogHeader>
                <AlertDialogTitle>Terminate All Other Sessions</AlertDialogTitle>
                <AlertDialogDescription className={isDark ? "text-gray-400" : ""}>
                  Are you sure you want to terminate all other sessions? This will log you out from all devices except
                  this one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={terminateAllOtherSessions}>
                  Terminate All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Monitor className={cn("h-12 w-12 mb-4 opacity-20", isDark ? "text-gray-400" : "text-gray-300")} />
            <h3 className={cn("font-medium mb-1", isDark ? "text-white" : "text-gray-900")}>No active sessions</h3>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
              You don't have any active sessions at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "p-4 rounded-lg border",
                  session.isCurrent
                    ? isDark
                      ? "bg-theme-primary/10 border-theme-primary/30"
                      : "bg-theme-primary/5 border-theme-primary/20"
                    : isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200",
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isDark ? "bg-gray-700" : "bg-gray-100",
                      )}
                    >
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                          {session.browser} on {session.os}
                        </h3>
                        {session.isCurrent && (
                          <Badge
                            className={
                              isDark
                                ? "bg-theme-primary/20 text-theme-primary border-theme-primary/30"
                                : "bg-theme-primary/10 text-theme-primary border-theme-primary/20"
                            }
                          >
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs">
                        <div className="flex items-center">
                          <Globe className={cn("w-3.5 h-3.5 mr-1", isDark ? "text-gray-400" : "text-gray-500")} />
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>{session.device}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className={cn("w-3.5 h-3.5 mr-1", isDark ? "text-gray-400" : "text-gray-500")} />
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>{session.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className={cn("w-3.5 h-3.5 mr-1", isDark ? "text-gray-400" : "text-gray-500")} />
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                            Last active {formatDistanceToNow(session.lastActive, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 text-xs">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>IP: {session.ip}</span>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Terminate
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Terminate Session</AlertDialogTitle>
                          <AlertDialogDescription className={isDark ? "text-gray-400" : ""}>
                            Are you sure you want to terminate this session? This will log you out from this device.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className={isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => terminateSession(session.id)}
                          >
                            Terminate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

