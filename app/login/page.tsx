"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/uiauth/button"
import { Separator } from "@/components/uiauth/separator"
import { Checkbox } from "@/components/uiauth/checkbox"
import { Mail, Lock } from "lucide-react"
import ModernShowcase from "@/components/modern-showcase"
import { FingerprintLogo } from "@/components/fingerprint-logo"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import BackgroundAnimation from "@/components/background-animation"
import { ModernInput } from "@/components/modern-input"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { SocialButtonGridConnected } from "@/components/social-buttons"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login, user } = useAuth()
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      // Redirect is handled in the auth context
    } catch (error: any) {
      // Handle different Firebase auth errors
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password")
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email")
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later")
      } else {
        setError("Failed to login. Please try again")
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
    <motion.div
      className="flex min-h-screen flex-col md:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-[#F8FBFE] z-10 relative">
        <BackgroundAnimation />

        <div className="w-full max-w-md z-10">
          <AnimatedGradientBorder>
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff605c]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd44]"></div>
                <div className="w-3 h-3 rounded-full bg-[#00ca4e]"></div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="text-sm bg-gradient-to-r from-[#0fad93] to-[#56dc21] text-white px-3 py-1 rounded-full hover:shadow-md transition-all"
                >
                  Home
                </Link>
              </motion.div>
            </div>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <FingerprintLogo />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#0fad93] to-[#56dc21]">
                AcronWeb ID
              </h1>
              <div className="relative">
                <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
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

            <form onSubmit={handleLogin} className="space-y-5">
              <ModernInput
                id="email"
                type="text"
                label="Email"
                placeholder="Enter your Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                error={error && error.includes("email") ? error : undefined}
              />

              <ModernInput
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                showPasswordToggle
                error={error && error.includes("password") ? error : undefined}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="data-[state=checked]:bg-[#0fad93] data-[state=checked]:border-[#0fad93]"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="link" className="p-0 h-auto text-sm text-[#0fad93]" asChild>
                    <Link href="/forgot-password">Forgot password?</Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-[#0fad93] to-[#56dc21] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="flex items-center my-5">
              <Separator className="flex-1" />
              <span className="px-3 text-xs font-bold text-gray-500">OR CONTINUE WITH</span>
              <Separator className="flex-1" />
            </div>

            <SocialButtonGridConnected />

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-[#0fad93] hover:underline">
                  Create an account
                </Link>
              </span>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#0fad93] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#0fad93] hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>
          </AnimatedGradientBorder>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative overflow-hidden">
        <ModernShowcase />
      </div>
    </motion.div>
  )
}

