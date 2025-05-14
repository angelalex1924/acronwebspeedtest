"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { User, Mail, AtSign, Lock } from "lucide-react"
import ModernShowcase from "@/components/modern-showcase"
import { FingerprintLogo } from "@/components/fingerprint-logo"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"
import BackgroundAnimation from "@/components/background-animation"
import { ModernInput } from "@/components/modern-input"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { SocialButtonGridConnected } from "@/components/social-buttons"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [username, setUsername] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { register, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push("/")
    }

    return () => clearTimeout(timer)
  }, [user, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Validate form fields
    const newFieldErrors: Record<string, string> = {}

    if (!name) newFieldErrors.name = "Name is required"
    if (!surname) newFieldErrors.surname = "Surname is required"
    if (!email) newFieldErrors.email = "Email is required"
    if (!username) newFieldErrors.username = "Username is required"
    if (!password) newFieldErrors.password = "Password is required"
    if (password && passwordStrength < 60) newFieldErrors.password = "Password is too weak"

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await register(name, surname, email, username, password)
      // Redirect is handled in the auth context
    } catch (error: any) {
      // Handle different Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setFieldErrors({ email: "Email is already in use" })
      } else if (error.code === "auth/invalid-email") {
        setFieldErrors({ email: "Invalid email format" })
      } else if (error.code === "auth/weak-password") {
        setFieldErrors({ password: "Password is too weak" })
      } else {
        setError("Failed to create account. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;"<>,.?/~'
    let newPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }
    setPassword(newPassword)
    calculatePasswordStrength(newPassword)
  }

  const calculatePasswordStrength = (pass: string) => {
    // Simple password strength calculation
    let strength = 0
    if (pass.length >= 8) strength += 20
    if (pass.match(/[A-Z]/)) strength += 20
    if (pass.match(/[a-z]/)) strength += 20
    if (pass.match(/[0-9]/)) strength += 20
    if (pass.match(/[^A-Za-z0-9]/)) strength += 20
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    calculatePasswordStrength(newPassword)
  }

  // Get color based on password strength
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 80) return "bg-yellow-500"
    return "bg-green-500"
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
                <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
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

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ModernInput
                  id="name"
                  type="text"
                  label="Name"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User size={16} />}
                  error={fieldErrors.name}
                />

                <ModernInput
                  id="surname"
                  type="text"
                  label="Surname"
                  placeholder="Last name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  icon={<User size={16} />}
                  error={fieldErrors.surname}
                />
              </div>

              <ModernInput
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                error={fieldErrors.email}
              />

              <ModernInput
                id="username"
                type="text"
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<AtSign size={16} />}
                error={fieldErrors.username}
              />

              <div className="space-y-2">
                <ModernInput
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                  icon={<Lock size={16} />}
                  showPasswordToggle
                  error={fieldErrors.password}
                />

                <div className="mt-2">
                  <Progress value={passwordStrength} className={`h-1.5 ${getStrengthColor()}`} />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Weak</span>
                    <span className="text-xs text-gray-500">Strong</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs bg-gradient-to-r from-[#0fad93] to-[#56dc21] text-white hover:opacity-90"
                  onClick={generatePassword}
                >
                  Generate Strong Password
                </Button>
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
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="flex items-center my-5">
              <Separator className="flex-1" />
              <span className="px-3 text-xs font-bold text-gray-500">OR SIGN UP WITH</span>
              <Separator className="flex-1" />
            </div>

            <SocialButtonGridConnected />

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#0fad93] hover:underline">
                  Sign in
                </Link>
              </span>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
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

