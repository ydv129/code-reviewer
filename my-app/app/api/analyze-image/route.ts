import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google AI API key not configured" }, { status: 500 })
    }

    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Convert base64 to the format expected by Gemini
    const imageData = {
      inlineData: {
        data: imageBase64.split(",")[1], // Remove data:image/...;base64, prefix
        mimeType: "image/jpeg", // Default to jpeg, could be improved to detect actual type
      },
    }

    const prompt = `You are an AI cybersecurity expert analyzing images for potential security threats. 

Analyze the provided image for the following:

1. **QR Code Detection**: Look for any QR codes present in the image. QR codes can be used maliciously to redirect users to phishing sites or download malware.

2. **Phishing Content Detection**: Examine the image for signs of phishing attempts, such as:
   - Fake login pages or forms
   - Suspicious URLs or domain names
   - Impersonation of legitimate brands or services
   - Urgent or threatening language designed to create panic
   - Requests for sensitive information like passwords or credit card details
   - Poor quality graphics or spelling errors that might indicate a scam

3. **Visual Deception**: Look for attempts to deceive users through visual means, such as fake security warnings, fake software updates, or misleading advertisements.

Respond with a JSON object containing:
- contains_qr: boolean indicating if QR codes are present
- phishing_detected: boolean indicating if phishing content is detected  
- confidence: number from 0-100 indicating your confidence in the analysis

Example response:
{
  "contains_qr": false,
  "phishing_detected": true,
  "confidence": 85
}`

    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const text = response.text()

    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          contains_qr: Boolean(parsed.contains_qr),
          phishing_detected: Boolean(parsed.phishing_detected),
          confidence: Math.min(Math.max(Number(parsed.confidence) || 75, 0), 100),
        })
      }
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
    }

    // Fallback parsing if JSON parsing fails
    const containsQr = /qr.*code.*true|contains_qr.*true/i.test(text)
    const phishingDetected = /phishing.*true|phishing_detected.*true/i.test(text)
    const confidenceMatch = text.match(/confidence[:\s]*(\d+)/i)
    const confidence = confidenceMatch ? Number.parseInt(confidenceMatch[1]) : 75

    return NextResponse.json({
      contains_qr: containsQr,
      phishing_detected: phishingDetected,
      confidence: Math.min(Math.max(confidence, 0), 100),
    })
  } catch (error) {
    console.error("Image analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
