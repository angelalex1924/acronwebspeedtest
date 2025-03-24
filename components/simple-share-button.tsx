"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimpleShareButtonProps {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  finalPing: number
  jitter: number
  server: string
}

export function SimpleShareButton({
  downloadSpeed,
  uploadSpeed,
  ping,
  finalPing,
  jitter,
  server,
}: SimpleShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `Just tested my internet speed with SpeedTest by AcronWeb:
📥 Download: ${downloadSpeed.toFixed(2)} Mbps
📤 Upload: ${uploadSpeed.toFixed(2)} Mbps
🔄 Ping: ${ping} ms (Final: ${finalPing} ms)
📊 Jitter: ${jitter} ms
🌐 Server: ${server}
Test your speed now at https://speedtest.acronweb.com`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Internet Speed Test Results",
          text: shareText,
          url: "https://speedtest.acronweb.com",
        })
      } catch (error) {
        console.log("Error sharing:", error)
        // Fallback to copy if sharing fails
        handleCopy()
      }
    } else {
      // Fallback to copy if Web Share API is not available
      handleCopy()
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="rounded-full border-[#82f01f]/50 text-[#82f01f] hover:bg-[#82f01f]/10"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </>
      )}
    </Button>
  )
}

