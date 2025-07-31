"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Users,
  Heart,
  Send,
  CheckCircle,
  Star,
  GitBranch,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DevelopersPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    })
    setFormData({ name: "", email: "", subject: "", message: "", type: "general" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Meet the Developers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          GuardianAI is built by passionate developers who believe in making cybersecurity accessible to everyone. Get
          in touch with us or contribute to the project.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5" />
                Get in Touch
              </CardTitle>
              <CardDescription>
                Have questions, suggestions, or want to collaborate? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Message Type</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="security">Security Issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your message"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="size-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
              <CardDescription>Follow our work and connect with us on various platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button variant="outline" className="justify-start bg-transparent" asChild>
                  <a href="https://github.com/guardianai" target="_blank" rel="noopener noreferrer">
                    <Github className="size-4 mr-2" />
                    GitHub - View Source Code
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>

                <Button variant="outline" className="justify-start bg-transparent" asChild>
                  <a href="https://linkedin.com/company/guardianai" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="size-4 mr-2" />
                    LinkedIn - Professional Updates
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>

                <Button variant="outline" className="justify-start bg-transparent" asChild>
                  <a href="mailto:hello@guardianai.dev">
                    <Mail className="size-4 mr-2" />
                    Email - Direct Contact
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Info & Contribution */}
        <div className="space-y-6">
          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="size-5" />
                Project Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Star className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12+</div>
                    <div className="text-xs text-muted-foreground">Security Tools</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <GitBranch className="size-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Open</div>
                    <div className="text-xs text-muted-foreground">Source Project</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Users className="size-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Community</div>
                    <div className="text-xs text-muted-foreground">Driven Development</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Heart className="size-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Free</div>
                    <div className="text-xs text-muted-foreground">Forever & Always</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Contribute to GuardianAI
              </CardTitle>
              <CardDescription>Help us make cybersecurity more accessible for everyone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Report Bugs</h4>
                    <p className="text-sm text-muted-foreground">
                      Found an issue? Report it on GitHub with detailed steps to reproduce.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Suggest Features</h4>
                    <p className="text-sm text-muted-foreground">
                      Have ideas for new security tools or improvements? We'd love to hear them.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Submit Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Contribute new tools, fix bugs, or improve existing features with pull requests.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Improve Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Help make GuardianAI more accessible by improving documentation and guides.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Spread the Word</h4>
                    <p className="text-sm text-muted-foreground">
                      Share GuardianAI with others who care about cybersecurity and privacy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">AI/ML</Badge>
                  <Badge variant="secondary">Cybersecurity</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Philosophy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="size-5" />
                Our Development Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Security First:</strong> Every feature is designed with security and privacy as the top
                  priority
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>User-Centric:</strong> Complex security concepts made simple and accessible to everyone
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Open Source:</strong> Transparency and community collaboration drive our development
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>Continuous Innovation:</strong> Always exploring new ways to enhance cybersecurity
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="text-center gradient-border">
        <CardContent className="py-8">
          <MessageSquare className="size-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ready to Get Involved?</h3>
          <p className="text-muted-foreground mb-6">
            Whether you're a developer, security professional, or just someone who cares about privacy, there's a place
            for you in the GuardianAI community.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="https://github.com/guardianai" target="_blank" rel="noopener noreferrer">
                <Github className="size-4 mr-2" />
                View on GitHub
              </a>
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("message")?.focus()}>
              <Mail className="size-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
