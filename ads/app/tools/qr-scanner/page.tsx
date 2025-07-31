"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Camera, Upload, Download, Copy, Scan, Link, Mail, Phone, Wifi, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRResult {
  data: string
  type: "url" | "email" | "phone" | "wifi" | "location" | "contact" | "text" | "unknown"
  metadata?: any
}

export default function QRScannerPage() {
  const [activeTab, setActiveTab] = useState("scan")
  const [scanResult, setScanResult] = useState<QRResult | null>(null)
  const [generateText, setGenerateText] = useState("")
  const [generateType, setGenerateType] = useState("text")
  const [generatedQR, setGeneratedQR] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const detectQRType = (data: string): QRResult => {
    // URL detection
    if (data.match(/^https?:\/\//)) {
      return { data, type: "url" }
    }

    // Email detection
    if (data.match(/^mailto:/)) {
      return { data, type: "email", metadata: { email: data.replace("mailto:", "") } }
    }

    // Phone detection
    if (data.match(/^tel:/)) {
      return { data, type: "phone", metadata: { phone: data.replace("tel:", "") } }
    }

    // WiFi detection
    if (data.startsWith("WIFI:")) {
      const wifiMatch = data.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*);/)
      if (wifiMatch) {
        return {
          data,
          type: "wifi",
          metadata: {
            security: wifiMatch[1],
            ssid: wifiMatch[2],
            password: wifiMatch[3],
            hidden: wifiMatch[4] === "true",
          },
        }
      }
    }

    // Location detection
    if (data.match(/^geo:/)) {
      const geoMatch = data.match(/geo:([^,]+),([^,]+)/)
      if (geoMatch) {
        return {
          data,
          type: "location",
          metadata: {
            latitude: Number.parseFloat(geoMatch[1]),
            longitude: Number.parseFloat(geoMatch[2]),
          },
        }
      }
    }

    // Contact detection (vCard)
    if (data.startsWith("BEGIN:VCARD")) {
      return { data, type: "contact" }
    }

    // Simple email detection
    if (data.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return { data, type: "email", metadata: { email: data } }
    }

    // Simple phone detection
    if (data.match(/^\+?[\d\s\-$$$$]+$/) && data.replace(/\D/g, "").length >= 10) {
      return { data, type: "phone", metadata: { phone: data } }
    }

    return { data, type: "text" }
  }

  const simulateQRScan = () => {
    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      const sampleQRs = [
        "https://www.example.com",
        "mailto:contact@example.com",
        "tel:+1234567890",
        "WIFI:T:WPA;S:MyNetwork;P:password123;H:false;",
        "geo:40.7128,-74.0060",
        "This is a sample text QR code",
        "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Example Corp\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD",
      ]

      const randomQR = sampleQRs[Math.floor(Math.random() * sampleQRs.length)]
      const result = detectQRType(randomQR)
      setScanResult(result)
      setIsScanning(false)

      toast({
        title: "QR Code scanned successfully",
        description: `Detected ${result.type} data`,
      })
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Simulate QR code reading from image
    setTimeout(() => {
      const result = detectQRType("https://www.example.com/from-image")
      setScanResult(result)

      toast({
        title: "QR Code read from image",
        description: "Successfully extracted QR code data",
      })
    }, 1000)
  }

  const generateQRCode = () => {
    if (!generateText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate QR code",
        variant: "destructive",
      })
      return
    }

    let qrData = generateText

    // Format data based on type
    switch (generateType) {
      case "email":
        qrData = `mailto:${generateText}`
        break
      case "phone":
        qrData = `tel:${generateText}`
        break
      case "url":
        if (!generateText.startsWith("http")) {
          qrData = `https://${generateText}`
        }
        break
    }

    // Simulate QR code generation (in real app, you'd use a QR library)
    const qrCodeSVG = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black" opacity="0.1"/>
        <text x="100" y="100" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="black">
          QR Code
        </text>
        <text x="100" y="120" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="gray">
          ${generateType.toUpperCase()}
        </text>
      </svg>
    `

    setGeneratedQR(`data:image/svg+xml;base64,${btoa(qrCodeSVG)}`)

    toast({
      title: "QR Code generated",
      description: `Created ${generateType} QR code successfully`,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    })
  }

  const downloadQR = () => {
    if (!generatedQR) return

    const link = document.createElement("a")
    link.href = generatedQR
    link.download = "qr-code.svg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "QR code has been downloaded.",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "url":
        return <Link className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "location":
        return <MapPin className="h-4 w-4" />
      case "contact":
        return <User className="h-4 w-4" />
      default:
        return <QrCode className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "url":
        return "bg-blue-100 text-blue-800"
      case "email":
        return "bg-green-100 text-green-800"
      case "phone":
        return "bg-purple-100 text-purple-800"
      case "wifi":
        return "bg-orange-100 text-orange-800"
      case "location":
        return "bg-red-100 text-red-800"
      case "contact":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">QR Scanner & Generator</h1>
          <p className="text-muted-foreground">Scan QR codes and generate custom QR codes</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
          <TabsTrigger value="generate">Generate QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Use camera or upload image to scan QR codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={simulateQRScan} disabled={isScanning} className="flex-1">
                    {isScanning ? (
                      <>
                        <Scan className="mr-2 h-4 w-4 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera Scan
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {isScanning ? (
                    <div className="space-y-4">
                      <Camera className="h-16 w-16 mx-auto text-muted-foreground animate-pulse" />
                      <p className="text-muted-foreground">Scanning for QR codes...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Click "Start Camera Scan" or upload an image</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scan Result</CardTitle>
                <CardDescription>QR code data and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(scanResult.type)}>
                        {getTypeIcon(scanResult.type)}
                        {scanResult.type.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Raw Data:</Label>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          <code className="text-sm break-all">{scanResult.data}</code>
                        </div>
                      </div>

                      {scanResult.metadata && (
                        <div>
                          <Label className="text-sm font-medium">Parsed Information:</Label>
                          <div className="mt-1 space-y-2">
                            {Object.entries(scanResult.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="capitalize">{key}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" onClick={() => copyToClipboard(scanResult.data)} className="w-full">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Data
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scan className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No QR code scanned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate QR Code</CardTitle>
                <CardDescription>Create custom QR codes for various data types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">QR Code Type</Label>
                  <Select value={generateType} onValueChange={setGenerateType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="url">Website URL</SelectItem>
                      <SelectItem value="email">Email Address</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  {generateType === "text" ? (
                    <Textarea
                      id="content"
                      placeholder="Enter your text here..."
                      value={generateText}
                      onChange={(e) => setGenerateText(e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id="content"
                      placeholder={
                        generateType === "url"
                          ? "https://example.com"
                          : generateType === "email"
                            ? "user@example.com"
                            : generateType === "phone"
                              ? "+1234567890"
                              : "Enter content..."
                      }
                      value={generateText}
                      onChange={(e) => setGenerateText(e.target.value)}
                    />
                  )}
                </div>

                <Button onClick={generateQRCode} className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>

                <Alert>
                  <QrCode className="h-4 w-4" />
                  <AlertDescription>
                    QR codes can store up to 4,296 alphanumeric characters or 7,089 numeric characters.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated QR Code</CardTitle>
                    <CardDescription>Your custom QR code</CardDescription>
                  </div>
                  {generatedQR && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadQR}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedQR ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={generatedQR || "/placeholder.svg"}
                        alt="Generated QR Code"
                        className="border rounded-lg"
                        width={200}
                        height={200}
                      />
                    </div>
                    <div className="text-center">
                      <Badge className={getTypeColor(generateType)}>
                        {getTypeIcon(generateType)}
                        {generateType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Scan this QR code to access your content</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generated QR code will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
