"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Send, Bot, User, Shield, AlertTriangle, Settings, Key, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/components/settings-provider"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { toast } = useToast()
  const { settings, updateSettings, testApiKey } = useSettings()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm GuardianAI, your cybersecurity assistant. I can help you with security questions, privacy concerns, threat analysis, and digital safety best practices. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [isTestingApiKey, setIsTestingApiKey] = useState(false)
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null) 

  // Check API key status on mount and settings changes
  useEffect(() => {
    const currentApiKey = sessionStorage.getItem("guardianai-api-key") || settings.geminiApiKey
    setShowApiKeySetup(!currentApiKey)
  }, [settings.geminiApiKey])

  // Listen for settings updates
  useEffect(() => {
    const handleSettingsUpdate = () => {
      const currentApiKey = sessionStorage.getItem("guardianai-api-key")
      setShowApiKeySetup(!currentApiKey)
    }

    window.addEventListener("guardianai-settings-updated", handleSettingsUpdate)
    return () => window.removeEventListener("guardianai-settings-updated", handleSettingsUpdate)
  }, [])

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        // Header animation
        gsap.fromTo(
          ".chat-header",
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
        )

        // Messages animation
        gsap.fromTo(
          ".message-item",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".messages-container",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Input area animation
        gsap.fromTo(
          ".chat-input",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.3,
          },
        )
      })
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleTestAndSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      })
      return
    }

    if (!apiKeyInput.startsWith("AIza")) {
      toast({
        title: "Invalid API Key Format",
        description: "Gemini API keys should start with 'AIza'",
        variant: "destructive",
      })
      return
    }

    setIsTestingApiKey(true)

    try {
      const isValid = await testApiKey(apiKeyInput.trim())

      if (isValid) {
        await updateSettings({ geminiApiKey: apiKeyInput.trim() })
        setShowApiKeySetup(false)
        toast({
          title: "API Key Configured",
          description: "Your Gemini API key is working and has been saved",
        })
      } else {
        toast({
          title: "API Key Invalid",
          description: "Please check your API key and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Unable to configure API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTestingApiKey(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const currentApiKey = sessionStorage.getItem("guardianai-api-key") || settings.geminiApiKey

    if (!currentApiKey) {
      setShowApiKeySetup(true)
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key first",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          apiKey: currentApiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Speak the response if voice is enabled
      if (settings.voiceEnabled) {
        settings.speak?.(data.message)
      }

      // Update usage statistics
      const currentCount = Number.parseInt(localStorage.getItem("guardianai-tools-used") || "0")
      localStorage.setItem("guardianai-tools-used", (currentCount + 1).toString())
    } catch (error: any) {
      console.error("Chat error:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error.message}. Please check your API key configuration or try again.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])

      toast({
        title: "Chat Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Show API key setup if no key is configured
  if (showApiKeySetup) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Key className="size-6 text-white" />
            </div>
            <CardTitle>Configure API Key</CardTitle>
            <CardDescription>Enter your Gemini API key to start chatting with GuardianAI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your Gemini API key (AIza...)"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleTestAndSaveApiKey()
                  }
                }}
              />
            </div>

            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription>
                You need a Gemini API key to use the AI chat feature. Get one from Google AI Studio.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleTestAndSaveApiKey}
                disabled={isTestingApiKey || !apiKeyInput.trim()}
                className="w-full"
              >
                {isTestingApiKey ? "Testing & Configuring..." : "Test & Configure API Key"}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/settings">
                    <Settings className="size-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                    Get API Key
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="chat-header flex items-center gap-3 p-6 border-b">
        <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <MessageSquare className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Security Assistant</h1>
          <p className="text-muted-foreground">Chat with GuardianAI for cybersecurity guidance</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="size-3 mr-2" />
            API Connected
          </Badge>
          {settings.voiceEnabled && (
            <Badge variant="outline">
              <Bot className="size-3 mr-1" />
              Voice Enabled
            </Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="messages-container space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-item flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="size-8 bg-gradient-to-br from-blue-500 to-purple-600">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="size-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
              </div>

              {message.role === "user" && (
                <Avatar className="size-8 bg-gradient-to-br from-green-500 to-blue-500">
                  <AvatarFallback className="bg-transparent">
                    <User className="size-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="size-8 bg-gradient-to-br from-blue-500 to-purple-600">
                <AvatarFallback className="bg-transparent">
                  <Bot className="size-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">GuardianAI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="chat-input p-6 border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask GuardianAI about cybersecurity, privacy, or digital safety..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="size-3" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-1">
              <Bot className="size-3" />
              <span>Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="size-3 text-green-500" />
              <span>API Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
