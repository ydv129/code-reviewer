"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Globe,
  Monitor,
  Lock,
  Unlock,
  Cookie,
  MapPin,
  Mic,
  Camera,
  Bell,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrivacyAuditResult {
  auditType: string
  timestamp: string
  privacyScore: number
  status: string
  issues: string[]
  recommendations: string[]
  findings: {
    browser?: {
      cookiesEnabled: boolean
      thirdPartyCookies: boolean
      doNotTrack: boolean
      locationSharing: boolean
      cameraAccess: boolean
      microphoneAccess: boolean
      notificationsEnabled: boolean
      autoplayAllowed: boolean
      passwordSaving: boolean
      formAutofill: boolean
      trackingProtection: boolean
      fingerprinting: string
    }
    system?: {
      telemetryEnabled: boolean
      crashReporting: boolean
      usageStatistics: boolean
      advertisingId: boolean
      locationServices: boolean
      diagnosticData: boolean
      appPermissions: number
      backgroundApps: number
    }
    network?: {
      dnsLeaks: boolean
      ipv6Leaks: boolean
      webrtcLeaks: boolean
      vpnActive: boolean
      encryptedDns: boolean
      httpsEverywhere: boolean
      publicWifi: boolean
    }
  }
  summary: {
    totalChecks: number
    issuesFound: number
    riskLevel: string
    improvementPotential: number
  }
}

