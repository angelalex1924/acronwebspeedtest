"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ProviderRatingProps {
  providerName: string
  isVisible: boolean
  onClose: () => void
}

export function ProviderRating({ providerName, isVisible, onClose }: ProviderRatingProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalRatings, setTotalRatings] = useState(0)
  const [hasRatedBefore, setHasRatedBefore] = useState(false)

  // Load previous ratings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && providerName) {
      const savedRatings = localStorage.getItem(`provider_ratings_${providerName}`)
      if (savedRatings) {
        const parsedRatings = JSON.parse(savedRatings)
        setAverageRating(parsedRatings.average)
        setTotalRatings(parsedRatings.count)

        // Check if this user has rated before
        const userRating = localStorage.getItem(`user_rated_${providerName}`)
        if (userRating) {
          setHasRatedBefore(true)
        }
      }

      // Make sure the modal is visible when it should be
      if (isVisible) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [providerName, isVisible])

  const handleRatingClick = (value: number) => {
    setRating(value)
    setShowFeedback(true)
  }

  const handleSubmit = () => {
    if (rating === null) return

    // Save rating to localStorage
    if (typeof window !== "undefined" && providerName) {
      const savedRatings = localStorage.getItem(`provider_ratings_${providerName}`)
      let newAverage: number
      let newCount: number

      if (savedRatings) {
        const parsedRatings = JSON.parse(savedRatings)
        const totalScore = parsedRatings.average * parsedRatings.count + rating
        newCount = parsedRatings.count + 1
        newAverage = totalScore / newCount
      } else {
        newAverage = rating
        newCount = 1
      }

      localStorage.setItem(
        `provider_ratings_${providerName}`,
        JSON.stringify({
          average: newAverage,
          count: newCount,
          lastRating: rating,
          feedback: feedback,
          date: new Date().toISOString(),
        }),
      )

      // Mark that this user has rated
      localStorage.setItem(`user_rated_${providerName}`, "true")
      setHasRatedBefore(true)

      setAverageRating(newAverage)
      setTotalRatings(newCount)
    }

    setSubmitted(true)
    setTimeout(() => {
      onClose()
      // Reset for next time
      setTimeout(() => {
        setSubmitted(false)
        setRating(null)
        setFeedback("")
        setShowFeedback(false)
      }, 500)
    }, 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Full-screen backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
              }}
              style={{ width: "100vw", height: "100vh" }}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-xl border border-white/30 relative overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-20 p-1 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>

                {/* Background elements */}
                <div className="absolute top-[-50%] right-[-50%] w-full h-full rounded-full bg-gradient-to-br from-[#82f01f]/10 to-[#a4ff29]/10 blur-3xl"></div>
                <div className="absolute bottom-[-50%] left-[-50%] w-full h-full rounded-full bg-gradient-to-br from-[#4158D0]/10 to-[#C850C0]/10 blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: 1,
                        }}
                        whileInView={{
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          scale: { duration: 0.5, type: "spring" },
                          rotate: { duration: 1, type: "tween", ease: "easeInOut" },
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-[#82f01f] to-[#a4ff29] rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <ThumbsUp className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">Thanks for your feedback!</h3>
                      <p className="text-gray-600">Your rating helps others understand provider quality.</p>
                    </motion.div>
                  ) : hasRatedBefore ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#82f01f] to-[#a4ff29] rounded-full flex items-center justify-center mx-auto mb-4">
                        <ThumbsUp className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">You've already rated!</h3>
                      <p className="text-gray-600 mb-4">Thank you for your previous feedback about {providerName}.</p>
                      <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white border-0 shadow-lg shadow-[#82f01f]/20 rounded-full"
                      >
                        Close
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-[#82f01f] to-[#a4ff29] text-transparent bg-clip-text">
                          Rate Your Provider
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          How would you rate your experience with {providerName}?
                        </p>
                      </div>

                      {averageRating !== null && (
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 mb-4 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-4 w-4",
                                  star <= Math.round(averageRating) ? "text-[#F7CE68] fill-[#F7CE68]" : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">
                            Average rating: {averageRating.toFixed(1)} ({totalRatings}{" "}
                            {totalRatings === 1 ? "user" : "users"})
                          </p>
                        </div>
                      )}

                      <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-1"
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                          >
                            <Star
                              className={cn(
                                "h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200",
                                (hoverRating !== null ? star <= hoverRating : star <= (rating || 0))
                                  ? "text-[#F7CE68] fill-[#F7CE68]"
                                  : "text-gray-300",
                              )}
                            />
                            {(hoverRating !== null ? star <= hoverRating : star <= (rating || 0)) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                className="absolute inset-0 bg-[#F7CE68]/20 rounded-full blur-md -z-10"
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {showFeedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mb-4">
                              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                Share your experience (optional)
                              </label>
                              <Textarea
                                id="feedback"
                                placeholder="What do you like or dislike about this provider?"
                                className="w-full bg-white/50 backdrop-blur-sm border-white/30 focus:border-[#82f01f] focus:ring-[#82f01f]/20"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-full text-sm"
                        >
                          Skip
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={rating === null}
                          className={cn(
                            "bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white border-0 shadow-lg shadow-[#82f01f]/20 rounded-full text-sm",
                            rating === null && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-l-4 border-[#82f01f]/30 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-b-4 border-r-4 border-[#82f01f]/30 rounded-br-2xl"></div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

