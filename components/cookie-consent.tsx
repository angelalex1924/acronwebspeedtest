"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie_consent")
    if (!hasConsented) {
      // Show the consent banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted")
    setShowConsent(false)

    // You could trigger analytics or other cookie-dependent features here
    console.log("Cookies accepted")
  }

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined")
    setShowConsent(false)

    // You could disable analytics or other cookie-dependent features here
    console.log("Cookies declined")
  }

  if (!showConsent) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-xl border border-white/30 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-50%] right-[-30%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#82f01f]/5 to-[#a4ff29]/5 blur-3xl"></div>
            <div className="absolute bottom-[-50%] left-[-30%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#4158D0]/5 to-[#C850C0]/5 blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#82f01f]/10 rounded-full flex items-center justify-center">
                <Cookie className="h-6 w-6 text-[#82f01f]" />
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-bold mb-1">Cookie Consent</h3>
                <p className="text-sm text-gray-600 mb-2">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. By clicking
                  "Accept", you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-1 text-[#82f01f]" />
                    <span>Your privacy matters to us</span>
                  </div>
                  <div className="flex items-center">
                    <Info className="h-3 w-3 mr-1 text-[#4158D0]" />
                    <Link href="/privacy-policy" className="underline hover:text-[#82f01f]">
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 md:mt-0 w-full md:w-auto justify-center md:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 w-full sm:w-auto"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white border-0 shadow-lg shadow-[#82f01f]/20 w-full sm:w-auto"
                >
                  Accept All Cookies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

