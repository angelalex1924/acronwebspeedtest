"use client"

import { useState } from "react"
import { Bell, Check, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/hooks/use-notifications"

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } =
    useNotifications()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.action) {
      router.push(notification.action.url)
      setOpen(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <div className="w-2 h-2 rounded-full bg-blue-500" />
      case "success":
        return <div className="w-2 h-2 rounded-full bg-green-500" />
      case "warning":
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />
      case "error":
        return <div className="w-2 h-2 rounded-full bg-red-500" />
      default:
        return <div className="w-2 h-2 rounded-full bg-blue-500" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => markAllAsRead()}>
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => clearAllNotifications()}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-12 w-12 mb-4 opacity-20 text-muted-foreground" />
            <h3 className="font-medium mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={cn(
                      "flex gap-4 p-4 cursor-pointer",
                      !notification.read && "bg-primary/5",
                      "hover:bg-muted",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <span className="text-xs whitespace-nowrap text-muted-foreground">
                            {formatDistanceToNow(notification.date, { addSuffix: true })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{notification.message}</p>
                      {notification.action && (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs mt-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                            router.push(notification.action!.url)
                            setOpen(false)
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Separator />
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}

