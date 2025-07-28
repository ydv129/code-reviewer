"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { checkVulnerabilities } from "@/lib/actions"
import { Search, AlertTriangle, CheckCircle2, Loader2, Shield, Database, Globe, Lock } from "lucide-react"

const auditSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
})

type AuditForm = z.infer<typeof auditSchema>

interface VulnerabilityResult {
  ssl: {
    isVulnerable: boolean
    description: string
    confidence: number
  }
  openPorts: {
    isVulnerable: boolean
    description: string
    confidence: number
  }
  dbInteraction: {
    isVulnerable: boolean
    description: string
    confidence: number
  }
  general: {
    isVulnerable: boolean
    description: string
    confidence: number
  }
  overallRisk: "low" | "medium" | "high" | "critical"
}

export function SecurityAuditor() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VulnerabilityResult | null>(null)

  const form = useForm<AuditForm>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = async (data: AuditForm) => {
    setIsLoading(true)
    setResult(null)
    try {
      const analysis = await checkVulnerabilities({ url: data.url })
      setResult(analysis)
    } catch (error) {
      console.error("Security audit failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  const getVulnerabilityIcon = (isVulnerable: boolean) => {
    return isVulnerable ? (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    ) : (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    )
  }

  const auditSections = [
    {
      key: "ssl",
      title: "SSL/TLS Certificate",
      icon: Lock,
      data: result?.ssl,
    },
    {
      key: "openPorts",
      title: "Open Ports Analysis",
      icon: Globe,
      data: result?.openPorts,
    },
    {
      key: "dbInteraction",
      title: "Database Interaction",
      icon: Database,
      data: result?.dbInteraction,
    },
    {
      key: "general",
      title: "General Vulnerabilities",
      icon: Shield,
      data: result?.general,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle>Security Auditor</CardTitle>
          </div>
          <CardDescription>Comprehensive security analysis and vulnerability assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Performing Security Audit...
                  </>
                ) : (
                  "Start Security Audit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Audit Results</span>
                </CardTitle>
                <Badge variant={getRiskColor(result.overallRisk)} className="text-sm">
                  {result.overallRisk.toUpperCase()} RISK
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {auditSections.map((section) => (
                  <AccordionItem key={section.key} value={section.key}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <section.icon className="h-5 w-5" />
                        <span>{section.title}</span>
                        {section.data && getVulnerabilityIcon(section.data.isVulnerable)}
                        {section.data && (
                          <Badge variant={section.data.isVulnerable ? "destructive" : "default"} className="ml-auto">
                            {section.data.isVulnerable ? "Vulnerable" : "Secure"}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {section.data && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status:</span>
                            <div className="flex items-center space-x-2">
                              {getVulnerabilityIcon(section.data.isVulnerable)}
                              <span className="text-sm">
                                {section.data.isVulnerable ? "Vulnerability Detected" : "No Issues Found"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Confidence:</span>
                            <Badge variant="outline">{section.data.confidence}%</Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Analysis:</span>
                            <p className="text-sm text-muted-foreground mt-1">{section.data.description}</p>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {(result.overallRisk === "high" || result.overallRisk === "critical") && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Critical Security Warning</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This website has been identified as having {result.overallRisk} security risks. Exercise extreme
                      caution when interacting with this site. Consider avoiding entering sensitive information or
                      downloading files from this domain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
