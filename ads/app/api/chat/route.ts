import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey } = await req.json()

    // Get API key from request body, headers, or environment
    const geminiApiKey = apiKey || req.headers.get("x-api-key") || process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json(
        {
          error: "API key required",
          code: "MISSING_API_KEY",
          message: "Please configure your Gemini API key in Settings",
        },
        { status: 401 },
      )
    }

    // Validate API key format
    if (!geminiApiKey.startsWith("AIza")) {
      return NextResponse.json(
        {
          error: "Invalid API key format",
          code: "INVALID_API_KEY",
          message: "Please check your Gemini API key format",
        },
        { status: 401 },
      )
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });


    // Convert messages to Gemini format
    const lastMessage = messages[messages.length - 1]
    const prompt = `You are GuardianAI, a cybersecurity assistant. Help users with security questions, privacy concerns, and digital safety. Be helpful, accurate, and security-focused.

User: ${lastMessage.content}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      message: text,
      success: true,
    })
  } catch (error: any) {
    console.error("Chat API Error:", error)

    if (error.message?.includes("API_KEY_INVALID")) {
      return NextResponse.json(
        {
          error: "Invalid API key",
          code: "INVALID_API_KEY",
          message: "Please check your Gemini API key in Settings",
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate response",
        code: "GENERATION_ERROR",
        message: "Please try again or check your API key",
      },
      { status: 500 },
    )
  }
}
