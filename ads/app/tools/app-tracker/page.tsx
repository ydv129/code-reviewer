"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Eye,
  MapPin,
  Mic,
  Camera,
  Phone,
  MessageSquare,
  Wifi,
  Search,
  AlertTriangle,
  XCircle,
} from "lucide-react"

interface AppAnalysis {
  name: string
  packageName: string
  privacyScore: number
  permissions: Permission[]
  trackers: Tracker[]
  dataCollection: DataCollection[]
  riskLevel: "low" | "medium" | "high"
}

interface Permission {
  name: string
  description: string
  risk: "low" | "medium" | "high"
  icon: any
}

interface Tracker {
  name: string
  company: string
  purpose: string
  risk: "low" | "medium" | "high"
}

interface DataCollection {
  type: string
  description: string
  shared: boolean
  sold: boolean
}

export default function AppTrackerPage() {
  const [appUrl, setAppUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AppAnalysis | null>(null)

  const analyzeApp = async () => {
    if (!appUrl.trim()) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis data
    const mockAnalysis: AppAnalysis = {
      name: "Social Media App",
      packageName: "com.example.socialapp",
      privacyScore: 45,
      riskLevel: "high",
      permissions: [
        {
          name: "Camera",
          description: "Access to device camera for photos and videos",
          risk: "medium",
          icon: Camera,
        },
        {
          name: "Microphone",
          description: "Record audio and access microphone",
          risk: "high",
          icon: Mic,
        },
        {
          name: "Location",
          description: "Access precise location data",
          risk: "high",
          icon: MapPin,
        },
        {
          name: "Contacts",
          description: "Read and modify contact information",
          risk: "high",
          icon: Phone,
        },
        {
          name: "SMS",
          description: "Send and receive text messages",
          risk: "medium",
          icon: MessageSquare,
        },
        {
          name: "Network",
          description: "Full network access and WiFi connection info",
          risk: "low",
          icon: Wifi,
        },
      ],
      trackers: [
        {
          name: "Google Analytics",
          company: "Google",
          purpose: "Usage analytics and crash reporting",
          risk: "medium",
        },
        {
          name: "Facebook SDK",
          company: "Meta",
          purpose: "Social features and advertising",
          risk: "high",
        },
        {
          name: "AdMob",
          company: "Google",
          purpose: "Advertisement delivery",
          risk: "medium",
        },
        {
          name: "Crashlytics",
          company: "Google",
          purpose: "Crash reporting and performance monitoring",
          risk: "low",
        },
      ],
      dataCollection: [
        {
          type: "Personal Information",
          description: "Name, email, phone number, profile data",
          shared: true,
          sold: false,
        },
        {
          type: "Location Data",
          description: "Precise location, location history",
          shared: true,
          sold: true,
        },
        {
          type: "Usage Data",
          description: "App interactions, feature usage, time spent",
          shared: true,
          sold: false,
        },
        {
          type: "Device Information",
          description: "Device ID, OS version, hardware specs",
          shared: true,
          sold: false,
        },
        {
          type: "Contact Information",
          description: "Address book contacts and relationships",
          shared: true,
          sold: true,
        },
      ],
    }

    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">App Privacy Tracker</h1>
          <p className="text-muted-foreground">Analyze app permissions and privacy practices</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze App Privacy</CardTitle>
          <CardDescription>Enter an app store URL or package name to analyze its privacy practices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter app store URL or package name..."
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={analyzeApp} disabled={isAnalyzing || !appUrl.trim()}>
              {isAnalyzing ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{analysis.name}</CardTitle>
                  <CardDescription>{analysis.packageName}</CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.privacyScore)}`}>
                    {analysis.privacyScore}/100
                  </div>
                  <p className="text-sm text-muted-foreground">Privacy Score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Privacy Score</span>
                    <Badge className={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel.toUpperCase()} RISK</Badge>
                  </div>
                  <Progress value={analysis.privacyScore} className="h-2" />
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This app has {analysis.riskLevel} privacy risk due to extensive data collection and sharing
                    practices.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="permissions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="trackers">Trackers</TabsTrigger>
              <TabsTrigger value="data">Data Collection</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Permissions</CardTitle>
                  <CardDescription>Permissions requested by this app and their risk levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <permission.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{permission.name}</h4>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                        <Badge className={getRiskColor(permission.risk)}>{permission.risk.toUpperCase()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trackers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Libraries</CardTitle>
                  <CardDescription>Third-party tracking libraries detected in this app</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.trackers.map((tracker, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{tracker.name}</h4>
                          <p className="text-sm text-muted-foreground">by {tracker.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">{tracker.purpose}</p>
                        </div>
                        <Badge className={getRiskColor(tracker.risk)}>{tracker.risk.toUpperCase()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Collection Practices</CardTitle>
                  <CardDescription>Types of data collected and how they're used</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.dataCollection.map((data, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{data.type}</h4>
                          <div className="flex gap-2">
                            {data.shared && (
                              <Badge variant="outline" className="text-orange-600">
                                <Eye className="mr-1 h-3 w-3" />
                                Shared
                              </Badge>
                            )}
                            {data.sold && (
                              <Badge variant="outline" className="text-red-600">
                                <XCircle className="mr-1 h-3 w-3" />
                                Sold
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{data.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
