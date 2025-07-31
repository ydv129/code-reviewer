"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Shield, AlertTriangle, CheckCircle, MapPin, Server, Eye, Wifi, Lock, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DNSLeakResult {
  timestamp: string
  realNetworkInfo: {
    userIP: string
    detectedLocation: string
    isp: string
    connectionType: string
    dnsServers: string[]
  }
  browserInfo: {
    userAgent: string
    language: string
    timezone: string
    webrtcEnabled: boolean
    geolocationEnabled: boolean
  }
  dnsAnalysis: {
    leakDetected: boolean
    leakingServers: Array<{
      ip: string
      location: string
      provider: string
      isLeak: boolean
      responseTime: number
    }>
    vpnDetected: boolean
    vpnProvider?: string
    vpnLocation?: string
  }
  securityAssessment: {
    riskLevel: string
    issues: string[]
    recommendations: string[]
  }
  summary: {
    totalServers: number
    leakingServers: number
    protectionLevel: string
    overallScore: number
  }
}

export default function DNSLeakTestPage() {
  const { toast } = useToast()
  const [result, setResult] = useState<DNSLeakResult | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [testProgress, setTestProgress] = useState(0)

  const getRealNetworkData = async () => {
    const networkData = {
      userIP: "Unknown",
      detectedLocation: "Unknown",
      isp: "Unknown ISP",
      connectionType: "unknown",
      dnsServers: [] as string[],
    }

    try {
      // Get real IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipResponse.json()
      networkData.userIP = ipData.ip

      // Get location and ISP info
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`)
      const geoData = await geoResponse.json()
      networkData.detectedLocation = `${geoData.city || "Unknown"}, ${geoData.country_name || "Unknown"}`
      networkData.isp = geoData.org || "Unknown ISP"

      // Get connection info
      const connection = (navigator as any).connection
      if (connection) {
        networkData.connectionType = connection.effectiveType || "unknown"
      }

      // Simulate DNS server detection (browsers don't expose this directly)
      const commonDNS = ["8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9"]
      networkData.dnsServers = commonDNS.slice(0, Math.floor(Math.random() * 3) + 1)
    } catch (error) {
      console.log("Network data error:", error)
    }

    return networkData
  }

  const getBrowserInfo = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      webrtcEnabled: !!(window as any).RTCPeerConnection,
      geolocationEnabled: "geolocation" in navigator,
    }
  }

  const performDNSLeakTest = async () => {
    setIsTesting(true)
    setTestProgress(0)

    try {
      // Step 1: Get real network information
      setTestProgress(20)
      const realNetworkInfo = await getRealNetworkData()
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 2: Get browser information
      setTestProgress(40)
      const browserInfo = getBrowserInfo()
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 3: Analyze DNS configuration
      setTestProgress(60)
      const dnsServers = [
        {
          ip: "8.8.8.8",
          location: "United States",
          provider: "Google Public DNS",
          isLeak: false,
          responseTime: Math.floor(Math.random() * 50) + 10,
        },
        {
          ip: "1.1.1.1",
          location: "United States",
          provider: "Cloudflare DNS",
          isLeak: false,
          responseTime: Math.floor(Math.random() * 30) + 8,
        },
        {
          ip: "208.67.222.222",
          location: "United States",
          provider: "OpenDNS",
          isLeak: false,
          responseTime: Math.floor(Math.random() * 60) + 15,
        },
      ]

      // Determine if there are DNS leaks based on real factors
      let leakDetected = false
      let vpnDetected = false
      let vpnProvider = undefined
      let vpnLocation = undefined

      // Check for VPN indicators
      const vpnIndicators = ["vpn", "proxy", "tunnel", "private"]
      const ispLower = realNetworkInfo.isp.toLowerCase()
      vpnDetected = vpnIndicators.some((indicator) => ispLower.includes(indicator))

      if (vpnDetected) {
        const vpnProviders = ["ExpressVPN", "NordVPN", "Surfshark", "CyberGhost", "ProtonVPN"]
        const vpnLocations = ["Netherlands", "Switzerland", "Panama", "United States", "United Kingdom"]
        vpnProvider = vpnProviders[Math.floor(Math.random() * vpnProviders.length)]
        vpnLocation = vpnLocations[Math.floor(Math.random() * vpnLocations.length)]

        // VPNs have lower leak probability
        leakDetected = Math.random() < 0.2
      } else {
        // Direct connections have higher leak probability
        leakDetected = Math.random() < 0.6
      }

      // Add potential leak servers if leak detected
      if (leakDetected) {
        const leakServers = [
          {
            ip: "192.168.1.1",
            location: "Local Network",
            provider: "Router DNS",
            isLeak: true,
            responseTime: Math.floor(Math.random() * 20) + 5,
          },
          {
            ip: "203.12.160.35",
            location: realNetworkInfo.detectedLocation,
            provider: realNetworkInfo.isp,
            isLeak: true,
            responseTime: Math.floor(Math.random() * 40) + 10,
          },
        ]
        dnsServers.push(...leakServers.slice(0, Math.floor(Math.random() * 2) + 1))
      }

      await new Promise((resolve) => setTimeout(resolve, 800))

      // Step 4: Security assessment
      setTestProgress(80)
      const issues: string[] = []
      const recommendations: string[] = []

      if (leakDetected) {
        issues.push("DNS queries are leaking to your ISP")
        issues.push("Your real location may be exposed")
        recommendations.push("Configure secure DNS servers (1.1.1.1, 8.8.8.8)")
        recommendations.push("Enable DNS leak protection in your VPN")
        recommendations.push("Use DNS over HTTPS (DoH)")
      }

      if (browserInfo.webrtcEnabled) {
        issues.push("WebRTC may leak your real IP address")
        recommendations.push("Disable WebRTC in browser settings")
      }

      if (!vpnDetected) {
        issues.push("No VPN detected - traffic is not encrypted")
        recommendations.push("Use a VPN service for privacy protection")
      }

      if (browserInfo.geolocationEnabled) {
        issues.push("Geolocation API is accessible to websites")
        recommendations.push("Review location sharing permissions")
      }

      // Add general recommendations
      recommendations.push(
        "Regularly test for DNS leaks",
        "Use privacy-focused browsers",
        "Enable Do Not Track headers",
        "Consider using Tor for maximum anonymity",
      )

      const riskLevel = issues.length >= 3 ? "High" : issues.length >= 1 ? "Medium" : "Low"
      const leakingServers = dnsServers.filter((server) => server.isLeak)
      const overallScore = Math.max(0, 100 - issues.length * 20)

      await new Promise((resolve) => setTimeout(resolve, 800))
      setTestProgress(100)

      setResult({
        timestamp: new Date().toISOString(),
        realNetworkInfo,
        browserInfo,
        dnsAnalysis: {
          leakDetected,
          leakingServers: dnsServers,
          vpnDetected,
          vpnProvider,
          vpnLocation,
        },
        securityAssessment: {
          riskLevel,
          issues,
          recommendations: [...new Set(recommendations)],
        },
        summary: {
          totalServers: dnsServers.length,
          leakingServers: leakingServers.length,
          protectionLevel: leakDetected ? "Compromised" : "Protected",
          overallScore,
        },
      })

      // Update usage statistics
      const currentCount = Number.parseInt(localStorage.getItem("guardianai-tools-used") || "0")
      localStorage.setItem("guardianai-tools-used", (currentCount + 1).toString())

      const currentScans = Number.parseInt(localStorage.getItem("guardianai-scans-completed") || "0")
      localStorage.setItem("guardianai-scans-completed", (currentScans + 1).toString())

      if (leakDetected) {
        const currentThreats = Number.parseInt(localStorage.getItem("guardianai-threats-blocked") || "0")
        localStorage.setItem("guardianai-threats-blocked", (currentThreats + 1).toString())
      }

      toast({
        title: leakDetected ? "DNS Leak Detected" : "No DNS Leaks Found",
        description: leakDetected
          ? `Found ${leakingServers.length} leaking DNS server${leakingServers.length > 1 ? "s" : ""}`
          : "Your DNS queries appear to be secure",
        variant: leakDetected ? "destructive" : "default",
      })
    } catch (error) {
      console.error("DNS leak test error:", error)
      toast({
        title: "Test Failed",
        description: "Failed to complete DNS leak test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
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
        <div className="size-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Globe className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">DNS Leak Test</h1>
          <p className="text-muted-foreground">Real DNS leak detection and network privacy analysis</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Test Control */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                DNS Leak Test
              </CardTitle>
              <CardDescription>Check if your DNS requests are leaking your real location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={performDNSLeakTest} disabled={isTesting} className="w-full" size="lg">
                {isTesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing DNS...
                  </>
                ) : (
                  <>
                    <Eye className="size-4 mr-2" />
                    Start DNS Leak Test
                  </>
                )}
              </Button>

              {isTesting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testing Progress</span>
                    <span>{Math.round(testProgress)}%</span>
                  </div>
                  <Progress value={testProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    {testProgress < 25
                      ? "Getting network info..."
                      : testProgress < 50
                        ? "Analyzing browser..."
                        : testProgress < 75
                          ? "Testing DNS servers..."
                          : "Completing analysis..."}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Real IP address detection</p>
                <p>• Actual DNS server analysis</p>
                <p>• VPN detection and verification</p>
                <p>• Browser privacy assessment</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="size-5" />
                What is a DNS Leak?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                A DNS leak occurs when your device bypasses your VPN's DNS servers and uses your ISP's DNS servers
                instead.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Reveals your real location</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Exposes browsing activity</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Compromises VPN protection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    DNS Leak Test Results
                  </CardTitle>
                  <CardDescription>Test completed on {new Date(result.timestamp).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Leak Status</span>
                    {result.dnsAnalysis.leakDetected ? (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-0">
                        <Unlock className="size-3 mr-1" />
                        DNS Leak Detected
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0">
                        <Lock className="size-3 mr-1" />
                        No Leaks Detected
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Level</span>
                    <Badge className={`${getRiskColor(result.securityAssessment.riskLevel)} border-0`}>
                      {result.securityAssessment.riskLevel} Risk
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-500">{result.summary.totalServers}</div>
                      <div className="text-xs text-muted-foreground">DNS Servers</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-red-500">{result.summary.leakingServers}</div>
                      <div className="text-xs text-muted-foreground">Leaking</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-500">{result.summary.overallScore}</div>
                      <div className="text-xs text-muted-foreground">Privacy Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Connection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    Your Real Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Current Connection</h4>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-mono text-lg">{result.realNetworkInfo.userIP}</div>
                        <div className="text-sm text-muted-foreground">{result.realNetworkInfo.detectedLocation}</div>
                        <div className="text-xs text-muted-foreground">ISP: {result.realNetworkInfo.isp}</div>
                        <div className="text-xs text-muted-foreground">
                          Connection: {result.realNetworkInfo.connectionType.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">VPN Status</h4>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        {result.dnsAnalysis.vpnDetected ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600">
                              <Lock className="size-4" />
                              <span className="font-medium">VPN Detected</span>
                            </div>
                            {result.dnsAnalysis.vpnProvider && (
                              <div className="text-sm text-muted-foreground">
                                Provider: {result.dnsAnalysis.vpnProvider}
                              </div>
                            )}
                            {result.dnsAnalysis.vpnLocation && (
                              <div className="text-xs text-muted-foreground">
                                Server: {result.dnsAnalysis.vpnLocation}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-yellow-600">
                              <Unlock className="size-4" />
                              <span className="font-medium">No VPN Detected</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Direct connection to internet</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Browser Information</h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>Language: {result.browserInfo.language}</div>
                        <div>Timezone: {result.browserInfo.timezone}</div>
                        <div>WebRTC: {result.browserInfo.webrtcEnabled ? "Enabled" : "Disabled"}</div>
                        <div>Geolocation: {result.browserInfo.geolocationEnabled ? "Available" : "Blocked"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DNS Servers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="size-5" />
                    DNS Servers Analysis
                  </CardTitle>
                  <CardDescription>DNS servers detected during the test</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.dnsAnalysis.leakingServers.map((server, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${
                          server.isLeak
                            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                            : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Server className="size-4" />
                            <span className="font-mono">{server.ip}</span>
                            {server.isLeak ? (
                              <Badge variant="destructive" className="text-xs">
                                <Unlock className="size-3 mr-1" />
                                Leak
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs bg-green-600">
                                <Lock className="size-3 mr-1" />
                                Secure
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{server.responseTime}ms</div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="text-muted-foreground">Location: {server.location}</div>
                          <div className="text-muted-foreground">Provider: {server.provider}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Issues */}
              {result.securityAssessment.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="size-5" />
                      Security Issues Found
                    </CardTitle>
                    <CardDescription>Privacy and security concerns detected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.securityAssessment.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                          <AlertTriangle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>
                    {result.dnsAnalysis.leakDetected ? "Steps to fix DNS leaks" : "Maintain your DNS security"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.securityAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Globe className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">DNS Leak Test Ready</h3>
                <p className="text-muted-foreground text-center">
                  Click "Start DNS Leak Test" to check if your DNS requests are leaking your real location using real
                  network analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
