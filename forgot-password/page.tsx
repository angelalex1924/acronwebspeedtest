"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import ModernShowcase from "@/components/modern-showcase"
import { FingerprintLogo } from "@/components/fingerprint-logo"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import BackgroundAnimation from "@/components/background-animation"
import { FloatingIcons } from "@/components/floating-icons"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { resetPassword, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push("/dashboard")
    }

    return () => clearTimeout(timer)
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (error: any) {
      // Handle different Firebase auth errors
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format")
      } else {
        setError("Failed to send reset email. Please try again")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F8FBFE] to-[#EFF8F6]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#0fad93] border-t-transparent animate-spin mb-4"></div>
          <p className="text-[#0fad93] font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-[#F8FBFE] z-10 relative">
        <BackgroundAnimation />
        <FloatingIcons />

        <div className="w-full max-w-md z-10">
          <AnimatedGradientBorder>
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff605c]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd44]"></div>
                <div className="w-3 h-3 rounded-full bg-[#00ca4e]"></div>
              </div>
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </Link>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <FingerprintLogo />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#0fad93] to-[#56dc21]">
                AcronWeb ID
              </h1>
              <div className="relative">
                <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>
                <div className="mt-2 w-16 h-1 bg-gradient-to-r from-[#0fad93] to-[#56dc21] rounded-full mx-auto"></div>
              </div>
            </div>

            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {isSubmitted ? (
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Email Sent</h3>
                  <p className="text-sm">Password reset link has been sent to your email.</p>
                </div>
                <p className="text-sm text-gray-600">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    className="mt-4 bg-gradient-to-r from-[#0fad93] to-[#56dc21] hover:opacity-90 transition-all duration-300"
                  >
                    <Link href="/login">Return to Login</Link>
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <div className="relative group">
                      <Label
                        htmlFor="email"
                        className="text-xs font-bold absolute -top-2 left-2 px-1 bg-white z-10 text-[#0fad93] transition-all duration-200"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-2 border-gray-200 bg-white rounded-xl h-10 px-4 focus:border-[#0fad93] transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-10 text-base font-medium bg-gradient-to-r from-[#0fad93] to-[#56dc21] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </>
            )}
          </AnimatedGradientBorder>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative overflow-hidden">
        <ModernShowcase />
      </div>
    </div>
  )
}

