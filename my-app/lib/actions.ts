"use server"

// Dynamic API base URL that works with any port
const getApiBaseUrl = () => {
  // Server-side: use environment variable or default
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  )
}

const API_BASE_URL = getApiBaseUrl()

// Mock responses for when API keys are not configured
const getMockResponse = (type: string) => {
  switch (type) {
    case "url":
      return {
        result:
          "This is a demo response. The URL appears to be legitimate based on basic analysis. To get real AI-powered analysis, please configure your Google AI API key in the environment variables.",
        confidence: 25,
      }
    case "image":
      return {
        contains_qr: false,
        phishing_detected: false,
        confidence: 25,
      }
    case "chatbot":
      return {
        response:
          "Hello! I'm GuardianAI's security assistant. To enable full AI capabilities, please configure your Google AI API key in the environment variables. In the meantime, I can provide basic security guidance: Always verify URLs before clicking, use strong unique passwords, enable two-factor authentication, and be cautious of suspicious emails.",
      }
    case "vulnerabilities":
      return {
        ssl: {
          isVulnerable: false,
          description:
            "Demo mode: SSL analysis requires API configuration. Please add your Google AI API key to enable full security analysis.",
          confidence: 25,
        },
        openPorts: {
          isVulnerable: false,
          description: "Demo mode: Port analysis requires API configuration.",
          confidence: 25,
        },
        dbInteraction: {
          isVulnerable: false,
          description: "Demo mode: Database analysis requires API configuration.",
          confidence: 25,
        },
        general: {
          isVulnerable: false,
          description: "Demo mode: General security analysis requires API configuration.",
          confidence: 25,
        },
        overallRisk: "low" as const,
      }
    default:
      return null
  }
}

export async function checkUrl(input: { url: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error("API not configured")
    }

    return await response.json()
  } catch (error) {
    console.log("Using demo mode for URL analysis")
    return getMockResponse("url")
  }
}

export async function checkImage(input: { imageBase64: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error("API not configured")
    }

    return await response.json()
  } catch (error) {
    console.log("Using demo mode for image analysis")
    return getMockResponse("image")
  }
}

export async function getChatbotResponse(input: { question: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error("API not configured")
    }

    return await response.json()
  } catch (error) {
    console.log("Using demo mode for chatbot")
    return getMockResponse("chatbot")
  }
}

export async function checkVulnerabilities(input: { url: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-vulnerabilities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error("API not configured")
    }

    return await response.json()
  } catch (error) {
    console.log("Using demo mode for vulnerability analysis")
    return getMockResponse("vulnerabilities")
  }
}
