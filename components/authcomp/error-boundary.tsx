"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FBFE] to-[#EFF8F6]">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{this.state.error?.message || "An unexpected error occurred"}</p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="bg-gradient-to-r from-[#0fad93] to-[#56dc21] hover:opacity-90"
            >
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

