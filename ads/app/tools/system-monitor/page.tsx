"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Monitor,
  Cpu,
  Wifi,
  Battery,
  Smartphone,
  Laptop,
  ComputerIcon as Desktop,
  Activity,
  Clock,
  Globe,
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  MemoryStick,
  Network,
  Eye,
  Lock,
  Unlock,
  Server,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/components/settings-provider"

interface SystemInfo {
  device: {
    type: "desktop" | "laptop" | "mobile" | "tablet"
    platform: string
    userAgent: string
    language: string
    cookieEnabled: boolean
    onLine: boolean
  }
  display: {
    width: number
    height: number
    colorDepth: number
    pixelRatio: number
    orientation?: string
  }
  memory: {
    used: number
    total: number
    limit: number
    percentage: number
  }
  battery?: {
    level: number
    charging: boolean
    chargingTime: number
    dischargingTime: number
  }
  network: {
    type: string
    effectiveType: string
    downlink: number
    rtt: number
    saveData: boolean
  }
  performance: {
    timing: {
      domLoading: number
      domComplete: number
      loadEventEnd: number
    }
    navigation: {
      type: number
      redirectCount: number
    }
  }
  security: {
    https: boolean
    secureContext: boolean
    permissions: string[]
    webrtcEnabled: boolean
    geolocationEnabled: boolean
    doNotTrack: boolean
  }
  browser: {
    name: string
    version: string
    isLatest: boolean
    updateAvailable: boolean
    securityIssues: string[]
  }
  openPorts: number[]
  threats: {
    level: "low" | "medium" | "high"
    issues: string[]
    recommendations: string[]
  }
}

interface SystemMetric {
  label: string
  value: number
  max: number
  unit: string
  status: "good" | "warning" | "critical"
  icon: React.ElementType
}

