"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import {
  User,
  Shield,
  Activity,
  Settings,
  Code,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  Home,
  Key,
  CreditCard,
  HelpCircle,
  FileText,
  Fingerprint,
  Menu,
  X,
} from "lucide-react"

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  badge?: string | number
  onClick?: () => void
}

function SidebarLink({ href, icon, label, isActive, badge, onClick }: SidebarLinkProps) {
  const { isDark } = useTheme()

  return (
    <li className="relative">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors",
          isActive
            ? isDark
              ? "bg-gray-800 text-white font-medium"
              : "bg-gray-100 text-gray-900 font-medium"
            : isDark
              ? "text-gray-300 hover:bg-gray-800 hover:text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        )}
        onClick={onClick}
      >
        <span className="w-5 h-5 flex-shrink-0">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {badge && (
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium",
              typeof badge === "number" && badge > 0
                ? "bg-red-500 text-white"
                : isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700",
            )}
          >
            {badge}
          </span>
        )}
      </Link>
    </li>
  )
}

export function SimpleSidebar() {
  const pathname = usePathname()
  const { isDark } = useTheme()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-theme-gradient flex items-center justify-center text-white">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div className="absolute inset-0 rounded-lg border border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          </div>
          <div className="flex flex-col">
            <span className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>AcronWeb</span>
            <span className={cn("text-xs -mt-1", isDark ? "text-gray-400" : "text-gray-500")}>ID Dashboard</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-6">
          <div>
            <h3 className={cn("px-4 text-xs font-medium mb-2", isDark ? "text-gray-400" : "text-gray-500")}>
              DASHBOARD
            </h3>
            <ul className="space-y-1">
              <SidebarLink
                href="/dashboard"
                icon={<Home />}
                label="Overview"
                isActive={pathname === "/dashboard" && !pathname.includes("?tab=")}
              />
              <SidebarLink
                href="/dashboard?tab=security"
                icon={<Shield />}
                label="Security"
                isActive={pathname.includes("?tab=security")}
              />
              <SidebarLink
                href="/dashboard?tab=connections"
                icon={<Globe />}
                label="Connections"
                isActive={pathname.includes("?tab=connections")}
              />
              <SidebarLink
                href="/dashboard?tab=activity"
                icon={<Activity />}
                label="Activity"
                isActive={pathname.includes("?tab=activity")}
              />
              <SidebarLink
                href="/dashboard?tab=developer"
                icon={<Code />}
                label="Developer"
                isActive={pathname.includes("?tab=developer")}
              />
            </ul>
          </div>

          <div>
            <h3 className={cn("px-4 text-xs font-medium mb-2", isDark ? "text-gray-400" : "text-gray-500")}>ACCOUNT</h3>
            <ul className="space-y-1">
              <SidebarLink
                href="/dashboard/profile"
                icon={<User />}
                label="Profile"
                isActive={pathname === "/dashboard/profile"}
              />
              <SidebarLink
                href="/dashboard/notifications"
                icon={<Bell />}
                label="Notifications"
                badge={3}
                isActive={pathname === "/dashboard/notifications"}
              />
              <SidebarLink
                href="/dashboard/api-keys"
                icon={<Key />}
                label="API Keys"
                isActive={pathname === "/dashboard/api-keys"}
              />
              <SidebarLink
                href="/dashboard/billing"
                icon={<CreditCard />}
                label="Billing"
                isActive={pathname === "/dashboard/billing"}
              />
              <SidebarLink
                href="/dashboard/settings"
                icon={<Settings />}
                label="Settings"
                isActive={pathname === "/dashboard/settings"}
              />
            </ul>
          </div>

          <div>
            <h3 className={cn("px-4 text-xs font-medium mb-2", isDark ? "text-gray-400" : "text-gray-500")}>SUPPORT</h3>
            <ul className="space-y-1">
              <SidebarLink
                href="/dashboard/help"
                icon={<HelpCircle />}
                label="Help Center"
                isActive={pathname === "/dashboard/help"}
              />
              <SidebarLink
                href="/dashboard/documentation"
                icon={<FileText />}
                label="Documentation"
                isActive={pathname === "/dashboard/documentation"}
              />
            </ul>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-theme-gradient flex items-center justify-center text-white">
              {user?.photoURL ? (
                <img src={user.photoURL || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-gray-900")}>
              {user?.displayName || user?.email?.split("@")[0]}
            </p>
            <p className={cn("text-xs truncate", isDark ? "text-gray-400" : "text-gray-500")}>{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className={cn("text-red-500", isDark ? "hover:bg-red-500/10" : "hover:bg-red-100")}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isMobileOpen ? 0 : -300 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("absolute top-0 left-0 bottom-0 w-[280px] flex flex-col", isDark ? "bg-gray-900" : "bg-white")}
        >
          {sidebarContent}
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 border-r",
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
          isOpen ? "w-[280px]" : "w-[70px]",
        )}
      >
        {isOpen ? (
          <>
            {sidebarContent}
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <div className="py-4 flex flex-col items-center">
            <Button variant="ghost" size="icon" className="mb-6" onClick={() => setIsOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex-1 w-full flex flex-col items-center gap-4 py-4">
              <Link
                href="/dashboard"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  pathname === "/dashboard" && !pathname.includes("?tab=")
                    ? isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Home className="w-5 h-5" />
              </Link>

              <Link
                href="/dashboard?tab=security"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  pathname.includes("?tab=security")
                    ? isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Shield className="w-5 h-5" />
              </Link>

              <Link
                href="/dashboard?tab=connections"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  pathname.includes("?tab=connections")
                    ? isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Globe className="w-5 h-5" />
              </Link>

              <Link
                href="/dashboard?tab=activity"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  pathname.includes("?tab=activity")
                    ? isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Activity className="w-5 h-5" />
              </Link>

              <Link
                href="/dashboard?tab=developer"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  pathname.includes("?tab=developer")
                    ? isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Code className="w-5 h-5" />
              </Link>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

