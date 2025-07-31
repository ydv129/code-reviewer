"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, RefreshCw, Lock, Shield, AlertTriangle, CheckCircle, Download, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export default function PasswordGeneratorPage() {
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [passwords, setPasswords] = useState<string[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  })
  const [bulkCount, setBulkCount] = useState(5)

  const generatePassword = useCallback(() => {
    let charset = ""

    if (options.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (options.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (options.includeNumbers) charset += "0123456789"
    if (options.includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }

    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()/\\'"~,;<>.]/g, "")
    }

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return ""
    }

    let result = ""
    const array = new Uint8Array(options.length)
    crypto.getRandomValues(array)

    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length]
    }

    return result
  }, [options, toast])

  const handleGenerate = () => {
    const newPassword = generatePassword()
    setPassword(newPassword)
  }

  const handleBulkGenerate = () => {
    const newPasswords = []
    for (let i = 0; i < bulkCount; i++) {
      newPasswords.push(generatePassword())
    }
    setPasswords(newPasswords)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      })
    }
  }

  const calculateEntropy = () => {
    let charsetSize = 0
    if (options.includeLowercase) charsetSize += 26
    if (options.includeUppercase) charsetSize += 26
    if (options.includeNumbers) charsetSize += 10
    if (options.includeSymbols) charsetSize += 32

    if (options.excludeSimilar) charsetSize -= 6
    if (options.excludeAmbiguous) charsetSize -= 14

    return Math.log2(Math.pow(charsetSize, options.length))
  }

  const getStrengthLevel = (entropy: number) => {
    if (entropy >= 80) return { level: "Very Strong", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900" }
    if (entropy >= 60) return { level: "Strong", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900" }
    if (entropy >= 40) return { level: "Medium", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900" }
    return { level: "Weak", color: "text-red-500", bg: "bg-red-100 dark:bg-red-900" }
  }

  const entropy = calculateEntropy()
  const strength = getStrengthLevel(entropy)

  const exportPasswords = () => {
    const data = passwords.join("\n")
    const blob = new Blob([data], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "passwords.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Lock className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Password Generator</h1>
          <p className="text-muted-foreground">Generate cryptographically secure passwords with customizable options</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                Configuration
              </CardTitle>
              <CardDescription>Customize your password generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length */}
              <div className="space-y-2">
                <Label>Password Length: {options.length}</Label>
                <Slider
                  value={[options.length]}
                  onValueChange={([value]) => setOptions((prev) => ({ ...prev, length: value }))}
                  min={4}
                  max={128}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              <Separator />

              {/* Character Types */}
              <div className="space-y-4">
                <Label>Character Types</Label>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeUppercase: !!checked }))}
                    />
                    <Label htmlFor="uppercase" className="text-sm">
                      Uppercase (A-Z)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeLowercase: !!checked }))}
                    />
                    <Label htmlFor="lowercase" className="text-sm">
                      Lowercase (a-z)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeNumbers: !!checked }))}
                    />
                    <Label htmlFor="numbers" className="text-sm">
                      Numbers (0-9)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeSymbols: !!checked }))}
                    />
                    <Label htmlFor="symbols" className="text-sm">
                      Symbols (!@#$%^&*)
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Advanced Options */}
              <div className="space-y-4">
                <Label>Advanced Options</Label>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeSimilar"
                      checked={options.excludeSimilar}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, excludeSimilar: !!checked }))}
                    />
                    <Label htmlFor="excludeSimilar" className="text-sm">
                      Exclude similar characters (i, l, 1, L, o, 0, O)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeAmbiguous"
                      checked={options.excludeAmbiguous}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, excludeAmbiguous: !!checked }))}
                    />
                    <Label htmlFor="excludeAmbiguous" className="text-sm">
                      Exclude ambiguous characters ({`{} [] () / \\ ' " ~ , ; < > .`})
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Single Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Generated Password
              </CardTitle>
              <CardDescription>Your secure password with strength analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password Display */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={password}
                    readOnly
                    placeholder="Click 'Generate Password' to create a secure password"
                    className="font-mono text-lg"
                  />
                  <Button onClick={() => copyToClipboard(password)} disabled={!password} variant="outline" size="icon">
                    <Copy className="size-4" />
                  </Button>
                </div>

                <Button onClick={handleGenerate} className="w-full">
                  <RefreshCw className="size-4 mr-2" />
                  Generate Password
                </Button>
              </div>

              {/* Strength Analysis */}
              {password && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password Strength</span>
                    <Badge className={`${strength.bg} ${strength.color} border-0`}>{strength.level}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Length:</span>
                      <span className="ml-2 font-mono">{password.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entropy:</span>
                      <span className="ml-2 font-mono">{entropy.toFixed(1)} bits</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {entropy >= 60 ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="size-4 text-yellow-500" />
                    )}
                    <span className="text-muted-foreground">
                      {entropy >= 80
                        ? "Excellent security - would take centuries to crack"
                        : entropy >= 60
                          ? "Good security - would take years to crack"
                          : entropy >= 40
                            ? "Fair security - consider increasing length"
                            : "Weak security - increase length and complexity"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Password Generation</CardTitle>
              <CardDescription>Generate multiple passwords at once for different accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(Math.max(1, Math.min(50, Number.parseInt(e.target.value) || 1)))}
                  min={1}
                  max={50}
                  className="w-24"
                />
                <Button onClick={handleBulkGenerate} className="flex-1">
                  <RefreshCw className="size-4 mr-2" />
                  Generate {bulkCount} Passwords
                </Button>
                {passwords.length > 0 && (
                  <Button onClick={exportPasswords} variant="outline">
                    <Download className="size-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>

              {passwords.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {passwords.map((pwd, index) => (
                    <div key={index} className="flex gap-2 items-center p-2 bg-muted/30 rounded">
                      <span className="text-xs text-muted-foreground w-8">#{index + 1}</span>
                      <Input value={pwd} readOnly className="font-mono text-sm" />
                      <Button onClick={() => copyToClipboard(pwd)} variant="ghost" size="sm">
                        <Copy className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
