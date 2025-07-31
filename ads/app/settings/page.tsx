"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Settings, Key, Volume2, Palette, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/components/settings-provider"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings, testApiKey } = useSettings()
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [isTestingApiKey, setIsTestingApiKey] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<"valid" | "invalid" | "untested">("untested")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setApiKeyInput(settings.geminiApiKey)
    if (settings.geminiApiKey) {
      setApiKeyStatus("valid")
    }
  }, [settings.geminiApiKey])

  // GSAP animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        // Header animation
        gsap.fromTo(
          ".settings-header",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
        )

        // Cards animation
        gsap.fromTo(
          ".settings-card",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          },
        )
      })
    }
  }, [])

  const handleTestApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      })
      return
    }

    if (!apiKeyInput.startsWith("AIza")) {
      setApiKeyStatus("invalid")
      toast({
        title: "Invalid API Key Format",
        description: "Gemini API keys should start with 'AIza'",
        variant: "destructive",
      })
      return
    }

    setIsTestingApiKey(true)
    setApiKeyStatus("untested")

    try {
      const isValid = await testApiKey(apiKeyInput.trim())

      if (isValid) {
        setApiKeyStatus("valid")
        toast({
          title: "API Key Valid",
          description: "Your Gemini API key is working correctly",
        })
      } else {
        setApiKeyStatus("invalid")
        toast({
          title: "API Key Invalid",
          description: "Please check your API key and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      setApiKeyStatus("invalid")
      toast({
        title: "Test Failed",
        description: "Unable to test API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTestingApiKey(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      const success = await updateSettings({
        geminiApiKey: apiKeyInput.trim(),
      })

      if (success) {
        toast({
          title: "Settings Saved",
          description: "Your API key has been saved successfully",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVoiceSettingChange = async (key: string, value: any) => {
    await updateSettings({ [key]: value })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="settings-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Settings className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your GuardianAI preferences</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* API Configuration */}
        <Card className="settings-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="size-5" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>Configure your Gemini API key for AI chat functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Gemini API Key</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your Gemini API key (AIza...)"
                    value={apiKeyInput}
                    onChange={(e) => {
                      setApiKeyInput(e.target.value)
                      setApiKeyStatus("untested")
                    }}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isTestingApiKey ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : apiKeyStatus === "valid" ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : apiKeyStatus === "invalid" ? (
                      <XCircle className="size-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
                <Button onClick={handleTestApiKey} disabled={isTestingApiKey || !apiKeyInput.trim()}>
                  {isTestingApiKey ? "Testing..." : "Test"}
                </Button>
              </div>
              {apiKeyStatus === "valid" && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="size-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    API key is valid and ready to use
                  </AlertDescription>
                </Alert>
              )}
              {apiKeyStatus === "invalid" && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <XCircle className="size-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    API key is invalid or expired
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving || !apiKeyInput.trim() || apiKeyStatus === "invalid"}
                className="flex-1"
              >
                {isSaving ? "Saving..." : "Save API Key"}
              </Button>
              <Button variant="outline" asChild>
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Get API Key
                </a>
              </Button>
            </div>

            <Alert>
              <Key className="size-4" />
              <AlertDescription>
                Your API key is stored securely in your browser session and will be cleared when you close the browser.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card className="settings-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Volume2 className="size-5" />
              <CardTitle>Voice Settings</CardTitle>
            </div>
            <CardDescription>Configure text-to-speech preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Voice</Label>
                <p className="text-sm text-muted-foreground">Allow GuardianAI to speak responses</p>
              </div>
              <Switch
                checked={settings.voiceEnabled}
                onCheckedChange={(checked) => handleVoiceSettingChange("voiceEnabled", checked)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Voice Gender</Label>
                <Select
                  value={settings.voiceGender}
                  onValueChange={(value) => handleVoiceSettingChange("voiceGender", value)}
                  disabled={!settings.voiceEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speech Speed</Label>
                <div className="px-2">
                  <Slider
                    value={[settings.voiceSpeed]}
                    onValueChange={([value]) => handleVoiceSettingChange("voiceSpeed", value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    disabled={!settings.voiceEnabled}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Slow</span>
                    <span>{settings.voiceSpeed}x</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-speak Responses</Label>
                <p className="text-sm text-muted-foreground">Automatically speak AI responses</p>
              </div>
              <Switch
                checked={settings.autoSpeak}
                onCheckedChange={(checked) => handleVoiceSettingChange("autoSpeak", checked)}
                disabled={!settings.voiceEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="settings-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="size-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Text Enhancement</Label>
                <p className="text-sm text-muted-foreground">Improve readability with enhanced formatting</p>
              </div>
              <Switch
                checked={settings.textEnhancement}
                onCheckedChange={(checked) => handleVoiceSettingChange("textEnhancement", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="settings-card">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Current configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">API Key</Label>
                <Badge variant={settings.geminiApiKey ? "default" : "secondary"}>
                  {settings.geminiApiKey ? "Configured" : "Not Set"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Voice</Label>
                <Badge variant={settings.voiceEnabled ? "default" : "secondary"}>
                  {settings.voiceEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
