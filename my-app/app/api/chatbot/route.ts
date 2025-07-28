import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google AI API key not configured" }, { status: 500 })
    }

    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are GuardianAI, a friendly and knowledgeable cybersecurity expert assistant. Your role is to help users understand and protect themselves from online threats, phishing attempts, malware, and other security risks.

Key guidelines for your responses:
- Be helpful, clear, and educational
- Use simple language that non-technical users can understand
- Provide actionable advice and practical tips
- Stay focused on cybersecurity, online safety, and privacy topics
- If asked about non-security topics, politely redirect to security-related matters
- Be encouraging and supportive - security can be intimidating for many users
- Include specific examples when helpful
- Emphasize prevention and best practices

Areas of expertise include:
- Phishing detection and prevention
- Password security and management
- Safe browsing practices
- Email security
- Social engineering awareness
- Malware protection
- Privacy settings and data protection
- Two-factor authentication
- Secure communication
- Identity theft prevention

User's question: ${question}

Provide a helpful, informative response that addresses their security concern:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
    })
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "Failed to get chatbot response" }, { status: 500 })
  }
}
