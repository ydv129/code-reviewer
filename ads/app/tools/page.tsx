"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Lock,
  Shield,
  Eye,
  Wifi,
  Smartphone,
  Users,
  Mail,
  Activity,
  Code,
  QrCode,
  ExternalLink,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"

const tools = [
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate cryptographically secure passwords with customizable options",
    icon: Lock,
    category: "Authentication",
    status: "active",
    features: ["Customizable length", "Character sets", "Entropy calculation", "Bulk generation"],
    href: "/tools/password-generator",
  },
  {
    id: "password-strength",
    name: "Password Strength Meter",
    description: "Analyze password strength with entropy-based crack time estimation",
    icon: Shield,
    category: "Authentication",
    status: "active",
    features: ["Entropy analysis", "Crack time estimation", "Security recommendations", "Pattern detection"],
    href: "/tools/password-strength",
  },
  {
    id: "breach-checker",
    name: "Breach Checker",
    description: "Check if your email has been compromised in known data breaches",
    icon: Eye,
    category: "Privacy",
    status: "active",
    features: ["HaveIBeenPwned integration", "Historical breach data", "Risk assessment", "Monitoring alerts"],
    href: "/tools/breach-checker",
  },
  {
    id: "privacy-audit",
    name: "Privacy Audit",
    description: "Comprehensive browser and system privacy assessment",
    icon: Shield,
    category: "Privacy",
    status: "active",
    features: ["Browser fingerprinting", "Permission analysis", "Tracking detection", "Privacy scoring"],
    href: "/tools/privacy-audit",
  },
  {
    id: "network-scanner",
    name: "Network Scanner",
    description: "Analyze network security, open ports, and potential vulnerabilities",
    icon: Wifi,
    category: "Network",
    status: "active",
    features: ["Port scanning", "Service detection", "Vulnerability assessment", "Network mapping"],
    href: "/tools/network-scanner",
  },
  {
    id: "dns-leak",
    name: "DNS Leak Test",
    description: "Detect DNS leaks and verify VPN/proxy effectiveness",
    icon: Wifi,
    category: "Network",
    status: "active",
    features: ["DNS server detection", "Leak identification", "VPN verification", "Geographic analysis"],
    href: "/tools/dns-leak",
  },
  {
    id: "app-tracker",
    name: "App Tracker",
    description: "Monitor Android APKs for suspicious permissions and behaviors",
    icon: Smartphone,
    category: "Mobile",
    status: "beta",
    features: ["Permission analysis", "Behavior monitoring", "Risk scoring", "Privacy assessment"],
    href: "/tools/app-tracker",
  },
  {
    id: "fake-data",
    name: "Fake Data Generator",
    description: "Generate realistic test data for development and testing",
    icon: Users,
    category: "Development",
    status: "active",
    features: ["Multiple data types", "Localization support", "Bulk generation", "Export formats"],
    href: "/tools/fake-data",
  },
  {
    id: "email-mask",
    name: "Email Mask Generator",
    description: "Create and manage masked email addresses for privacy",
    icon: Mail,
    category: "Privacy",
    status: "active",
    features: ["Alias generation", "Forwarding rules", "Tracking protection", "Disposable emails"],
    href: "/tools/email-mask",
  },
  {
    id: "system-monitor",
    name: "System Monitor",
    description: "Real-time monitoring of system resources and processes",
    icon: Activity,
    category: "System",
    status: "active",
    features: ["CPU monitoring", "Memory usage", "Process tracking", "Performance metrics"],
    href: "/tools/system-monitor",
  },
  {
    id: "json-beautifier",
    name: "JSON Beautifier",
    description: "Format, validate, and analyze JSON data structures",
    icon: Code,
    category: "Development",
    status: "active",
    features: ["Syntax highlighting", "Validation", "Minification", "Tree view"],
    href: "/tools/json-beautifier",
  },
  {
    id: "qr-scanner",
    name: "QR Code Scanner",
    description: "Analyze QR codes for content, safety, and potential threats",
    icon: QrCode,
    category: "Analysis",
    status: "active",
    features: ["Content analysis", "URL safety check", "Malware detection", "Batch processing"],
    href: "/tools/qr-scanner",
  },
]

const categories = ["All", "Authentication", "Privacy", "Network", "Mobile", "Development", "System", "Analysis"]

export default function ToolsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Tools</h1>
          <p className="text-muted-foreground">Comprehensive cybersecurity toolkit with AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Zap className="size-3 mr-1" />
            {tools.filter((t) => t.status === "active").length} Active Tools
          </Badge>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button key={category} variant={category === "All" ? "default" : "outline"} size="sm" className="text-xs">
            {category}
            {category !== "All" && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tools.filter((t) => t.category === category).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const IconComponent = tool.icon
          return (
            <Card key={tool.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <IconComponent className="size-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={tool.status === "active" ? "default" : "secondary"} className="text-xs">
                          {tool.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={tool.href}>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{tool.description}</CardDescription>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href={tool.href}>
                      Launch Tool
                      <ExternalLink className="size-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{tools.length}</div>
                <div className="text-xs text-muted-foreground">Total Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="size-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{tools.filter((t) => t.status === "active").length}</div>
                <div className="text-xs text-muted-foreground">Active Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{categories.length - 1}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-muted-foreground">Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
