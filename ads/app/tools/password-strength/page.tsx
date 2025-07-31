"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle, Clock, Zap, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PasswordAnalysis {
  score: number
  strength: string
  entropy: number
  crackTime: string
  feedback: string[]
  patterns: string[]
  improvements: string[]
  details: {
    length: number
    hasUpper: boolean
    hasLower: boolean
    hasNumbers: boolean
    hasSpecial: boolean
    uniqueChars: number
  }
}

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzePassword = useCallback(async (pwd: string) => {
    if (!pwd) {
      setAnalysis(null)
      return
    }

    setIsAnalyzing(true)

    // Simulate API delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500))

    const length = pwd.length
    const hasLower = /[a-z]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    const hasExtendedSpecial = /[~`!@#$%^&*()_\-+={}[\]|\\:";'<>?,./]/.test(pwd)

    // Advanced pattern detection
    const patterns = []
    const feedback = []
    const improvements = []

    // Common patterns
    if (/(.)\1{2,}/.test(pwd)) patterns.push("Repeated characters detected")
    if (/123|234|345|456|567|678|789|890/.test(pwd)) patterns.push("Sequential numbers found")
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(pwd))
      patterns.push("Sequential letters found")
    if (/qwerty|asdf|zxcv|1234|password|admin|login|welcome|letmein|monkey|dragon|princess|master/i.test(pwd))
      patterns.push("Common keyboard patterns or dictionary words")
    if (/\b(password|admin|login|user|guest|test|demo|root|administrator)\b/i.test(pwd))
      patterns.push("Common system words detected")

    // Calculate base score
    let score = 0
    let charsetSize = 0

    if (hasLower) {
      score += 5
      charsetSize += 26
    }
    if (hasUpper) {
      score += 5
      charsetSize += 26
    }
    if (hasNumbers) {
      score += 5
      charsetSize += 10
    }
    if (hasSpecial) {
      score += 10
      charsetSize += 32
    }

    // Length bonus
    if (length >= 8) score += 15
    else feedback.push("Use at least 8 characters")
    if (length >= 12) score += 15
    else if (length >= 8) feedback.push("Consider using 12+ characters for better security")
    if (length >= 16) score += 10
    if (length >= 20) score += 5

    // Character variety feedback
    if (!hasLower) feedback.push("Add lowercase letters (a-z)")
    if (!hasUpper) feedback.push("Add uppercase letters (A-Z)")
    if (!hasNumbers) feedback.push("Add numbers (0-9)")
    if (!hasSpecial) feedback.push("Add special characters (!@#$%^&*)")

    // Diversity bonus
    const uniqueChars = new Set(pwd).size
    const diversityRatio = uniqueChars / length
    score += Math.min(uniqueChars * 1.5, 15)

    if (diversityRatio < 0.7) {
      feedback.push("Increase character diversity")
    }

    // Pattern penalties
    score -= patterns.length * 15

    // Entropy calculation
    const entropy = Math.log2(Math.pow(charsetSize, length))

    // Advanced crack time estimation
    let crackTime = ""
    const attemptsPerSecond = 1000000000 // 1 billion attempts per second (modern GPU)
    const totalCombinations = Math.pow(charsetSize, length)
    const secondsToCrack = totalCombinations / (2 * attemptsPerSecond) // Average case

    if (secondsToCrack < 1) crackTime = "Instantly"
    else if (secondsToCrack < 60) crackTime = "Seconds"
    else if (secondsToCrack < 3600) crackTime = `${Math.ceil(secondsToCrack / 60)} minutes`
    else if (secondsToCrack < 86400) crackTime = `${Math.ceil(secondsToCrack / 3600)} hours`
    else if (secondsToCrack < 31536000) crackTime = `${Math.ceil(secondsToCrack / 86400)} days`
    else if (secondsToCrack < 31536000000) crackTime = `${Math.ceil(secondsToCrack / 31536000)} years`
    else crackTime = "Centuries+"

    // Determine strength
    let strength = ""
    if (score >= 85) strength = "Excellent"
    else if (score >= 70) strength = "Very Strong"
    else if (score >= 55) strength = "Strong"
    else if (score >= 40) strength = "Medium"
    else if (score >= 25) strength = "Weak"
    else strength = "Very Weak"

    // Generate improvements
    if (length < 12) improvements.push("Increase length to at least 12 characters")
    if (patterns.length > 0) improvements.push("Avoid predictable patterns and common words")
    if (!hasExtendedSpecial) improvements.push("Use more diverse special characters")
    if (diversityRatio < 0.7) improvements.push("Increase character variety")
    improvements.push("Consider using a passphrase with random words")
    improvements.push("Use a password manager for unique passwords")

    // Update usage statistics
    const currentCount = Number.parseInt(localStorage.getItem("guardianai-tools-used") || "0")
    localStorage.setItem("guardianai-tools-used", (currentCount + 1).toString())

    setAnalysis({
      score: Math.min(100, Math.max(0, score)),
      strength,
      entropy: Math.round(entropy * 10) / 10,
      crackTime,
      feedback,
      patterns,
      improvements,
      details: {
        length,
        hasUpper,
        hasLower,
        hasNumbers,
        hasSpecial,
        uniqueChars,
      },
    })

    setIsAnalyzing(false)
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      analyzePassword(password)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [password, analyzePassword])

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Excellent":
        return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300"
      case "Very Strong":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "Strong":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300"
      case "Weak":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300"
      case "Very Weak":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500"
    if (score >= 70) return "bg-green-500"
    if (score >= 55) return "bg-blue-500"
    if (score >= 40) return "bg-yellow-500"
    if (score >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Shield className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Password Strength Analyzer</h1>
          <p className="text-muted-foreground">Advanced password security analysis with real-time feedback</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Input</CardTitle>
              <CardDescription>Enter your password to analyze its strength and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password here..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Analyzing password security...</span>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Your password is analyzed locally and never sent to any server</p>
                <p>• Real-time analysis provides instant security feedback</p>
                <p>• Advanced entropy calculations for accurate crack time estimates</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Password Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use at least 12 characters for strong security</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mix uppercase, lowercase, numbers, and symbols</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Avoid common words and predictable patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Consider using passphrases with random words</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use unique passwords for each account</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enable two-factor authentication when available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {analysis ? (
            <>
              {/* Strength Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="size-5" />
                    Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password Strength</span>
                    <Badge className={`${getStrengthColor(analysis.strength)} border-0`}>{analysis.strength}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security Score</span>
                      <span className="font-mono">{analysis.score}/100</span>
                    </div>
                    <div className="relative">
                      <Progress value={analysis.score} className="h-3" />
                      <div
                        className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.score)}`}
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Entropy</span>
                      <div className="font-mono text-lg">{analysis.entropy} bits</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Crack Time</span>
                      <div className="font-medium text-lg">{analysis.crackTime}</div>
                    </div>
                  </div>

                  {/* Character Analysis */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${analysis.details.hasLower ? "text-green-600" : "text-red-600"}`}
                    >
                      {analysis.details.hasLower ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                      <span>Lowercase</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${analysis.details.hasUpper ? "text-green-600" : "text-red-600"}`}
                    >
                      {analysis.details.hasUpper ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                      <span>Uppercase</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${analysis.details.hasNumbers ? "text-green-600" : "text-red-600"}`}
                    >
                      {analysis.details.hasNumbers ? (
                        <CheckCircle className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      <span>Numbers</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${analysis.details.hasSpecial ? "text-green-600" : "text-red-600"}`}
                    >
                      {analysis.details.hasSpecial ? (
                        <CheckCircle className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      <span>Symbols</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Issues */}
                  {analysis.feedback.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="size-4 text-yellow-500" />
                        Security Issues ({analysis.feedback.length})
                      </h4>
                      <div className="space-y-1">
                        {analysis.feedback.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <XCircle className="size-3 text-red-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patterns */}
                  {analysis.patterns.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="size-4 text-orange-500" />
                        Vulnerable Patterns ({analysis.patterns.length})
                      </h4>
                      <div className="space-y-1">
                        {analysis.patterns.map((pattern, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <XCircle className="size-3 text-orange-500" />
                            <span>{pattern}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="size-4 text-green-500" />
                      Recommendations
                    </h4>
                    <div className="space-y-1">
                      {analysis.improvements.slice(0, 4).map((improvement, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="size-3 text-green-500" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="size-5" />
                    Technical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Length:</span>
                        <span className="ml-2 font-mono">{analysis.details.length} characters</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unique chars:</span>
                        <span className="ml-2 font-mono">{analysis.details.uniqueChars}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entropy:</span>
                        <span className="ml-2 font-mono">{analysis.entropy} bits</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Patterns:</span>
                        <span className="ml-2 font-mono">{analysis.patterns.length}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold mb-1">{analysis.crackTime}</div>
                      <div className="text-sm text-muted-foreground">Estimated crack time with modern hardware</div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Based on 1 billion attempts per second (modern GPU)</p>
                      <p>• Assumes random brute force attack</p>
                      <p>• Dictionary attacks may be faster for common passwords</p>
                      <p>• Quantum computers may reduce these times significantly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enter a Password</h3>
                <p className="text-muted-foreground text-center">
                  Type a password in the input field to see comprehensive security analysis with real-time feedback
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
