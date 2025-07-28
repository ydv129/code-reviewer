"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Sparkles,
  Zap,
  Lock,
  Activity,
  TrendingUp,
  Database,
  Cpu,
  CheckCircle,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useGSAP, useGSAPHover } from "@/hooks/use-gsap"
import { gsap } from "gsap"
import { getToolsForSidebar } from "@/lib/tool-registry"
import type { Tool } from "@/app/page"

interface DashboardProps {
  setActiveTool: (tool: Tool) => void
}

export function Dashboard({ setActiveTool }: DashboardProps) {
  const { user } = useAuth()
  const containerRef = useGSAP()
  const { hoverIn, hoverOut } = useGSAPHover()
  const [usageData, setUsageData] = useState({
    totalScans: 1247,
    threatsBlocked: 23,
    apiCalls: 8934,
    storageUsed: 2.4,
    lastScan: "2 minutes ago",
    monthlyLimit: 10000,
    currentUsage: 8934,
  })

  const sidebarTools = getToolsForSidebar()

  useEffect(() => {
    // Hero animation
    const tl = gsap.timeline()
    tl.fromTo(
      ".hero-shield",
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" },
    )
      .fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")

    // Floating animation for shield
    gsap.to(".hero-shield", {
      y: -10,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    })

    // Animate usage stats
    if (user) {
      gsap.fromTo(
        ".usage-stat",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.5 },
      )
    }
  }, [user])

  const handleToolClick = (toolId: Tool) => {
    setActiveTool(toolId)
  }

  const handleGetStarted = () => {
    if (user) {
      setActiveTool("url-checker")
    } else {
      window.location.href = "/login"
    }
  }

  const usagePercentage = (usageData.currentUsage / usageData.monthlyLimit) * 100

  const activityData = [
    { tool: "URL Checker", scans: 456, threats: 12, lastUsed: "5 min ago", status: "active" },
    { tool: "Email Scanner", scans: 234, threats: 8, lastUsed: "1 hour ago", status: "active" },
    { tool: "Image Scanner", scans: 189, threats: 3, lastUsed: "2 hours ago", status: "idle" },
    { tool: "Security Auditor", scans: 67, threats: 0, lastUsed: "1 day ago", status: "idle" },
    { tool: "AI Assistant", queries: 301, responses: 301, lastUsed: "10 min ago", status: "active" },
  ]

  if (user) {
    // Logged-in user dashboard with consumption and activity
    return (
      <div ref={containerRef} className="min-h-screen guardian-bg">
        <div className="container-responsive py-6 sm:py-8 lg:py-10">
          {/* Welcome Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="hero-title text-2xl sm:text-3xl lg:text-4xl font-bold guardian-gradient-text mb-2">
                  Welcome back, {user.displayName || "User"}!
                </h1>
                <p className="hero-subtitle text-muted-foreground text-sm sm:text-base">
                  Your security dashboard • Last login: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="hero-shield">
                <div className="relative">
                  <div className="absolute inset-0 guardian-gradient rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <Shield className="relative h-12 w-12 sm:h-14 sm:w-14 text-white guardian-gradient p-3 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <Card className="usage-stat guardian-card border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Today
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold">{usageData.totalScans.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Scans</p>
                </div>
              </CardContent>
            </Card>

            <Card className="usage-stat guardian-card border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {usageData.threatsBlocked > 0 ? "Alert" : "Safe"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold">{usageData.threatsBlocked}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Threats Blocked</p>
                </div>
              </CardContent>
            </Card>

            <Card className="usage-stat guardian-card border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Database className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    API
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold">{usageData.apiCalls.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">API Calls</p>
                </div>
              </CardContent>
            </Card>

            <Card className="usage-stat guardian-card border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Cpu className="h-5 w-5 text-purple-500" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    GB
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-bold">{usageData.storageUsed}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Storage Used</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <Card className="gsap-fade-in guardian-card border-0 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Monthly Usage</CardTitle>
                    <CardDescription>API calls and resource consumption</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">+12%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>API Usage</span>
                  <span className="font-medium">
                    {usageData.currentUsage.toLocaleString()} / {usageData.monthlyLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{usagePercentage.toFixed(1)}% used</span>
                  <span>{(usageData.monthlyLimit - usageData.currentUsage).toLocaleString()} remaining</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {[
                    { label: "URL Scans", value: "3.2K", color: "bg-blue-500" },
                    { label: "Image Analysis", value: "1.8K", color: "bg-green-500" },
                    { label: "Email Checks", value: "2.1K", color: "bg-yellow-500" },
                    { label: "AI Queries", value: "1.8K", color: "bg-purple-500" },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-full h-2 ${item.color} rounded-full mb-2`}></div>
                      <p className="text-sm font-medium">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="gsap-fade-in guardian-card border-0">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                <CardDescription>Jump to your most used tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sidebarTools.slice(0, 4).map((tool) => (
                  <Button
                    key={tool.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleToolClick(tool.id as Tool)}
                  >
                    <div className={`p-2 rounded-lg ${tool.color.replace("text-", "bg-")}/10 mr-3`}>
                      <tool.icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{tool.title}</p>
                      <p className="text-xs text-muted-foreground">{tool.description.slice(0, 30)}...</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="gsap-fade-in guardian-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                  <CardDescription>Your security tool usage and results</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${activity.status === "active" ? "bg-green-500/10" : "bg-gray-500/10"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${activity.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{activity.tool}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {activity.scans ? `${activity.scans} scans` : `${activity.queries} queries`} • Last used{" "}
                          {activity.lastUsed}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.threats !== undefined && activity.threats > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {activity.threats} threats
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Safe
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Public dashboard for non-logged-in users
  return (
    <div ref={containerRef} className="min-h-screen guardian-bg">
      <div className="container-responsive py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="flex justify-center">
            <div className="hero-shield relative">
              <div className="absolute inset-0 guardian-gradient rounded-full blur-xl opacity-30 animate-pulse"></div>
              <Shield className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-white guardian-gradient p-4 rounded-full" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="hero-title heading-responsive font-bold guardian-gradient-text">Welcome to GuardianAI</h1>
            <p className="hero-subtitle text-responsive text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your comprehensive AI-powered security assistant. Protect yourself from online threats with our suite of
              advanced security analysis tools powered by cutting-edge artificial intelligence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="guardian-gradient text-white px-8 py-3 text-base font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-base font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="gsap-fade-in subheading-responsive font-bold mb-4">Advanced Security Tools</h2>
            <p className="gsap-fade-in text-responsive text-muted-foreground max-w-2xl mx-auto">
              Comprehensive protection powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sidebarTools.map((tool, index) => (
              <Card
                key={index}
                className="gsap-scale-in guardian-card border-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                onMouseEnter={(e) => hoverIn(e.currentTarget)}
                onMouseLeave={(e) => hoverOut(e.currentTarget)}
                onClick={() => handleToolClick(tool.id as Tool)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${tool.color.replace("text-", "from-")} to-${tool.color.replace("text-", "").replace("500", "400")} shadow-lg`}
                    >
                      <tool.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed mb-4">
                    {tool.description}
                  </CardDescription>
                  <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform duration-300">
                    Explore Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Tips */}
        <div className="gsap-fade-in">
          <Card className="guardian-card border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center space-x-3">
                <div className="p-2 guardian-gradient rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">Essential Security Tips</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Stay safe online with these expert-recommended practices
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: Shield, text: "Always verify URLs before clicking, especially in emails" },
                  { icon: Zap, text: "Be cautious of QR codes from unknown sources" },
                  { icon: Lock, text: "Check sender authenticity in emails, especially for sensitive requests" },
                  { icon: Sparkles, text: "Use strong, unique passwords for all your accounts" },
                  { icon: Shield, text: "Keep your software and browsers updated" },
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 p-2 guardian-gradient rounded-lg">
                      <tip.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base leading-relaxed">{tip.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "99.9%", label: "Threat Detection" },
              { number: "24/7", label: "Protection" },
              { number: "1M+", label: "Scans Daily" },
              { number: "< 1s", label: "Analysis Time" },
            ].map((stat, index) => (
              <div key={index} className="gsap-scale-in text-center p-6 guardian-card border-0 rounded-2xl">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold guardian-gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
