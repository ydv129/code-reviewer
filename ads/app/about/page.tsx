"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Users, Globe, Lock, Eye, Brain, Target, Rocket, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="size-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="size-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          GuardianAI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI-Powered Cybersecurity Web Assistant designed for modern web users who prioritize security and privacy
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <Brain className="size-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Shield className="size-3 mr-1" />
            Security-First
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            <Zap className="size-3 mr-1" />
            Real-Time
          </Badge>
        </div>
      </div>

      {/* Mission Statement */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-6" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            GuardianAI was created to democratize cybersecurity by providing enterprise-grade security tools to
            everyone, powered by artificial intelligence. In an era where cyber threats are constantly evolving, we
            believe that robust security shouldn't be limited to large corporations with dedicated security teams.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="size-5 text-blue-500" />
              AI-Powered Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our Gemini-powered chatbot can understand natural language queries and automatically execute the right
              security tools for your needs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-yellow-500" />
              Real-Time Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All tools provide real-time analysis with live internet data fetching to ensure you get the most current
              security information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5 text-green-500" />
              No API Keys Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Most tools work without requiring API keys, making security accessible to everyone without complex setup
              procedures.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5 text-purple-500" />
              Privacy-First Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your data stays private. Most analysis happens locally in your browser, and we never store sensitive
              information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-orange-500" />
              User-Friendly Interface
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complex security concepts are presented in an intuitive, easy-to-understand interface suitable for both
              beginners and experts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="size-5 text-red-500" />
              Modular Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Auto-discovery system means new tools are automatically integrated without manual configuration or
              updates.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Built with modern web technologies for performance and security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Next.js 15</Badge>
                <Badge variant="outline">React 18</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">shadcn/ui</Badge>
                <Badge variant="outline">GSAP</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI & Backend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">AI SDK</Badge>
                <Badge variant="outline">Google Gemini</Badge>
                <Badge variant="outline">Vercel Functions</Badge>
                <Badge variant="outline">Web APIs</Badge>
                <Badge variant="outline">Crypto APIs</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Philosophy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-6" />
            Security Philosophy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="size-4" />
                Defense in Depth
              </h4>
              <p className="text-sm text-muted-foreground">
                We believe in layered security approaches. No single tool can protect against all threats, which is why
                we provide a comprehensive suite of complementary tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lock className="size-4" />
                Zero-Trust Verification
              </h4>
              <p className="text-sm text-muted-foreground">
                Every security claim is verified through multiple sources and real-time data. We don't just tell you
                something is secure - we prove it.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="size-4" />
                Education-First
              </h4>
              <p className="text-sm text-muted-foreground">
                We don't just provide tools - we educate users about why security matters and how to maintain good
                security hygiene.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="size-4" />
                Accessibility
              </h4>
              <p className="text-sm text-muted-foreground">
                Security shouldn't be a luxury. Our tools are free, require minimal setup, and work across all devices
                and platforms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Vision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="size-6" />
            Future Vision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">GuardianAI is continuously evolving. Our roadmap includes:</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500" />
              <span className="text-sm">Advanced threat intelligence integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-sm">Mobile app for on-the-go security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-purple-500" />
              <span className="text-sm">Enterprise-grade team collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-orange-500" />
              <span className="text-sm">IoT device security scanning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500" />
              <span className="text-sm">Automated security monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-yellow-500" />
              <span className="text-sm">Integration with popular security tools</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="py-8">
          <Heart className="size-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Join the Security Revolution</h3>
          <p className="text-muted-foreground mb-4">
            Help us make the internet a safer place for everyone. Whether you're a security professional or just someone
            who cares about privacy, GuardianAI is here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Free Forever
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Open Source
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Community Driven
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
