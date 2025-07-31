"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Lock,
  Eye,
  Wifi,
  Smartphone,
  Users,
  Mail,
  Activity,
  Code,
  QrCode,
  Brain,
  Zap,
  Globe,
  FileText,
  Search,
  AlertTriangle,
} from "lucide-react"

const features = [
  {
    category: "AI-Powered Assistant",
    icon: Brain,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    items: [
      {
        name: "Natural Language Processing",
        description: "Understand security queries in plain English and automatically execute appropriate tools",
        icon: Brain,
      },
      {
        name: "Intelligent Tool Selection",
        description: "AI automatically chooses the best tools based on your security needs and context",
        icon: Zap,
      },
      {
        name: "Real-time Analysis",
        description: "Get instant security insights with live data fetching and analysis",
        icon: Activity,
      },
      {
        name: "Contextual Recommendations",
        description: "Receive personalized security advice based on your specific situation",
        icon: Search,
      },
    ],
  },
  {
    category: "Password Security",
    icon: Lock,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900",
    items: [
      {
        name: "Cryptographic Password Generation",
        description: "Generate truly random passwords using cryptographically secure methods",
        icon: Lock,
      },
      {
        name: "Advanced Strength Analysis",
        description: "Entropy-based password analysis with crack time estimation and pattern detection",
        icon: Shield,
      },
      {
        name: "Bulk Password Generation",
        description: "Generate multiple unique passwords at once for different accounts",
        icon: FileText,
      },
      {
        name: "Custom Character Sets",
        description: "Customize password generation with specific character requirements",
        icon: Code,
      },
    ],
  },
  {
    category: "Privacy & Breach Protection",
    icon: Eye,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    items: [
      {
        name: "Comprehensive Breach Checking",
        description: "Check email addresses against multiple breach databases including HaveIBeenPwned",
        icon: Eye,
      },
      {
        name: "Browser Privacy Audit",
        description: "Analyze browser fingerprinting, tracking, and privacy settings",
        icon: Shield,
      },
      {
        name: "Email Masking",
        description: "Generate and manage masked email addresses for enhanced privacy",
        icon: Mail,
      },
      {
        name: "Privacy Scoring",
        description: "Get quantified privacy scores with actionable improvement recommendations",
        icon: Activity,
      },
    ],
  },
  {
    category: "Network Security",
    icon: Wifi,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900",
    items: [
      {
        name: "Advanced Network Scanning",
        description: "Scan for open ports, services, and potential vulnerabilities",
        icon: Wifi,
      },
      {
        name: "DNS Leak Detection",
        description: "Identify DNS leaks and verify VPN/proxy effectiveness",
        icon: Globe,
      },
      {
        name: "IP Geolocation Analysis",
        description: "Analyze IP addresses for geographic location and potential risks",
        icon: Search,
      },
      {
        name: "Network Mapping",
        description: "Visualize network topology and identify security weak points",
        icon: Activity,
      },
    ],
  },
  {
    category: "Mobile & App Security",
    icon: Smartphone,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900",
    items: [
      {
        name: "APK Permission Analysis",
        description: "Analyze Android app permissions for privacy and security risks",
        icon: Smartphone,
      },
      {
        name: "App Behavior Monitoring",
        description: "Monitor app behaviors and detect suspicious activities",
        icon: Eye,
      },
      {
        name: "Privacy Risk Scoring",
        description: "Score apps based on their privacy and security implications",
        icon: Shield,
      },
      {
        name: "Permission Recommendations",
        description: "Get recommendations on which permissions to grant or revoke",
        icon: AlertTriangle,
      },
    ],
  },
  {
    category: "System Monitoring",
    icon: Activity,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900",
    items: [
      {
        name: "Real-time System Metrics",
        description: "Monitor CPU, memory, and disk usage in real-time",
        icon: Activity,
      },
      {
        name: "Process Analysis",
        description: "Analyze running processes for security threats and resource usage",
        icon: Search,
      },
      {
        name: "Performance Optimization",
        description: "Identify performance bottlenecks and optimization opportunities",
        icon: Zap,
      },
      {
        name: "Security Event Logging",
        description: "Track and log security-related system events",
        icon: FileText,
      },
    ],
  },
  {
    category: "Data Analysis Tools",
    icon: Code,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    items: [
      {
        name: "JSON Beautification",
        description: "Format, validate, and analyze complex JSON data structures",
        icon: Code,
      },
      {
        name: "QR Code Analysis",
        description: "Scan and analyze QR codes for content safety and potential threats",
        icon: QrCode,
      },
      {
        name: "Fake Data Generation",
        description: "Generate realistic test data for development and testing purposes",
        icon: Users,
      },
      {
        name: "Data Validation",
        description: "Validate data formats and detect potential security issues",
        icon: Shield,
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Comprehensive Security Features</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          GuardianAI provides a complete suite of cybersecurity tools powered by artificial intelligence. Each feature
          is designed to work seamlessly together, providing layered security protection.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            12+ Security Tools
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            AI-Powered Analysis
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            Real-time Protection
          </Badge>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="space-y-8">
        {features.map((category, categoryIndex) => {
          const CategoryIcon = category.icon
          return (
            <div key={categoryIndex} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                  <CategoryIcon className={`size-5 ${category.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                  <p className="text-sm text-muted-foreground">{category.items.length} features in this category</p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {category.items.map((feature, featureIndex) => {
                  const FeatureIcon = feature.icon
                  return (
                    <Card key={featureIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <FeatureIcon className={`size-5 ${category.color}`} />
                          {feature.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Key Benefits */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="text-center">Why Choose GuardianAI?</CardTitle>
          <CardDescription className="text-center">
            Unique advantages that set us apart from other security tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
                <Brain className="size-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">AI-First Approach</h3>
              <p className="text-sm text-muted-foreground">
                Every tool is enhanced with AI capabilities for smarter analysis and recommendations
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                <Zap className="size-6 text-green-500" />
              </div>
              <h3 className="font-semibold">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Live data fetching ensures you always have the most current security information
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto">
                <Shield className="size-6 text-purple-500" />
              </div>
              <h3 className="font-semibold">Privacy-First</h3>
              <p className="text-sm text-muted-foreground">
                Most analysis happens locally in your browser - your data never leaves your device
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mx-auto">
                <Globe className="size-6 text-orange-500" />
              </div>
              <h3 className="font-semibold">No Setup Required</h3>
              <p className="text-sm text-muted-foreground">
                Most tools work without API keys or complex configuration - just open and use
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="size-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto">
                <Users className="size-6 text-red-500" />
              </div>
              <h3 className="font-semibold">User-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Complex security concepts presented in an intuitive, easy-to-understand interface
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="size-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto">
                <Activity className="size-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold">Comprehensive Coverage</h3>
              <p className="text-sm text-muted-foreground">
                From passwords to network security - all your cybersecurity needs in one place
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">12+</div>
            <div className="text-sm text-muted-foreground">Security Tools</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">7</div>
            <div className="text-sm text-muted-foreground">Tool Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Free to Use</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
