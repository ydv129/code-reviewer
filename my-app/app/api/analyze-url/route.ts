import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google AI API key not configured" }, { status: 500 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are an AI assistant specializing in cybersecurity and URL analysis. Your task is to analyze the given URL and determine if it is a phishing attempt, malicious site, or legitimate website.

Consider the following factors in your analysis:
- Suspicious domain names (typosquatting, homograph attacks)
- URL shortening services that could hide the real destination
- Unusual paths or parameters that might indicate malicious intent
- Presence of sensitive keywords that might be used in phishing
- Domain reputation and age
- SSL certificate status
- Known malicious patterns

URL to analyze: ${url}

Provide a detailed analysis explaining your reasoning and assign a confidence score from 0-100, where:
- 0-30: Very likely safe
- 31-50: Potentially suspicious, exercise caution
- 51-80: Likely malicious or phishing attempt
- 81-100: Highly likely to be malicious

Be thorough but concise in your analysis. End your response with "CONFIDENCE: [number]" where [number] is your confidence score.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract confidence score from the response
    const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/i)
    const confidence = confidenceMatch ? Number.parseInt(confidenceMatch[1]) : 50

    return NextResponse.json({
      result: text.replace(/CONFIDENCE:\s*\d+/i, "").trim(),
      confidence: Math.min(Math.max(confidence, 0), 100),
    })
  } catch (error) {
    console.error("URL analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze URL" }, { status: 500 })
  }
}
