"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Copy, Download, CheckCircle, XCircle, FileText, Minimize, Maximize, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JsonStats {
  size: number
  lines: number
  objects: number
  arrays: number
  strings: number
  numbers: number
  booleans: number
  nulls: number
  depth: number
}

export default function JsonBeautifierPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<JsonStats | null>(null)
  const { toast } = useToast()

  const analyzeJson = (jsonString: string): JsonStats => {
    const stats: JsonStats = {
      size: jsonString.length,
      lines: jsonString.split("\n").length,
      objects: 0,
      arrays: 0,
      strings: 0,
      numbers: 0,
      booleans: 0,
      nulls: 0,
      depth: 0,
    }

    const countTypes = (obj: any, currentDepth = 0): void => {
      stats.depth = Math.max(stats.depth, currentDepth)

      if (obj === null) {
        stats.nulls++
      } else if (typeof obj === "boolean") {
        stats.booleans++
      } else if (typeof obj === "number") {
        stats.numbers++
      } else if (typeof obj === "string") {
        stats.strings++
      } else if (Array.isArray(obj)) {
        stats.arrays++
        obj.forEach((item) => countTypes(item, currentDepth + 1))
      } else if (typeof obj === "object") {
        stats.objects++
        Object.values(obj).forEach((value) => countTypes(value, currentDepth + 1))
      }
    }

    try {
      const parsed = JSON.parse(jsonString)
      countTypes(parsed)
    } catch (e) {
      // Stats will remain at initial values for invalid JSON
    }

    return stats
  }

  const beautifyJson = () => {
    if (!input.trim()) {
      setError("Please enter some JSON to beautify")
      setIsValid(false)
      return
    }

    try {
      const parsed = JSON.parse(input)
      const beautified = JSON.stringify(parsed, null, 2)
      setOutput(beautified)
      setIsValid(true)
      setError("")
      setStats(analyzeJson(input))

      toast({
        title: "JSON beautified successfully",
        description: "Your JSON has been formatted and validated.",
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON format")
      setIsValid(false)
      setOutput("")
      setStats(null)
    }
  }

  const minifyJson = () => {
    if (!input.trim()) {
      setError("Please enter some JSON to minify")
      setIsValid(false)
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setIsValid(true)
      setError("")
      setStats(analyzeJson(input))

      toast({
        title: "JSON minified successfully",
        description: "Your JSON has been compressed and validated.",
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON format")
      setIsValid(false)
      setOutput("")
      setStats(null)
    }
  }

  const validateJson = () => {
    if (!input.trim()) {
      setError("Please enter some JSON to validate")
      setIsValid(false)
      return
    }

    try {
      JSON.parse(input)
      setIsValid(true)
      setError("")
      setStats(analyzeJson(input))

      toast({
        title: "JSON is valid",
        description: "Your JSON syntax is correct.",
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON format")
      setIsValid(false)
      setStats(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "JSON has been copied to your clipboard.",
    })
  }

  const downloadJson = () => {
    if (!output) return

    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "JSON file has been downloaded.",
    })
  }

  const loadSampleJson = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      isActive: true,
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
        coordinates: {
          lat: 40.7128,
          lng: -74.006,
        },
      },
      hobbies: ["reading", "swimming", "coding"],
      spouse: null,
      children: [
        {
          name: "Jane Doe",
          age: 8,
        },
        {
          name: "Bob Doe",
          age: 5,
        },
      ],
    }
    setInput(JSON.stringify(sample))
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setIsValid(null)
    setError("")
    setStats(null)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">JSON Beautifier</h1>
          <p className="text-muted-foreground">Format, validate, and analyze JSON data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Input JSON</CardTitle>
                <CardDescription>Paste your JSON data here</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleJson}>
                  <FileText className="mr-2 h-4 w-4" />
                  Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />

            <div className="flex gap-2 flex-wrap">
              <Button onClick={beautifyJson}>
                <Maximize className="mr-2 h-4 w-4" />
                Beautify
              </Button>
              <Button onClick={minifyJson} variant="outline">
                <Minimize className="mr-2 h-4 w-4" />
                Minify
              </Button>
              <Button onClick={validateJson} variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Validate
              </Button>
            </div>

            {isValid !== null && (
              <Alert>
                {isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>{isValid ? "Valid JSON format" : error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>Formatted JSON result</CardDescription>
                </div>
                {output && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(output)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadJson}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {output ? (
                <Textarea value={output} readOnly className="min-h-[400px] font-mono text-sm" />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Formatted JSON will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>JSON Statistics</CardTitle>
                <CardDescription>Analysis of your JSON data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Size:</span>
                      <Badge variant="outline">{formatBytes(stats.size)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Lines:</span>
                      <Badge variant="outline">{stats.lines}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Depth:</span>
                      <Badge variant="outline">{stats.depth}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Objects:</span>
                      <Badge variant="outline">{stats.objects}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Arrays:</span>
                      <Badge variant="outline">{stats.arrays}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Strings:</span>
                      <Badge variant="outline">{stats.strings}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Numbers:</span>
                      <Badge variant="outline">{stats.numbers}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Booleans:</span>
                      <Badge variant="outline">{stats.booleans}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
