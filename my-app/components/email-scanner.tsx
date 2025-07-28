"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSettings } from "@/hooks/use-settings"
import { Mail, Upload, AlertTriangle, CheckCircle2, Volume2, VolumeX, Link } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface EmailAnalysis {
  from: string
  replyTo: string
  subject: string
  isSpoofed: boolean
  links: string[]
  riskLevel: "low" | "medium" | "high"
}

export function EmailScanner() {
  const [emailContent, setEmailContent] = useState("")
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { settings } = useSettings()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.name.endsWith(".eml")) {
      const reader = new FileReader()
      reader.onload = () => {
        setEmailContent(reader.result as string)
      }
      reader.readAsText(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "message/rfc822": [".eml"],
    },
    multiple: false,
  })

  const analyzeEmail = () => {
    if (!emailContent.trim()) return

    // Parse email headers
    const fromMatch = emailContent.match(/^From:\s*(.+)$/m)
    const replyToMatch = emailContent.match(/^Reply-To:\s*(.+)$/m)
    const subjectMatch = emailContent.match(/^Subject:\s*(.+)$/m)

    const from = fromMatch?.[1] || "Unknown"
    const replyTo = replyToMatch?.[1] || from
    const subject = subjectMatch?.[1] || "No Subject"

    // Check for spoofing
    const isSpoofed = from !== replyTo && replyToMatch

    // Extract links
    const linkRegex = /(https?:\/\/[^\s"<>]+)/g
    const links = Array.from(emailContent.matchAll(linkRegex), (m) => m[1])

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "low"
    if (isSpoofed || links.length > 5) {
      riskLevel = "high"
    } else if (links.length > 0) {
      riskLevel = "medium"
    }

    setAnalysis({
      from,
      replyTo,
      subject,
      isSpoofed,
      links,
      riskLevel,
    })
  }

  const speakResults = () => {
    if (!analysis || !window.speechSynthesis) return

    const text = `Email analysis complete. From: ${analysis.from}. Subject: ${analysis.subject}. ${
      analysis.isSpoofed ? "Warning: Email spoofing detected." : "No spoofing detected."
    } Found ${analysis.links.length} links. Risk level: ${analysis.riskLevel}.`

    const utterance = new SpeechSynthesisUtterance(text)

    // Set voice based on user preference
    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find((voice) =>
      settings.ttsVoice === "male"
        ? voice.name.toLowerCase().includes("male") || voice.name.toLowerCase().includes("david")
        : voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("zira"),
    )

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle>Email Security Scanner</CardTitle>
          </div>
          <CardDescription>Analyze emails for spoofing attempts and suspicious content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste Content</TabsTrigger>
              <TabsTrigger value="upload">Upload .eml File</TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <Textarea
                placeholder="Paste your email content here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-32"
              />
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p>Drop the .eml file here...</p>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Drop an .eml file here, or click to select</p>
                    <p className="text-sm text-muted-foreground mt-1">Email files exported from your email client</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={analyzeEmail} disabled={!emailContent.trim()} className="w-full mt-4">
            Analyze Email
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Analysis Results</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={isSpeaking ? stopSpeaking : speakResults}>
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Badge variant={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel.toUpperCase()} RISK</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Email Details</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">From:</span> {analysis.from}
                  </p>
                  <p>
                    <span className="font-medium">Reply-To:</span> {analysis.replyTo}
                  </p>
                  <p>
                    <span className="font-medium">Subject:</span> {analysis.subject}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Security Status</h4>
                <div className="flex items-center space-x-2">
                  {analysis.isSpoofed ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">{analysis.isSpoofed ? "Spoofing Detected" : "No Spoofing Detected"}</span>
                </div>
              </div>
            </div>

            {analysis.links.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Links Found ({analysis.links.length})</span>
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {analysis.links.map((link, index) => (
                    <p key={index} className="text-sm text-muted-foreground break-all">
                      {link}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {analysis.isSpoofed && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Email Spoofing Warning</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      The From and Reply-To addresses differ, which may indicate email spoofing. Be cautious about
                      responding to this email or clicking any links.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