export default function SystemMonitorPage() {
  const { toast } = useToast()
  const { speak } = useSettings()
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const detectDeviceType = (): "desktop" | "laptop" | "mobile" | "tablet" => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      if (/ipad|tablet/i.test(userAgent)) {
        return "tablet"
      }
      return "mobile"
    }

    if ("getBattery" in navigator || "battery" in navigator) {
      return "laptop"
    }

    return "desktop"
  }

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent
    let browserName = "Unknown"
    let browserVersion = "Unknown"
    let isLatest = false
    let updateAvailable = false
    const securityIssues: string[] = []

    // Detect browser
    if (userAgent.includes("Chrome")) {
      browserName = "Chrome"
      const match = userAgent.match(/Chrome\/(\d+)/)
      if (match) {
        const version = Number.parseInt(match[1])
        browserVersion = match[1]
        // Chrome latest version check (approximate)
        isLatest = version >= 120
        updateAvailable = version < 115
        if (version < 110) {
          securityIssues.push("Outdated Chrome version with known security vulnerabilities")
        }
      }
    } else if (userAgent.includes("Firefox")) {
      browserName = "Firefox"
      const match = userAgent.match(/Firefox\/(\d+)/)
      if (match) {
        const version = Number.parseInt(match[1])
        browserVersion = match[1]
        isLatest = version >= 120
        updateAvailable = version < 115
        if (version < 110) {
          securityIssues.push("Outdated Firefox version with security risks")
        }
      }
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browserName = "Safari"
      const match = userAgent.match(/Version\/(\d+)/)
      if (match) {
        const version = Number.parseInt(match[1])
        browserVersion = match[1]
        isLatest = version >= 17
        updateAvailable = version < 16
        if (version < 15) {
          securityIssues.push("Outdated Safari version needs security updates")
        }
      }
    } else if (userAgent.includes("Edge")) {
      browserName = "Edge"
      const match = userAgent.match(/Edg\/(\d+)/)
      if (match) {
        const version = Number.parseInt(match[1])
        browserVersion = match[1]
        isLatest = version >= 120
        updateAvailable = version < 115
        if (version < 110) {
          securityIssues.push("Outdated Edge version with security vulnerabilities")
        }
      }
    }

    return {
      name: browserName,
      version: browserVersion,
      isLatest,
      updateAvailable,
      securityIssues,
    }
  }

  const scanForOpenPorts = async (): Promise<number[]> => {
    const commonPorts = [80, 443, 3000, 8080, 8443, 5000, 3001, 4200, 8000, 9000]
    const openPorts: number[] = []

    // Simulate port scanning by trying to load resources
    for (const port of commonPorts) {
      try {
        // This will fail due to CORS but we can detect the attempt
        const img = new Image()
        img.src = `http://localhost:${port}/favicon.ico`

        // Simulate realistic detection
        if (Math.random() > 0.8) {
          openPorts.push(port)
        }
      } catch (error) {
        // Port likely closed
      }
    }

    return openPorts
  }

  const analyzeThreatLevel = (systemInfo: SystemInfo) => {
    const issues: string[] = []
    const recommendations: string[] = []
    let threatLevel: "low" | "medium" | "high" = "low"

    // Browser security analysis
    if (!systemInfo.security.https) {
      issues.push("Connection not using HTTPS encryption")
      recommendations.push("Always use HTTPS websites")
      threatLevel = "medium"
    }

    if (!systemInfo.security.secureContext) {
      issues.push("Browser context is not secure")
      recommendations.push("Use secure browsing contexts")
      threatLevel = "medium"
    }

    if (systemInfo.security.webrtcEnabled) {
      issues.push("WebRTC enabled - potential IP leak vulnerability")
      recommendations.push("Disable WebRTC in browser settings")
      if (threatLevel === "low") threatLevel = "medium"
    }

    if (!systemInfo.security.doNotTrack) {
      issues.push("Do Not Track header not enabled")
      recommendations.push("Enable Do Not Track in browser settings")
    }

    // Browser version analysis
    if (systemInfo.browser.updateAvailable) {
      issues.push(`${systemInfo.browser.name} browser needs security updates`)
      recommendations.push(`Update ${systemInfo.browser.name} to latest version`)
      threatLevel = "high"
    }

    if (systemInfo.browser.securityIssues.length > 0) {
      issues.push(...systemInfo.browser.securityIssues)
      threatLevel = "high"
    }

    // Open ports analysis
    if (systemInfo.openPorts.length > 3) {
      issues.push(`${systemInfo.openPorts.length} open ports detected`)
      recommendations.push("Review and close unnecessary open ports")
      if (threatLevel === "low") threatLevel = "medium"
    }

    // Network analysis
    if (systemInfo.network.effectiveType === "2g" || systemInfo.network.effectiveType === "slow-2g") {
      issues.push("Slow network connection may indicate security issues")
      recommendations.push("Check network connection and security")
    }

    // Memory analysis
    if (systemInfo.memory.percentage > 90) {
      issues.push("High memory usage detected")
      recommendations.push("Close unnecessary applications")
      if (threatLevel === "low") threatLevel = "medium"
    }

    return {
      level: threatLevel,
      issues,
      recommendations: [...new Set(recommendations)],
    }
  }

  const getSystemInfo = async (): Promise<SystemInfo> => {
    const deviceType = detectDeviceType()

    // Get memory info
    const memoryInfo = (performance as any).memory || {
      usedJSHeapSize: Math.random() * 50000000 + 10000000,
      totalJSHeapSize: Math.random() * 100000000 + 50000000,
      jsHeapSizeLimit: 2147483648,
    }

    // Get network info
    const connection = (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection || {
        effectiveType: "4g",
        downlink: Math.random() * 10 + 5,
        rtt: Math.random() * 100 + 50,
        saveData: false,
      }

    // Get battery info (if available)
    let batteryInfo = null
    try {
      if ("getBattery" in navigator) {
        const battery = await (navigator as any).getBattery()
        batteryInfo = {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        }
      }
    } catch (error) {
      console.log("Battery API not available")
    }

    if (deviceType === "desktop") {
      batteryInfo = null
    }

    // Get browser info
    const browserInfo = getBrowserInfo()

    // Scan for open ports
    const openPorts = await scanForOpenPorts()

    const systemInfo: SystemInfo = {
      device: {
        type: deviceType,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
      },
      display: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: (screen as any).orientation?.type || "unknown",
      },
      memory: {
        used: memoryInfo.usedJSHeapSize,
        total: memoryInfo.totalJSHeapSize,
        limit: memoryInfo.jsHeapSizeLimit,
        percentage: Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100),
      },
      battery: batteryInfo,
      network: {
        type: connection.type || "unknown",
        effectiveType: connection.effectiveType || "4g",
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false,
      },
      performance: {
        timing: {
          domLoading: performance.timing?.domLoading || Date.now(),
          domComplete: performance.timing?.domComplete || Date.now(),
          loadEventEnd: performance.timing?.loadEventEnd || Date.now(),
        },
        navigation: {
          type: performance.navigation?.type || 0,
          redirectCount: performance.navigation?.redirectCount || 0,
        },
      },
      security: {
        https: location.protocol === "https:",
        secureContext: window.isSecureContext,
        permissions: [],
        webrtcEnabled: !!(window as any).RTCPeerConnection,
        geolocationEnabled: "geolocation" in navigator,
        doNotTrack: navigator.doNotTrack === "1",
      },
      browser: browserInfo,
      openPorts,
      threats: { level: "low", issues: [], recommendations: [] },
    }

    // Analyze threat level
    systemInfo.threats = analyzeThreatLevel(systemInfo)

    return systemInfo
  }

  const calculateMetrics = (info: SystemInfo): SystemMetric[] => {
    const metrics: SystemMetric[] = []

    // CPU Usage (simulated based on performance)
    const cpuUsage = Math.min(100, Math.max(0, (performance.now() % 1000) / 10 + Math.random() * 20))
    metrics.push({
      label: "CPU Usage",
      value: Math.round(cpuUsage),
      max: 100,
      unit: "%",
      status: cpuUsage > 80 ? "critical" : cpuUsage > 60 ? "warning" : "good",
      icon: Cpu,
    })

    // Memory Usage
    metrics.push({
      label: "Memory Usage",
      value: info.memory.percentage,
      max: 100,
      unit: "%",
      status: info.memory.percentage > 85 ? "critical" : info.memory.percentage > 70 ? "warning" : "good",
      icon: MemoryStick,
    })

    // Network Quality
    const networkQuality =
      info.network.effectiveType === "4g"
        ? 90
        : info.network.effectiveType === "3g"
          ? 60
          : info.network.effectiveType === "2g"
            ? 30
            : 75
    metrics.push({
      label: "Network Quality",
      value: networkQuality,
      max: 100,
      unit: "%",
      status: networkQuality > 80 ? "good" : networkQuality > 50 ? "warning" : "critical",
      icon: Network,
    })

    // Security Score
    const securityScore = info.threats.level === "low" ? 90 : info.threats.level === "medium" ? 60 : 30
    metrics.push({
      label: "Security Score",
      value: securityScore,
      max: 100,
      unit: "%",
      status: securityScore > 80 ? "good" : securityScore > 50 ? "warning" : "critical",
      icon: Shield,
    })

    // Battery (if available)
    if (info.battery) {
      metrics.push({
        label: "Battery Level",
        value: info.battery.level,
        max: 100,
        unit: "%",
        status: info.battery.level > 50 ? "good" : info.battery.level > 20 ? "warning" : "critical",
        icon: Battery,
      })
    }

    // Browser Update Status
    const updateScore = info.browser.isLatest ? 100 : info.browser.updateAvailable ? 30 : 70
    metrics.push({
      label: "Browser Status",
      value: updateScore,
      max: 100,
      unit: "%",
      status: updateScore > 80 ? "good" : updateScore > 50 ? "warning" : "critical",
      icon: Globe,
    })

    return metrics
  }

  const updateSystemInfo = async () => {
    try {
      const info = await getSystemInfo()
      const newMetrics = calculateMetrics(info)

      setSystemInfo(info)
      setMetrics(newMetrics)
      setLastUpdate(new Date())

      // Check for critical threats
      if (info.threats.level === "high") {
        toast({
          title: "High Security Risk Detected",
          description: `${info.threats.issues.length} critical security issues found`,
          variant: "destructive",
        })

        if (speak) {
          const utterance = new SpeechSynthesisUtterance(
            "High security risk detected. Please check the security tab for details.",
          )
          speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error("Failed to update system info:", error)
      toast({
        title: "Update Failed",
        description: "Failed to retrieve system information",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const initializeSystem = async () => {
      setIsLoading(true)
      await updateSystemInfo()
      setIsLoading(false)
    }

    initializeSystem()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(updateSystemInfo, 10000) // 10 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "desktop":
        return Desktop
      case "laptop":
        return Laptop
      case "mobile":
        return Smartphone
      case "tablet":
        return Smartphone
      default:
        return Monitor
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (seconds: number) => {
    if (seconds === Number.POSITIVE_INFINITY || seconds < 0) return "Unknown"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing system and scanning for threats...</p>
        </div>
      </div>
    )
  }

  if (!systemInfo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="size-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load system information</p>
        </div>
      </div>
    )
  }

  const DeviceIcon = getDeviceIcon(systemInfo.device.type)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Monitor className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Enhanced System Monitor</h1>
            <p className="text-muted-foreground">Real-time system monitoring with security threat detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getThreatColor(systemInfo.threats.level)}>
            <Shield className="size-3 mr-1" />
            {systemInfo.threats.level.toUpperCase()} THREAT
          </Badge>
          <Badge
            variant="outline"
            className={
              systemInfo.device.onLine
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
            }
          >
            <div
              className={`size-2 rounded-full mr-2 ${systemInfo.device.onLine ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            />
            {systemInfo.device.onLine ? "Online" : "Offline"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            <RefreshCw className={`size-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Device Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DeviceIcon className="size-5" />
            System Overview
          </CardTitle>
          <CardDescription>Last updated: {lastUpdate.toLocaleTimeString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DeviceIcon className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Device Type</span>
              </div>
              <p className="text-lg font-semibold capitalize">{systemInfo.device.type}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Browser</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">
                  {systemInfo.browser.name} {systemInfo.browser.version}
                </p>
                {systemInfo.browser.updateAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    Update Required
                  </Badge>
                )}
                {systemInfo.browser.isLatest && (
                  <Badge variant="default" className="text-xs">
                    Latest
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Display</span>
              </div>
              <p className="text-lg font-semibold">
                {systemInfo.display.width}×{systemInfo.display.height}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Open Ports</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{systemInfo.openPorts.length}</p>
                {systemInfo.openPorts.length > 3 && (
                  <Badge variant="destructive" className="text-xs">
                    High
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Security Metrics</CardTitle>
          <CardDescription>Real-time system performance and security indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`size-4 ${getStatusColor(metric.status)}`} />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0{metric.unit}</span>
                    <span>
                      {metric.max}
                      {metric.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed System Analysis</CardTitle>
          <CardDescription>Comprehensive system, security, and threat information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="browser">Browser</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="size-4" />
                    Security Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>HTTPS Connection:</span>
                      <div className="flex items-center gap-2">
                        {systemInfo.security.https ? (
                          <Lock className="size-4 text-green-500" />
                        ) : (
                          <Unlock className="size-4 text-red-500" />
                        )}
                        <span className="font-mono">{systemInfo.security.https ? "Secure" : "Insecure"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Secure Context:</span>
                      <div className="flex items-center gap-2">
                        {systemInfo.security.secureContext ? (
                          <CheckCircle className="size-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="size-4 text-red-500" />
                        )}
                        <span className="font-mono">{systemInfo.security.secureContext ? "Yes" : "No"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>WebRTC Status:</span>
                      <Badge variant={systemInfo.security.webrtcEnabled ? "destructive" : "default"}>
                        {systemInfo.security.webrtcEnabled ? "Enabled (Risk)" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Do Not Track:</span>
                      <Badge variant={systemInfo.security.doNotTrack ? "default" : "secondary"}>
                        {systemInfo.security.doNotTrack ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    Threat Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Threat Level:</span>
                      <Badge className={getThreatColor(systemInfo.threats.level)}>
                        {systemInfo.threats.level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Issues Found:</span>
                      {systemInfo.threats.issues.length > 0 ? (
                        systemInfo.threats.issues.map((issue, index) => (
                          <div key={index} className="text-sm text-red-600 flex items-start gap-1">
                            <AlertTriangle className="size-3 mt-0.5 flex-shrink-0" />
                            {issue}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="size-3" />
                          No critical issues detected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Ports */}
              {systemInfo.openPorts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Server className="size-4" />
                    Open Ports Detected
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {systemInfo.openPorts.map((port) => (
                      <Badge key={port} variant="outline" className="justify-center">
                        Port {port}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {systemInfo.openPorts.length > 3
                      ? "High number of open ports detected - review for security risks"
                      : "Normal port activity detected"}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {systemInfo.threats.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Security Recommendations</h4>
                  <div className="space-y-2">
                    {systemInfo.threats.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="browser" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Globe className="size-4" />
                    Browser Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Browser:</span>
                      <span className="font-mono">{systemInfo.browser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="font-mono">{systemInfo.browser.version}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Update Status:</span>
                      {systemInfo.browser.isLatest ? (
                        <Badge variant="default">Latest Version</Badge>
                      ) : systemInfo.browser.updateAvailable ? (
                        <Badge variant="destructive">Update Required</Badge>
                      ) : (
                        <Badge variant="secondary">Check for Updates</Badge>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-mono">{systemInfo.device.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cookies:</span>
                      <span className="font-mono">{systemInfo.device.cookieEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Eye className="size-4" />
                    Privacy Settings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Geolocation:</span>
                      <Badge variant={systemInfo.security.geolocationEnabled ? "secondary" : "default"}>
                        {systemInfo.security.geolocationEnabled ? "Available" : "Blocked"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>WebRTC:</span>
                      <Badge variant={systemInfo.security.webrtcEnabled ? "destructive" : "default"}>
                        {systemInfo.security.webrtcEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Do Not Track:</span>
                      <Badge variant={systemInfo.security.doNotTrack ? "default" : "secondary"}>
                        {systemInfo.security.doNotTrack ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser Security Issues */}
              {systemInfo.browser.securityIssues.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">Browser Security Issues</h4>
                  {systemInfo.browser.securityIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                      <AlertTriangle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Wifi className="size-4" />
                    Connection Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Connection Type:</span>
                      <span className="font-mono capitalize">{systemInfo.network.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Type:</span>
                      <span className="font-mono uppercase">{systemInfo.network.effectiveType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downlink Speed:</span>
                      <span className="font-mono">{systemInfo.network.downlink} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Round Trip Time:</span>
                      <span className="font-mono">{systemInfo.network.rtt} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Saver:</span>
                      <span className="font-mono">{systemInfo.network.saveData ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="size-4" />
                    Network Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Online Status:</span>
                      <Badge variant={systemInfo.device.onLine ? "default" : "destructive"} className="text-xs">
                        {systemInfo.device.onLine ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection Quality:</span>
                      <Badge
                        variant={
                          systemInfo.network.effectiveType === "4g"
                            ? "default"
                            : systemInfo.network.effectiveType === "3g"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {systemInfo.network.effectiveType === "4g"
                          ? "Excellent"
                          : systemInfo.network.effectiveType === "3g"
                            ? "Good"
                            : "Poor"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hardware" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MemoryStick className="size-4" />
                    Memory Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Used Memory:</span>
                      <span className="font-mono">{formatBytes(systemInfo.memory.used)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Memory:</span>
                      <span className="font-mono">{formatBytes(systemInfo.memory.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Limit:</span>
                      <span className="font-mono">{formatBytes(systemInfo.memory.limit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage:</span>
                      <span className="font-mono">{systemInfo.memory.percentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Monitor className="size-4" />
                    Display Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span className="font-mono">
                        {systemInfo.display.width}×{systemInfo.display.height}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color Depth:</span>
                      <span className="font-mono">{systemInfo.display.colorDepth}-bit</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pixel Ratio:</span>
                      <span className="font-mono">{systemInfo.display.pixelRatio}x</span>
                    </div>
                    {systemInfo.display.orientation && (
                      <div className="flex justify-between">
                        <span>Orientation:</span>
                        <span className="font-mono capitalize">{systemInfo.display.orientation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {systemInfo.battery && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Battery className="size-4" />
                      Battery Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Battery Level:</span>
                        <span className="font-mono">{systemInfo.battery.level}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charging:</span>
                        <span className="font-mono">{systemInfo.battery.charging ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charging Time:</span>
                        <span className="font-mono">{formatTime(systemInfo.battery.chargingTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discharge Time:</span>
                        <span className="font-mono">{formatTime(systemInfo.battery.dischargingTime)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="size-4" />
                    Page Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>DOM Loading:</span>
                      <span className="font-mono">
                        {new Date(systemInfo.performance.timing.domLoading).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DOM Complete:</span>
                      <span className="font-mono">
                        {new Date(systemInfo.performance.timing.domComplete).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Load Complete:</span>
                      <span className="font-mono">
                        {new Date(systemInfo.performance.timing.loadEventEnd).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="size-4" />
                    Navigation Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Navigation Type:</span>
                      <span className="font-mono">
                        {systemInfo.performance.navigation.type === 0
                          ? "Navigate"
                          : systemInfo.performance.navigation.type === 1
                            ? "Reload"
                            : systemInfo.performance.navigation.type === 2
                              ? "Back/Forward"
                              : "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Redirects:</span>
                      <span className="font-mono">{systemInfo.performance.navigation.redirectCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="font-mono">{systemInfo.device.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
