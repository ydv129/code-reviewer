"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { checkImage } from "@/lib/actions"
import { ImageIcon, Upload, AlertTriangle, CheckCircle2, Loader2, QrCode } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface AnalysisResult {
  contains_qr: boolean
  phishing_detected: boolean
  confidence: number
}

export function ImageScanner() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setImagePreview(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
  })

  const analyzeImage = async () => {
    if (!imagePreview) return

    setIsLoading(true)
    setResult(null)
    try {
      const analysis = await checkImage({ imageBase64: imagePreview })
      setResult(analysis)
    } catch (error) {
      console.error("Image analysis failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <CardTitle>Image Security Scanner</CardTitle>
          </div>
          <CardDescription>Scan images for QR codes and potential phishing content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium">Drop an image here, or click to select</p>
                <p className="text-sm text-muted-foreground mt-1">Supports PNG, JPG, GIF, and WebP files</p>
              </div>
            )}
          </div>

          {imagePreview && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 mx-auto rounded-lg border"
                />
              </div>
              <Button onClick={analyzeImage} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span className="font-medium">QR Code Detected</span>
                </div>
                <Badge variant={result.contains_qr ? "destructive" : "default"}>
                  {result.contains_qr ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Phishing Detected</span>
                </div>
                <Badge variant={result.phishing_detected ? "destructive" : "default"}>
                  {result.phishing_detected ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Confidence Level</span>
                <Badge variant="outline">{result.confidence}%</Badge>
              </div>
            </div>
            {(result.contains_qr || result.phishing_detected) && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Security Warning</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      This image contains potentially suspicious content. Exercise caution before interacting with any
                      QR codes or links.
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
