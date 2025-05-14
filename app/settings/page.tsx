"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  User,
  ArrowLeft,
  Save,
  Upload,
  Shield,
  Bell,
  Lock,
  Trash2,
  LogOut,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Profile settings
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [email, setEmail] = useState("")

  // Password settings
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [speedAlerts, setSpeedAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [newFeatures, setNewFeatures] = useState(true)

  // UI states
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    if (user) {
      setDisplayName(user.displayName || "")
      setPhotoURL(user.photoURL || "")
      setEmail(user.email || "")
    }
  }, [user])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/login")
    }
  }, [mounted, loading, user, router])

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      await updateProfile(auth.currentUser!, {
        displayName,
        photoURL,
      })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!user || !email) return

    setIsSaving(true)

    try {
      await updateEmail(auth.currentUser!, email)

      toast({
        title: "Email Updated",
        description: "Your email has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating email:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update email. You may need to re-login first.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!user || !currentPassword || !newPassword || !confirmPassword) return

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email!, currentPassword)

      await reauthenticateWithCredential(auth.currentUser!, credential)

      // Update password
      await updatePassword(auth.currentUser!, newPassword)

      // Clear password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update password. Please check your current password and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== user.email) return

    setIsDeleting(true)

    try {
      await deleteUser(auth.currentUser!)

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. You may need to re-login first.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmation("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this file to storage
    // For now, we'll just create a local URL
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoURL(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const saveNotificationSettings = () => {
    // In a real app, you would save these to a database
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfe] to-[#e6f4f1] py-12 px-4">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/profile")}
            className="group flex items-center text-gray-600 hover:text-[#82f01f]"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Profile
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm p-1 rounded-full gap-1">
              <TabsTrigger
                value="profile"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
              >
                <Lock className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#82f01f] data-[state=active]:to-[#a4ff29] data-[state=active]:text-white"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="danger"
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f43f5e] data-[state=active]:to-[#ef4444] data-[state=active]:text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account profile information and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                        <AvatarImage src={photoURL} alt={displayName} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-[#82f01f] to-[#a4ff29] text-white">
                          {displayName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") ||
                            email?.[0] ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        onClick={triggerFileInput}
                        className="rounded-full border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="bg-white/50 border-white/30 focus-visible:ring-[#82f01f]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/50 border-white/30 focus-visible:ring-[#82f01f]"
                        />
                      </div>

                      <Alert className="bg-blue-50 border-blue-200 mt-4">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertTitle>Email Verification</AlertTitle>
                        <AlertDescription>
                          {user.emailVerified
                            ? "Your email is verified."
                            : "Please verify your email address to access all features."}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDisplayName(user.displayName || "")
                      setPhotoURL(user.photoURL || "")
                      setEmail(user.email || "")
                    }}
                    className="rounded-full"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white rounded-full"
                  >
                    {isSaving ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        </span>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-white/50 border-white/30 focus-visible:ring-[#82f01f] pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white/50 border-white/30 focus-visible:ring-[#82f01f]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/50 border-white/30 focus-visible:ring-[#82f01f]"
                      />
                    </div>

                    <Button
                      onClick={handleUpdatePassword}
                      disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                      className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white rounded-full mt-2"
                    >
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Security</h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Two-Factor Authentication</div>
                        <div className="text-xs text-gray-500">Add an extra layer of security to your account</div>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-full border-[#82f01f]/30 text-[#82f01f] hover:bg-[#82f01f]/10 w-full sm:w-auto"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Enable
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Active Sessions</div>
                        <div className="text-xs text-gray-500">Manage devices where you're currently logged in</div>
                      </div>
                      <Button variant="outline" className="rounded-full w-full sm:w-auto">
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-white/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Email Notifications</div>
                        <div className="text-xs text-gray-500">Receive notifications via email</div>
                      </div>
                      <div className="self-end sm:self-auto">
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          className="data-[state=checked]:bg-[#82f01f]"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Notification Types</h3>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="text-sm">Speed Test Alerts</div>
                          <div className="text-xs text-gray-500">Get notified when your internet speed drops</div>
                        </div>
                        <div className="self-end sm:self-auto">
                          <Switch
                            checked={speedAlerts}
                            onCheckedChange={setSpeedAlerts}
                            disabled={!emailNotifications}
                            className="data-[state=checked]:bg-[#82f01f]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="text-sm">Weekly Reports</div>
                          <div className="text-xs text-gray-500">
                            Receive weekly summaries of your internet performance
                          </div>
                        </div>
                        <div className="self-end sm:self-auto">
                          <Switch
                            checked={weeklyReports}
                            onCheckedChange={setWeeklyReports}
                            disabled={!emailNotifications}
                            className="data-[state=checked]:bg-[#82f01f]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="text-sm">New Features</div>
                          <div className="text-xs text-gray-500">Get updates about new features and improvements</div>
                        </div>
                        <div className="self-end sm:self-auto">
                          <Switch
                            checked={newFeatures}
                            onCheckedChange={setNewFeatures}
                            disabled={!emailNotifications}
                            className="data-[state=checked]:bg-[#82f01f]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={saveNotificationSettings}
                    className="bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:opacity-90 text-white rounded-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="danger">
              <Card className="bg-white/70 backdrop-blur-xl shadow-xl border-red-100 rounded-2xl">
                <CardHeader className="border-b border-red-100">
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions that affect your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertTitle>Warning: Danger Zone</AlertTitle>
                    <AlertDescription>
                      Actions in this section can result in permanent data loss and cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Log Out Everywhere</h3>
                        <p className="text-sm text-gray-500">Sign out from all devices except this one</p>
                      </div>
                      <Button variant="outline" className="rounded-full border-red-300 text-red-600 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out All Devices
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
                        <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                      </div>

                      {showDeleteConfirm ? (
                        <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-600 font-medium">
                            This action cannot be undone. Please type your email to confirm:
                          </p>
                          <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder={user.email || ""}
                            className="bg-white border-red-200 focus-visible:ring-red-500"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowDeleteConfirm(false)
                                setDeleteConfirmation("")
                              }}
                              className="rounded-full"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleDeleteAccount}
                              disabled={isDeleting || deleteConfirmation !== user.email}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                            >
                              {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

