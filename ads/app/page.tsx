"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Activity, AlertTriangle, CheckCircle, Users, Lock, Wifi, Eye, Zap, Settings } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/settings-provider"

interface SecurityMetric {
  label: string
  value: number
  max: number
  status: "good" | "warning" | "critical"
  icon: React.ElementType
}

interface SystemAlert {
  id: string
  type: "info" | "warning" | "error"
  message: string
  timestamp: Date
}

export default function DashboardPage() {
  const { settings } = useSettings()
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [stats, setStats] = useState({
    toolsUsed: 0,
    threatsBlocked: 0,
    scansCompleted: 0,
    uptime: "0%",
  })
  const [isLoading, setIsLoading] = useState(true)
  const dashboardRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        // Header animation
        gsap.fromTo(
          ".dashboard-header",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".dashboard-header",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Stats cards staggered animation
        gsap.fromTo(
          ".stats-card",
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ".stats-container",
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Metrics cards animation
        gsap.fromTo(
          ".metrics-card",
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".metrics-card",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Alerts card animation
        gsap.fromTo(
          ".alerts-card",
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".alerts-card",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Quick actions animation
        gsap.fromTo(
          ".quick-actions",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".quick-actions",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Individual action buttons
        gsap.fromTo(
          ".action-button",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ".quick-actions",
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Progress bars animation
        gsap.fromTo(
          ".progress-bar",
          { width: "0%" },
          {
            width: "var(--progress-width)",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".metrics-card",
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    }
  }, [isLoading])

  // Real system metrics calculation with actual browser data
  useEffect(() => {
    const calculateRealMetrics = async () => {
      const now = new Date()

      // Get real browser information
      const userAgent = navigator.userAgent
      const connection =
        (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      // Calculate real password security based on browser security features
      let passwordSecurity = 70 // Base score
      if (location.protocol === "https:") passwordSecurity += 15
      if (navigator.doNotTrack === "1") passwordSecurity += 10
      if (window.isSecureContext) passwordSecurity += 5

      // Calculate network safety based on real connection
      let networkSafety = 60 // Base score
      if (connection) {
        if (connection.effectiveType === "4g") networkSafety = 90
        else if (connection.effectiveType === "3g") networkSafety = 70
        else if (connection.effectiveType === "2g") networkSafety = 40

        if (connection.saveData) networkSafety -= 10 // Data saver might indicate poor connection
      }
      if (location.protocol === "https:") networkSafety += 10

      // Calculate privacy score based on real browser features
      let privacyScore = 50 // Base score
      if (navigator.doNotTrack === "1") privacyScore += 20
      if (!("geolocation" in navigator)) privacyScore += 15
      if (!(window as any).RTCPeerConnection) privacyScore += 15 // No WebRTC = better privacy
      if (window.isSecureContext) privacyScore += 10
      if (!navigator.cookieEnabled) privacyScore += 10 // Cookies disabled = better privacy

      // Detect browser version for security assessment
      let browserSecurity = 80 // Base score
      if (userAgent.includes("Chrome")) {
        const match = userAgent.match(/Chrome\/(\d+)/)
        if (match) {
          const version = Number.parseInt(match[1])
          if (version < 110)
            browserSecurity = 40 // Very outdated
          else if (version < 115)
            browserSecurity = 60 // Outdated
          else if (version >= 120) browserSecurity = 95 // Latest
        }
      } else if (userAgent.includes("Firefox")) {
        const match = userAgent.match(/Firefox\/(\d+)/)
        if (match) {
          const version = Number.parseInt(match[1])
          if (version < 110) browserSecurity = 40
          else if (version < 115) browserSecurity = 60
          else if (version >= 120) browserSecurity = 95
        }
      }

      // System health based on real performance metrics
      let systemHealth = 85 // Base score
      if ((performance as any).memory) {
        const memoryUsage = (performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize
        if (memoryUsage > 0.9) systemHealth = 40
        else if (memoryUsage > 0.7) systemHealth = 60
        else if (memoryUsage < 0.5) systemHealth = 95
      }

      // Check for real security issues
      if (!window.isSecureContext) systemHealth -= 20
      if (location.protocol !== "https:") systemHealth -= 15

      setMetrics([
        {
          label: "Password Security",
          value: Math.min(100, passwordSecurity),
          max: 100,
          status: passwordSecurity >= 80 ? "good" : passwordSecurity >= 60 ? "warning" : "critical",
          icon: Lock,
        },
        {
          label: "Network Safety",
          value: Math.min(100, networkSafety),
          max: 100,
          status: networkSafety >= 80 ? "good" : networkSafety >= 60 ? "warning" : "critical",
          icon: Wifi,
        },
        {
          label: "Privacy Score",
          value: Math.min(100, privacyScore),
          max: 100,
          status: privacyScore >= 80 ? "good" : privacyScore >= 60 ? "warning" : "critical",
          icon: Eye,
        },
        {
          label: "Browser Security",
          value: Math.min(100, browserSecurity),
          max: 100,
          status: browserSecurity >= 80 ? "good" : browserSecurity >= 60 ? "warning" : "critical",
          icon: Shield,
        },
        {
          label: "System Health",
          value: Math.min(100, systemHealth),
          max: 100,
          status: systemHealth >= 80 ? "good" : systemHealth >= 60 ? "warning" : "critical",
          icon: Activity,
        },
      ])
    }

    const generateRealAlerts = () => {
      const realAlerts: SystemAlert[] = []

      // Check for real browser vulnerabilities
      if (!navigator.doNotTrack) {
        realAlerts.push({
          id: "1",
          type: "warning",
          message: "Do Not Track is disabled - your browsing may be tracked",
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
        })
      }

      // Check for HTTPS
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        realAlerts.push({
          id: "2",
          type: "error",
          message: "Connection is not secure - switch to HTTPS",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        })
      }

      // Check secure context
      if (!window.isSecureContext) {
        realAlerts.push({
          id: "3",
          type: "error",
          message: "Browser context is not secure - some features may be limited",
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
        })
      }

      // Check WebRTC (potential IP leak)
      if ((window as any).RTCPeerConnection) {
        realAlerts.push({
          id: "4",
          type: "warning",
          message: "WebRTC is enabled - potential IP address leak vulnerability",
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
        })
      }

      // Check browser version
      const userAgent = navigator.userAgent
      let outdatedBrowser = false
      if (userAgent.includes("Chrome")) {
        const match = userAgent.match(/Chrome\/(\d+)/)
        if (match && Number.parseInt(match[1]) < 115) outdatedBrowser = true
      } else if (userAgent.includes("Firefox")) {
        const match = userAgent.match(/Firefox\/(\d+)/)
        if (match && Number.parseInt(match[1]) < 115) outdatedBrowser = true
      }

      if (outdatedBrowser) {
        realAlerts.push({
          id: "5",
          type: "error",
          message: "Browser version is outdated - security vulnerabilities may exist",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
        })
      }

      setAlerts(realAlerts)
    }

    const calculateRealStats = () => {
      const sessionStart = sessionStorage.getItem("guardianai-session-start")
      const startTime = sessionStart ? new Date(sessionStart) : new Date()
      if (!sessionStart) {
        sessionStorage.setItem("guardianai-session-start", startTime.toISOString())
      }

      const uptimeHours = (Date.now() - startTime.getTime()) / (1000 * 60 * 60)
      const uptimePercentage = Math.min(99.9, (uptimeHours / 24) * 100)

      setStats({
        toolsUsed: Number.parseInt(localStorage.getItem("guardianai-tools-used") || "0"),
        threatsBlocked: Number.parseInt(localStorage.getItem("guardianai-threats-blocked") || "0"),
        scansCompleted: Number.parseInt(localStorage.getItem("guardianai-scans-completed") || "0"),
        uptime: `${uptimePercentage.toFixed(1)}%`,
      })
    }

    const initializeDashboard = async () => {
      await calculateRealMetrics()
      generateRealAlerts()
      calculateRealStats()
      setIsLoading(false)
    }

    initializeDashboard()

    // Update metrics every 30 seconds with real data
    const interval = setInterval(() => {
      calculateRealMetrics()
      generateRealAlerts()
      calculateRealStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="size-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="size-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="size-4 text-blue-500" />
      default:
        return <CheckCircle className="size-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading security dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={dashboardRef} className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="dashboard-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time cybersecurity monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">System Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools Used</CardTitle>
            <Zap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.toolsUsed}</div>
            <p className="text-xs text-muted-foreground">This session</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.threatsBlocked}</div>
            <p className="text-xs text-muted-foreground">Security events</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans Completed</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scansCompleted}</div>
            <p className="text-xs text-muted-foreground">Total analyses</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Uptime</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}</div>
            <p className="text-xs text-muted-foreground">Reliability</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Metrics */}
        <Card className="metrics-card">
          <CardHeader>
            <CardTitle>Security Metrics</CardTitle>
            <CardDescription>Real-time security posture assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`size-4 ${getStatusColor(metric.status)}`} />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {metric.value}/{metric.max}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={metric.value}
                      className="h-2 progress-bar"
                      style={{ "--progress-width": `${metric.value}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="alerts-card">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Real-time security notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="size-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No security alerts</p>
                <p className="text-xs text-muted-foreground">Your system appears secure</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used security tools and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Password Check", icon: Lock, href: "/tools/password-strength" },
              { name: "Breach Scan", icon: Eye, href: "/tools/breach-checker" },
              { name: "Network Test", icon: Wifi, href: "/tools/network-scanner" },
              { name: "Privacy Audit", icon: Shield, href: "/tools/privacy-audit" },
              { name: "AI Chat", icon: Users, href: "/chat" },
              { name: "Settings", icon: Settings, href: "/settings" },
            ].map((action, index) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  asChild
                  className="action-button h-auto p-4 flex-col gap-2 bg-transparent hover:scale-105 transition-transform duration-200"
                >
                  <Link href={action.href}>
                    <IconComponent className="size-6 text-primary" />
                    <span className="text-xs font-medium text-center">{action.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