export default function PrivacyAuditPage() {
  const { toast } = useToast()
  const [auditType, setAuditType] = useState<"browser" | "system" | "network" | "full">("browser")
  const [result, setResult] = useState<PrivacyAuditResult | null>(null)
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditProgress, setAuditProgress] = useState(0)

  const performAudit = async () => {
    setIsAuditing(true)
    setAuditProgress(0)

    // Simulate progressive audit
    const progressSteps = auditType === "full" ? 12 : 6
    const stepDuration = 600

    for (let i = 0; i <= progressSteps; i++) {
      setAuditProgress((i / progressSteps) * 100)
      await new Promise((resolve) => setTimeout(resolve, stepDuration))
    }

    const issues: string[] = []
    const recommendations: string[] = []
    const findings: any = {}

    // Real browser privacy checks
    if (auditType === "browser" || auditType === "full") {
      const browserFindings = {
        cookiesEnabled: navigator.cookieEnabled,
        thirdPartyCookies: document.cookie.length > 0,
        doNotTrack: navigator.doNotTrack === "1",
        locationSharing: "geolocation" in navigator,
        cameraAccess: "mediaDevices" in navigator,
        microphoneAccess: "mediaDevices" in navigator,
        notificationsEnabled: "Notification" in window,
        autoplayAllowed: true, // Would need more complex detection
        passwordSaving: "credentials" in navigator,
        formAutofill: true, // Browser dependent
        trackingProtection: false, // Would need detection
        fingerprinting: "high", // Simulated
      }

      findings.browser = browserFindings

      if (!browserFindings.doNotTrack) {
        issues.push("Do Not Track header is disabled")
        recommendations.push("Enable Do Not Track in browser privacy settings")
      }
      if (browserFindings.thirdPartyCookies) {
        issues.push("Third-party cookies are enabled")
        recommendations.push("Block third-party cookies to prevent tracking")
      }
      if (browserFindings.locationSharing) {
        issues.push("Location services accessible to websites")
        recommendations.push("Review and restrict location permissions")
      }
      if (!browserFindings.trackingProtection) {
        issues.push("Enhanced tracking protection disabled")
        recommendations.push("Enable enhanced tracking protection")
      }
      if (browserFindings.fingerprinting === "high") {
        issues.push("Browser fingerprinting vulnerability detected")
        recommendations.push("Use privacy-focused browser extensions")
      }
    }

    // System privacy simulation
    if (auditType === "system" || auditType === "full") {
      const systemFindings = {
        telemetryEnabled: Math.random() > 0.4,
        crashReporting: Math.random() > 0.5,
        usageStatistics: Math.random() > 0.6,
        advertisingId: Math.random() > 0.7,
        locationServices: Math.random() > 0.5,
        diagnosticData: Math.random() > 0.4,
        appPermissions: Math.floor(Math.random() * 25) + 10,
        backgroundApps: Math.floor(Math.random() * 15) + 5,
      }

      findings.system = systemFindings

      if (systemFindings.telemetryEnabled) {
        issues.push("System telemetry data collection is active")
        recommendations.push("Disable telemetry in system privacy settings")
      }
      if (systemFindings.advertisingId) {
        issues.push("Advertising ID tracking is enabled")
        recommendations.push("Reset or disable advertising identifier")
      }
      if (systemFindings.appPermissions > 20) {
        issues.push("Many applications have extensive permissions")
        recommendations.push("Review and revoke unnecessary app permissions")
      }
      if (systemFindings.backgroundApps > 10) {
        issues.push("Multiple apps running in background")
        recommendations.push("Limit background app activity")
      }
    }

    // Network privacy simulation
    if (auditType === "network" || auditType === "full") {
      const networkFindings = {
        dnsLeaks: Math.random() > 0.85,
        ipv6Leaks: Math.random() > 0.9,
        webrtcLeaks: Math.random() > 0.7,
        vpnActive: Math.random() > 0.6,
        encryptedDns: Math.random() > 0.5,
        httpsEverywhere: Math.random() > 0.4,
        publicWifi: Math.random() > 0.8,
      }

      findings.network = networkFindings

      if (networkFindings.dnsLeaks) {
        issues.push("Potential DNS leaks detected")
        recommendations.push("Configure secure DNS or use VPN")
      }
      if (networkFindings.webrtcLeaks) {
        issues.push("WebRTC may leak real IP address")
        recommendations.push("Disable WebRTC in browser settings")
      }
      if (!networkFindings.encryptedDns) {
        issues.push("DNS queries are not encrypted")
        recommendations.push("Enable DNS over HTTPS (DoH)")
      }
      if (networkFindings.publicWifi) {
        issues.push("Connected to potentially unsecured network")
        recommendations.push("Use VPN on public networks")
      }
    }

    // Calculate privacy score
    const maxIssues = auditType === "full" ? 20 : auditType === "browser" ? 8 : auditType === "system" ? 6 : 5
    const privacyScore = Math.max(0, Math.min(100, 100 - issues.length * (100 / maxIssues)))

    const status = privacyScore >= 85 ? "Excellent" : privacyScore >= 70 ? "Good" : privacyScore >= 50 ? "Fair" : "Poor"

    // Add general recommendations
    recommendations.push(
      "Use privacy-focused browser extensions",
      "Regularly clear browsing data and cookies",
      "Review app permissions monthly",
      "Use VPN for sensitive activities",
      "Enable two-factor authentication",
      "Keep software updated",
    )

    const totalChecks = auditType === "full" ? 30 : auditType === "browser" ? 12 : auditType === "system" ? 10 : 8

    setResult({
      auditType,
      timestamp: new Date().toISOString(),
      privacyScore,
      status,
      issues,
      recommendations: [...new Set(recommendations)],
      findings,
      summary: {
        totalChecks,
        issuesFound: issues.length,
        riskLevel: issues.length >= 8 ? "High" : issues.length >= 4 ? "Medium" : "Low",
        improvementPotential: Math.max(0, 100 - privacyScore),
      },
    })

    // Update usage statistics
    const currentCount = Number.parseInt(localStorage.getItem("guardianai-tools-used") || "0")
    localStorage.setItem("guardianai-tools-used", (currentCount + 1).toString())

    setIsAuditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300"
      case "Good":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "Fair":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "Poor":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Eye className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Privacy Audit</h1>
          <p className="text-muted-foreground">Comprehensive privacy assessment and protection analysis</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Audit Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Audit Type
              </CardTitle>
              <CardDescription>Choose the scope of your privacy audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={auditType === "browser" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuditType("browser")}
                className="w-full justify-start"
              >
                <Globe className="size-4 mr-2" />
                Browser Privacy
              </Button>
              <Button
                variant={auditType === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuditType("system")}
                className="w-full justify-start"
              >
                <Monitor className="size-4 mr-2" />
                System Privacy
              </Button>
              <Button
                variant={auditType === "network" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuditType("network")}
                className="w-full justify-start"
              >
                <Globe className="size-4 mr-2" />
                Network Privacy
              </Button>
              <Button
                variant={auditType === "full" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuditType("full")}
                className="w-full justify-start"
              >
                <Shield className="size-4 mr-2" />
                Full Audit
              </Button>

              <Button onClick={performAudit} disabled={isAuditing} className="w-full mt-4">
                {isAuditing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Auditing...
                  </>
                ) : (
                  <>
                    <Eye className="size-4 mr-2" />
                    Start Audit
                  </>
                )}
              </Button>

              {isAuditing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(auditProgress)}%</span>
                  </div>
                  <Progress value={auditProgress} className="h-2" />
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Browser: Cookies, tracking, permissions</p>
                <p>• System: Telemetry, app permissions</p>
                <p>• Network: DNS leaks, VPN status</p>
                <p>• Full: Comprehensive analysis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="recommendations">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="size-5" />
                      Privacy Audit Results
                    </CardTitle>
                    <CardDescription>
                      {result.auditType.charAt(0).toUpperCase() + result.auditType.slice(1)} audit completed on{" "}
                      {new Date(result.timestamp).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Privacy Status</span>
                      <Badge className={`${getStatusColor(result.status)} border-0`}>{result.status}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Privacy Score</span>
                        <span className="font-mono">{result.privacyScore}/100</span>
                      </div>
                      <Progress value={result.privacyScore} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-blue-500">{result.summary.totalChecks}</div>
                        <div className="text-xs text-muted-foreground">Checks Performed</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-red-500">{result.summary.issuesFound}</div>
                        <div className="text-xs text-muted-foreground">Issues Found</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-green-500">{result.privacyScore}</div>
                        <div className="text-xs text-muted-foreground">Privacy Score</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-purple-500">{result.summary.improvementPotential}%</div>
                        <div className="text-xs text-muted-foreground">Improvement</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge className={`${getRiskColor(result.summary.riskLevel)} border-0`}>
                        {result.summary.riskLevel} Risk
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4">
                <div className="grid gap-4">
                  {result.findings.browser && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="size-5" />
                          Browser Privacy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Cookie className="size-4" />
                            <span className="text-sm">Third-party Cookies</span>
                            {result.findings.browser.thirdPartyCookies ? (
                              <Unlock className="size-4 text-red-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="size-4" />
                            <span className="text-sm">Do Not Track</span>
                            {result.findings.browser.doNotTrack ? (
                              <Lock className="size-4 text-green-500" />
                            ) : (
                              <Unlock className="size-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span className="text-sm">Location Access</span>
                            {result.findings.browser.locationSharing ? (
                              <Unlock className="size-4 text-red-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="size-4" />
                            <span className="text-sm">Camera Access</span>
                            {result.findings.browser.cameraAccess ? (
                              <Unlock className="size-4 text-yellow-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mic className="size-4" />
                            <span className="text-sm">Microphone Access</span>
                            {result.findings.browser.microphoneAccess ? (
                              <Unlock className="size-4 text-yellow-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Bell className="size-4" />
                            <span className="text-sm">Notifications</span>
                            {result.findings.browser.notificationsEnabled ? (
                              <Unlock className="size-4 text-yellow-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {result.findings.system && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="size-5" />
                          System Privacy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Telemetry</span>
                            {result.findings.system.telemetryEnabled ? (
                              <Unlock className="size-4 text-red-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Advertising ID</span>
                            {result.findings.system.advertisingId ? (
                              <Unlock className="size-4 text-red-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">App Permissions</span>
                            <Badge variant="outline">{result.findings.system.appPermissions}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {result.findings.network && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="size-5" />
                          Network Privacy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">DNS Leaks</span>
                            {result.findings.network.dnsLeaks ? (
                              <Unlock className="size-4 text-red-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">WebRTC Leaks</span>
                            {result.findings.network.webrtcLeaks ? (
                              <Unlock className="size-4 text-red-500" />
                            ) : (
                              <Lock className="size-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">VPN Active</span>
                            {result.findings.network.vpnActive ? (
                              <Lock className="size-4 text-green-500" />
                            ) : (
                              <Unlock className="size-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="issues" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="size-5" />
                      Privacy Issues
                    </CardTitle>
                    <CardDescription>Issues that may compromise your privacy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.issues.length > 0 ? (
                      <div className="space-y-3">
                        {result.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                            <AlertTriangle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{issue}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="size-12 text-green-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">No privacy issues detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Recommendations</CardTitle>
                    <CardDescription>Actionable steps to improve your privacy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Privacy Audit Ready</h3>
                <p className="text-muted-foreground text-center">
                  Select an audit type and click "Start Audit" to begin comprehensive privacy assessment
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
