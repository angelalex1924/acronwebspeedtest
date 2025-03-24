"use client"

import { useState, useEffect } from "react"
import { Shield, Check, AlertTriangle, X } from "lucide-react"
import { AnimatedCard } from "@/components/animated-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SecurityItem {
  name: string
  status: "good" | "warning" | "danger"
  description: string
}

export function SecurityScore() {
  const [score, setScore] = useState(0)
  const [securityItems, setSecurityItems] = useState<SecurityItem[]>([
    {
      name: "Two-Factor Authentication",
      status: "danger",
      description: "Not enabled",
    },
    {
      name: "Password Strength",
      status: "good",
      description: "Strong password",
    },
    {
      name: "Recent Logins",
      status: "good",
      description: "No suspicious activity",
    },
    {
      name: "Recovery Email",
      status: "warning",
      description: "Not verified",
    },
  ])

  useEffect(() => {
    // Calculate score based on security items
    const goodItems = securityItems.filter((item) => item.status === "good").length
    const warningItems = securityItems.filter((item) => item.status === "warning").length
    const dangerItems = securityItems.filter((item) => item.status === "danger").length

    const totalItems = securityItems.length
    const calculatedScore = Math.round(((goodItems * 1 + warningItems * 0.5 + dangerItems * 0) / totalItems) * 100)

    // Animate score
    let currentScore = 0
    const interval = setInterval(() => {
      currentScore += 2
      setScore(Math.min(currentScore, calculatedScore))
      if (currentScore >= calculatedScore) {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [securityItems])

  const getScoreColor = () => {
    if (score < 40) return "bg-destructive"
    if (score < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusIcon = (status: SecurityItem["status"]) => {
    switch (status) {
      case "good":
        return <Check className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "danger":
        return <X className="w-4 h-4 text-destructive" />
    }
  }

  return (
    <AnimatedCard>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Security Score
        </CardTitle>
        <CardDescription>Your account security status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 mb-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{score}%</span>
            </div>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={cn("stroke-current transition-all duration-1000", {
                  "text-destructive": score < 40,
                  "text-yellow-500": score >= 40 && score < 70,
                  "text-green-500": score >= 70,
                })}
                strokeWidth="10"
                strokeDasharray={`${score * 2.51} 251`}
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <Progress value={score} className={cn("w-full h-2", getScoreColor())} />
        </div>

        <div className="space-y-3 mt-4">
          {securityItems.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="mt-0.5 mr-2">{getStatusIcon(item.status)}</div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </AnimatedCard>
  )
}

