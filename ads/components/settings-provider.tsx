"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface Settings {
  geminiApiKey: string
  voiceEnabled: boolean
  voiceGender: "male" | "female"
  voiceSpeed: number
  textEnhancement: boolean
  autoSpeak: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  speak: (text: string) => void
  stopSpeaking: () => void
  isSpeaking: boolean
  testApiKey: (apiKey: string) => Promise<boolean>
}

const defaultSettings: Settings = {
  geminiApiKey: "",
  voiceEnabled: true,
  voiceGender: "female",
  voiceSpeed: 1,
  textEnhancement: true,
  autoSpeak: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  // Listen for storage changes across tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "guardianai-api-key" || e.key === "guardianai-settings") {
        loadSettings()
      }
    }

    const handleCustomEvent = () => {
      loadSettings()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("guardianai-settings-updated", handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("guardianai-settings-updated", handleCustomEvent)
    }
  }, [])

  const loadSettings = () => {
    try {
      // Get API key from sessionStorage (current session)
      const sessionApiKey = sessionStorage.getItem("guardianai-api-key") || ""

      // Get other settings from localStorage
      const savedSettings = localStorage.getItem("guardianai-settings")
      let parsedSettings = defaultSettings

      if (savedSettings) {
        parsedSettings = { ...defaultSettings, ...JSON.parse(savedSettings) }
      }

      // Use session API key
      parsedSettings.geminiApiKey = sessionApiKey

      setSettings(parsedSettings)
    } catch (error) {
      console.error("Failed to load settings:", error)
      setSettings(defaultSettings)
    }
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }

      // Handle API key separately
      if (newSettings.geminiApiKey !== undefined) {
        if (newSettings.geminiApiKey.trim()) {
          sessionStorage.setItem("guardianai-api-key", newSettings.geminiApiKey.trim())
        } else {
          sessionStorage.removeItem("guardianai-api-key")
        }
      }

      // Save other settings to localStorage
      const settingsToSave = { ...updatedSettings }
      delete (settingsToSave as any).geminiApiKey
      localStorage.setItem("guardianai-settings", JSON.stringify(settingsToSave))

      // Update state
      setSettings(updatedSettings)

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("guardianai-settings-updated"))

      return true
    } catch (error) {
      console.error("Failed to update settings:", error)
      return false
    }
  }

  const testApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || !apiKey.startsWith("AIza")) {
      return false
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Test connection" }],
          apiKey: apiKey,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("API key test failed:", error)
      return false
    }
  }

  const speak = (text: string) => {
    if (!settings.voiceEnabled || !("speechSynthesis" in window)) return

    // Stop any current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Wait for voices to load
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()

      // Better voice selection logic
      let preferredVoice = null

      if (settings.voiceGender === "female") {
        preferredVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("zira") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("karen") ||
            (voice.name.toLowerCase().includes("google") && voice.name.toLowerCase().includes("us")) ||
            (voice.lang.includes("en") && voice.name.toLowerCase().includes("f")),
        )
      } else {
        preferredVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("male") ||
            voice.name.toLowerCase().includes("david") ||
            voice.name.toLowerCase().includes("alex") ||
            voice.name.toLowerCase().includes("mark") ||
            voice.name.toLowerCase().includes("daniel") ||
            voice.name.toLowerCase().includes("tom") ||
            (voice.name.toLowerCase().includes("google") && voice.name.toLowerCase().includes("uk")) ||
            (voice.lang.includes("en") && voice.name.toLowerCase().includes("m")),
        )
      }

      // Fallback to any English voice if preferred not found
      if (!preferredVoice) {
        preferredVoice = voices.find((voice) => voice.lang.startsWith("en"))
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", setVoice, { once: true })
    } else {
      setVoice()
    }

    utterance.rate = settings.voiceSpeed
    utterance.pitch = settings.voiceGender === "female" ? 1.1 : 0.9
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        speak,
        stopSpeaking,
        isSpeaking,
        testApiKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
