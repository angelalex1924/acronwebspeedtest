"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react"

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  showPasswordToggle?: boolean
}

export function ModernInput({
  label,
  error,
  success,
  icon,
  className,
  showPasswordToggle = false,
  ...props
}: ModernInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    if (!inputRef.current?.value) {
      setIsFocused(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Determine if the label should be floating
  const isFloating = isFocused || !!props.value || props.placeholder !== undefined

  // Determine input type for password fields
  const inputType = props.type === "password" && showPassword ? "text" : props.type

  return (
    <div className="relative">
      <div className="relative group">
        {/* Animated border for focus state */}
        {isFocused && (
          <motion.div
            className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#0fad93] via-[#56dc21] to-[#0fad93] opacity-70 blur-[1px] z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundSize: "200% 200%" }}
          />
        )}

        {/* Label */}
        <Label
          htmlFor={props.id}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none z-10 px-1 bg-white",
            isFloating ? "-top-2 text-xs font-bold text-[#0fad93]" : "top-1/2 -translate-y-1/2 text-gray-500",
          )}
        >
          {label}
        </Label>

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon if provided */}
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}

          {/* Input */}
          <Input
            {...props}
            ref={inputRef}
            type={inputType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "border-2 bg-white rounded-xl h-12 transition-all duration-200 pr-10",
              icon ? "pl-10" : "pl-4",
              error
                ? "border-red-500 focus:border-red-500"
                : success
                  ? "border-green-500 focus:border-green-500"
                  : "border-gray-200 focus:border-[#0fad93]",
              className,
            )}
          />

          {/* Right icon: error, success, or password toggle */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}
            {!error && success && <Check className="w-5 h-5 text-green-500" />}
            {!error && !success && showPasswordToggle && props.type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-[#0fad93] hover:text-[#56dc21] focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-xs text-red-500 mt-1 ml-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

