"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Facebook, Github } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"

export interface SocialButtonProps {
  icon: React.ReactNode
  color: string
  hoverColor: string
  ariaLabel: string
  onClick: () => Promise<void>
  isLoading?: boolean
}

export function SocialButton({ icon, color, hoverColor, ariaLabel, onClick, isLoading }: SocialButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="icon"
        className={`w-12 h-12 rounded-xl ${color} ${hoverColor} border-none shadow-md relative`}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
      </Button>
    </motion.div>
  )
}

export function SocialButtonGridConnected() {
  const {
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    signInWithMicrosoft,
    signInWithTwitter,
    signInWithApple, // Changed from signInWithApple to signInWithInstagram
  } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string, loginFn: () => Promise<void>) => {
    try {
      setLoading(provider)
      await loginFn()
    } catch (error) {
      console.error(`${provider} login error:`, error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      <SocialButton
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        }
        color="bg-white"
        hoverColor="hover:bg-gray-50"
        ariaLabel="Continue with Google"
        onClick={() => handleSocialLogin("google", signInWithGoogle)}
        isLoading={loading === "google"}
      />
      <SocialButton
        icon={<Facebook className="w-6 h-6 text-white" />}
        color="bg-[#1877F2]"
        hoverColor="hover:bg-[#1877F2]/90"
        ariaLabel="Continue with Facebook"
        onClick={() => handleSocialLogin("facebook", signInWithFacebook)}
        isLoading={loading === "facebook"}
      />
      <SocialButton
        icon={<Github className="w-6 h-6 text-white" />}
        color="bg-[#24292F]"
        hoverColor="hover:bg-[#24292F]/90"
        ariaLabel="Continue with GitHub"
        onClick={() => handleSocialLogin("github", signInWithGithub)}
        isLoading={loading === "github"}
      />
      <SocialButton
        icon={
          <svg className="w-6 h-6" viewBox="0 0 23 23">
            <path fill="#f25022" d="M1 1h10v10H1z" />
            <path fill="#00a4ef" d="M1 12h10v10H1z" />
            <path fill="#7fba00" d="M12 1h10v10H12z" />
            <path fill="#ffb900" d="M12 12h10v10H12z" />
          </svg>
        }
        color="bg-white"
        hoverColor="hover:bg-gray-50"
        ariaLabel="Continue with Microsoft"
        onClick={() => handleSocialLogin("microsoft", signInWithMicrosoft)}
        isLoading={loading === "microsoft"}
      />
      <SocialButton
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        }
        color="bg-black"
        hoverColor="hover:bg-black/90"
        ariaLabel="Continue with X"
        onClick={() => handleSocialLogin("twitter", signInWithTwitter)}
        isLoading={loading === "twitter"}
      />
   <SocialButton
  icon={
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  }
  color="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
  hoverColor="hover:opacity-90"
  ariaLabel="Continue with Instagram"
  onClick={() => handleSocialLogin("instagram", signInWithApple)}
  isLoading={loading === "instagram"}
/>

    </div>
  )
}

