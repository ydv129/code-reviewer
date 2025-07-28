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
import { Progress } from "@/components/ui/progress"
import { checkUrl } from "@/lib/actions"
import { Link, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
})

type UrlForm = z.infer<typeof urlSchema>

interface AnalysisResult {
  result: string
  confidence: number
}

export function UrlChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const form = useForm<UrlForm>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = async (data: UrlForm) => {
    setIsLoading(true)
    setResult(null)
    try {
      const analysis = await checkUrl({ url: data.url })
      setResult(analysis)
    } catch (error) {
      console.error("URL analysis failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getResultColor = (confidence: number) => {
    if (confidence >= 80) return "destructive"
    if (confidence >= 50) return "secondary"
    return "default"
  }

  const getResultIcon = (confidence: number) => {
    if (confidence >= 80) return <AlertTriangle className="h-4 w-4" />
    if (confidence >= 50) return <AlertTriangle className="h-4 w-4" />
    return <CheckCircle2 className="h-4 w-4" />
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Link className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">URL Security Checker</CardTitle>
              <CardDescription className="text-sm">
                Analyze URLs for potential phishing attempts and malicious content
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL to Check</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} className="text-sm sm:text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing URL...
                  </>
                ) : (
                  "Check URL"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              {getResultIcon(result.confidence)}
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Threat Level</span>
                <Badge variant={getResultColor(result.confidence)}>
                  {result.confidence >= 80 ? "High Risk" : result.confidence >= 50 ? "Medium Risk" : "Low Risk"}
                </Badge>
              </div>
              <Progress value={result.confidence} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">Confidence: {result.confidence}%</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analysis Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.result}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
