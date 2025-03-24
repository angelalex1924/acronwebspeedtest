"use client"

import { useState } from "react"
import { useApiKeys, type ApiKey } from "@/hooks/use-api-keys"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Key, Plus, Copy, Eye, EyeOff, Shield, Clock, Calendar } from "lucide-react"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function ApiKeyManager() {
  const { apiKeys, loading, createApiKey, revokeApiKey } = useApiKeys()
  const { isDark } = useTheme()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read:user"])
  const [isCreating, setIsCreating] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleShowKey = (keyId: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleCreateKey = async () => {
    if (!newKeyName) return

    setIsCreating(true)
    try {
      const newKey = await createApiKey(newKeyName, newKeyScopes)
      setNewlyCreatedKey(newKey)
      setNewKeyName("")
      setNewKeyScopes(["read:user"])
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating API key:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRevokeKey = async (keyId: string) => {
    await revokeApiKey(keyId)
  }

  const handleScopeChange = (scope: string, checked: boolean) => {
    if (checked) {
      setNewKeyScopes((prev) => [...prev, scope])
    } else {
      setNewKeyScopes((prev) => prev.filter((s) => s !== scope))
    }
  }

  const getStatusColor = (status: ApiKey["status"]) => {
    switch (status) {
      case "active":
        return isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-800"
      case "expired":
        return isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-800"
      case "revoked":
        return isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-800"
    }
  }

  if (loading) {
    return (
      <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className={isDark ? "text-white" : ""}>API Keys</CardTitle>
          <CardDescription className={isDark ? "text-gray-400" : ""}>Loading your API keys...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-theme-primary animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={isDark ? "text-white" : ""}>API Keys</CardTitle>
            <CardDescription className={isDark ? "text-gray-400" : ""}>
              Manage your API keys for external integrations
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-theme-primary hover:bg-theme-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription className={isDark ? "text-gray-400" : ""}>
                  Generate a new API key for your integrations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name" className={isDark ? "text-gray-300" : ""}>
                    Key Name
                  </Label>
                  <Input
                    id="key-name"
                    placeholder="e.g. Development API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isDark ? "text-gray-300" : ""}>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "read:user", label: "Read User Data" },
                      { id: "write:user", label: "Write User Data" },
                      { id: "read:billing", label: "Read Billing Data" },
                      { id: "write:billing", label: "Write Billing Data" },
                    ].map((scope) => (
                      <div key={scope.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope.id}
                          checked={newKeyScopes.includes(scope.id)}
                          onCheckedChange={(checked) => handleScopeChange(scope.id, checked as boolean)}
                          className={
                            isDark
                              ? "border-gray-500 data-[state=checked]:bg-theme-primary data-[state=checked]:border-theme-primary"
                              : ""
                          }
                        />
                        <Label htmlFor={scope.id} className={cn("text-sm", isDark ? "text-gray-300" : "")}>
                          {scope.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className={isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={!newKeyName || isCreating}
                  className="bg-theme-primary hover:bg-theme-primary/90"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Create API Key
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Key className={cn("h-12 w-12 mb-4 opacity-20", isDark ? "text-gray-400" : "text-gray-300")} />
              <h3 className={cn("font-medium mb-1", isDark ? "text-white" : "text-gray-900")}>No API keys</h3>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                You haven't created any API keys yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{key.name}</h3>
                        <Badge className={getStatusColor(key.status)}>
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 gap-2">
                        <div
                          className={cn(
                            "flex items-center text-sm font-mono bg-gray-100 rounded px-2 py-1 mt-1",
                            isDark ? "bg-gray-700 text-gray-300" : "text-gray-800",
                          )}
                        >
                          {showKeys[key.id] ? key.key : key.key.substring(0, 8) + "••••••••••••••••"}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => toggleShowKey(key.id)}
                          >
                            {showKeys[key.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={key.status === "revoked"}
                          className={key.status === "revoked" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          Revoke
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                          <AlertDialogDescription className={isDark ? "text-gray-400" : ""}>
                            Are you sure you want to revoke this API key? This action cannot be undone, and any
                            applications using this key will no longer be able to access the API.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className={isDark ? "border-gray-600 text-white hover:bg-gray-700" : ""}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleRevokeKey(key.id)}
                          >
                            Revoke Key
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {key.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className={isDark ? "border-gray-600 text-gray-300" : ""}>
                        <Shield className="w-3 h-3 mr-1" />
                        {scope}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center">
                      <Calendar className={cn("w-3.5 h-3.5 mr-1", isDark ? "text-gray-400" : "text-gray-500")} />
                      <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                        Created: {format(key.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    {key.lastUsed && (
                      <div className="flex items-center">
                        <Clock className={cn("w-3.5 h-3.5 mr-1", isDark ? "text-gray-400" : "text-gray-500")} />
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                          Last used: {format(key.lastUsed, "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog to show newly created key */}
      {newlyCreatedKey && (
        <Dialog open={true} onOpenChange={() => setNewlyCreatedKey(null)}>
          <DialogContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription className={isDark ? "text-gray-400" : ""}>
                Your new API key has been created. Please copy it now as you won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div
                className={cn(
                  "flex items-center justify-between text-sm font-mono bg-gray-100 rounded px-3 py-2",
                  isDark ? "bg-gray-700 text-gray-300" : "text-gray-800",
                )}
              >
                {newlyCreatedKey.key}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(newlyCreatedKey.key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setNewlyCreatedKey(null)} className="bg-theme-primary hover:bg-theme-primary/90">
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

