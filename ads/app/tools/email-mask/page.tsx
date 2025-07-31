"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Copy, Trash2, Eye, EyeOff, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MaskedEmail {
  id: string
  maskedAddress: string
  realAddress: string
  description: string
  createdAt: Date
  expiresAt: Date | null
  status: "active" | "inactive" | "expired"
  emailsReceived: number
  lastUsed: Date | null
}

export default function EmailMaskPage() {
  const [realEmail, setRealEmail] = useState("")
  const [description, setDescription] = useState("")
  const [expiryDuration, setExpiryDuration] = useState("24h")
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([])
  const [activeTab, setActiveTab] = useState("create")
  const { toast } = useToast()

  // Load masked emails from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("masked-emails")
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((email: any) => ({
          ...email,
          createdAt: new Date(email.createdAt),
          expiresAt: email.expiresAt ? new Date(email.expiresAt) : null,
          lastUsed: email.lastUsed ? new Date(email.lastUsed) : null,
        }))
        setMaskedEmails(parsed)
      } catch (error) {
        console.error("Failed to load masked emails:", error)
      }
    }
  }, [])

  // Save to localStorage whenever maskedEmails changes
  useEffect(() => {
    localStorage.setItem("masked-emails", JSON.stringify(maskedEmails))
  }, [maskedEmails])

  // Update expired emails
  useEffect(() => {
    const interval = setInterval(() => {
      setMaskedEmails((prev) =>
        prev.map((email) => {
          if (email.expiresAt && email.expiresAt < new Date() && email.status === "active") {
            return { ...email, status: "expired" as const }
          }
          return email
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const generateMaskedEmail = () => {
    if (!realEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter your real email address.",
        variant: "destructive",
      })
      return
    }

    const randomString = Math.random().toString(36).substring(2, 10)
    const maskedAddress = `mask_${randomString}@tempmail.guardian.ai`

    let expiresAt: Date | null = null
    if (expiryDuration !== "never") {
      const now = new Date()
      switch (expiryDuration) {
        case "1h":
          expiresAt = new Date(now.getTime() + 60 * 60 * 1000)
          break
        case "24h":
          expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          break
        case "7d":
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          break
        case "30d":
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          break
      }
    }

    const newMaskedEmail: MaskedEmail = {
      id: Math.random().toString(36).substring(2),
      maskedAddress,
      realAddress: realEmail,
      description: description || "No description",
      createdAt: new Date(),
      expiresAt,
      status: "active",
      emailsReceived: 0,
      lastUsed: null,
    }

    setMaskedEmails((prev) => [newMaskedEmail, ...prev])
    setDescription("")
    setActiveTab("manage")

    toast({
      title: "Email mask created",
      description: "Your masked email address has been generated successfully.",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Email address has been copied to your clipboard.",
    })
  }

  const toggleEmailStatus = (id: string) => {
    setMaskedEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, status: email.status === "active" ? "inactive" : "active" } : email,
      ),
    )
  }

  const deleteEmail = (id: string) => {
    setMaskedEmails((prev) => prev.filter((email) => email.id !== id))
    toast({
      title: "Email mask deleted",
      description: "The masked email address has been removed.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "inactive":
        return <EyeOff className="h-4 w-4" />
      case "expired":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatTimeRemaining = (expiresAt: Date | null) => {
    if (!expiresAt) return "Never expires"

    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const activeEmails = maskedEmails.filter((e) => e.status === "active")
  const inactiveEmails = maskedEmails.filter((e) => e.status === "inactive")
  const expiredEmails = maskedEmails.filter((e) => e.status === "expired")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Email Mask Generator</h1>
          <p className="text-muted-foreground">Create temporary email addresses to protect your privacy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeEmails.length}</div>
              <p className="text-sm text-muted-foreground">Active Masks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{inactiveEmails.length}</div>
              <p className="text-sm text-muted-foreground">Inactive Masks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{expiredEmails.length}</div>
              <p className="text-sm text-muted-foreground">Expired Masks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {maskedEmails.reduce((sum, email) => sum + email.emailsReceived, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Emails Forwarded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Mask</TabsTrigger>
          <TabsTrigger value="manage">Manage Masks</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Email Mask</CardTitle>
              <CardDescription>Generate a temporary email address that forwards to your real email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="realEmail">Your Real Email Address</Label>
                <Input
                  id="realEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={realEmail}
                  onChange={(e) => setRealEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g., Newsletter signup, Online shopping"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Duration</Label>
                <Select value={expiryDuration} onValueChange={setExpiryDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="never">Never Expires</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateMaskedEmail} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Generate Email Mask
              </Button>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  All emails sent to your masked address will be automatically forwarded to your real email address.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Email Masks</CardTitle>
              <CardDescription>Manage your temporary email addresses</CardDescription>
            </CardHeader>
            <CardContent>
              {maskedEmails.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No email masks created yet</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setActiveTab("create")}>
                    Create Your First Mask
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {maskedEmails.map((email) => (
                    <div key={email.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(email.status)}>
                            {getStatusIcon(email.status)}
                            {email.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatTimeRemaining(email.expiresAt)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(email.maskedAddress)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleEmailStatus(email.id)}
                            disabled={email.status === "expired"}
                          >
                            {email.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteEmail(email.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="font-mono text-sm bg-muted p-2 rounded">{email.maskedAddress}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            <strong>Forwards to:</strong> {email.realAddress}
                          </p>
                          <p>
                            <strong>Description:</strong> {email.description}
                          </p>
                          <p>
                            <strong>Created:</strong> {email.createdAt.toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Emails received:</strong> {email.emailsReceived}
                          </p>
                          {email.lastUsed && (
                            <p>
                              <strong>Last used:</strong> {email.lastUsed.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
