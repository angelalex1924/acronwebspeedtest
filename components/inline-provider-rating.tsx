"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface InlineProviderRatingProps {
  providerName: string
}

export function InlineProviderRating({ providerName }: InlineProviderRatingProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalRatings, setTotalRatings] = useState(0)
  const [hasRatedBefore, setHasRatedBefore] = useState(false)
  const [expanded, setExpanded] = useState(false)

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
    }
  }, [providerName])

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
    // Reset after a delay
    setTimeout(() => {
      setExpanded(false)
      // Reset for next time
      setTimeout(() => {
        setSubmitted(false)
        setRating(null)
        setFeedback("")
        setShowFeedback(false)
      }, 500)
    }, 2000)
  }

  if (hasRatedBefore && !expanded) {
    return (
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F7CE68] to-[#FBAB7E] rounded-full flex items-center justify-center mr-3">
              <ThumbsUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Thanks for rating {providerName}!</p>
              {averageRating !== null && (
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= Math.round(averageRating) ? "text-[#F7CE68] fill-[#F7CE68]" : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
                  </span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Rate again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-md"
    >
      {submitted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 bg-gradient-to-r from-[#82f01f] to-[#a4ff29] rounded-full flex items-center justify-center mr-3"
          >
            <ThumbsUp className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <p className="font-medium">Thanks for your feedback!</p>
            <p className="text-sm text-gray-600">Your rating helps others understand provider quality.</p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#F7CE68] to-[#FBAB7E] rounded-full flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Rate your experience with {providerName}</p>
                {averageRating !== null && (
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-3 w-3",
                          star <= Math.round(averageRating) ? "text-[#F7CE68] fill-[#F7CE68]" : "text-gray-300",
                        )}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
                    </span>
                  </div>
                )}
              </div>
            </div>
            {!expanded && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(true)}
                className="rounded-full border-[#F7CE68]/50 text-[#F7CE68] hover:bg-[#F7CE68]/10"
              >
                Rate now
              </Button>
            )}
          </div>

          {expanded && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
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
                          "h-8 w-8 transition-all duration-200",
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

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <Textarea
                      placeholder="What do you like or dislike about this provider? (optional)"
                      className="w-full bg-white/50 backdrop-blur-sm border-white/30 focus:border-[#82f01f] focus:ring-[#82f01f]/20"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={2}
                    />
                  </motion.div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpanded(false)}
                    className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={rating === null}
                    className={cn(
                      "rounded-full bg-gradient-to-r from-[#F7CE68] to-[#FBAB7E] hover:opacity-90 text-white border-0 shadow-md",
                      rating === null && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <Send className="h-3 w-3 mr-2" />
                    Submit
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </motion.div>
  )
}

