"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Users, Lock, Wifi, Eye, Zap } from "lucide-react"
import { useEffect, useState } from "react"

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
  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    { label: "Password Security", value: 85, max: 100, status: "good", icon: Lock },
    { label: "Network Safety", value: 72, max: 100, status: "warning", icon: Wifi },
    { label: "Privacy Score", value: 91, max: 100, status: "good", icon: Eye },
    { label: "System Health", value: 95, max: 100, status: "good", icon: Activity },
  ])

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: "1",
      type: "warning",
      message: "Weak password detected in saved credentials",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "2",
      type: "info",
      message: "Privacy audit completed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      type: "error",
      message: "DNS leak detected - consider using VPN",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
  ])

  const [stats, setStats] = useState({
    toolsUsed: 47,
    threatsBlocked: 12,
    scansCompleted: 156,
    uptime: "99.8%",
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        toolsUsed: prev.toolsUsed + Math.floor(Math.random() * 3),
        scansCompleted: prev.scansCompleted + Math.floor(Math.random() * 2),
      }))
    }, 5000)

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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time cybersecurity monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">All systems operational</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools Used Today</CardTitle>
            <Zap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.toolsUsed}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline size-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.threatsBlocked}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans Completed</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scansCompleted}</div>
            <p className="text-xs text-muted-foreground">Across all tools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Metrics */}
        <Card>
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
                  <Progress value={metric.value} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest security notifications and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
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
              { name: "System Monitor", icon: Activity, href: "/tools/system-monitor" },
            ].map((action, index) => {
              const IconComponent = action.icon
              return (
                <a
                  key={index}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <IconComponent className="size-6 text-primary" />
                  <span className="text-xs font-medium text-center">{action.name}</span>
                </a>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
