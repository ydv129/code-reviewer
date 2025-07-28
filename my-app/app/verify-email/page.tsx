"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getClerk } from "@/lib/clerk"
import { Shield, Mail, ArrowLeft, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkSignupSession = async () => {
      try {
        const clerk = await getClerk()
        if (!clerk?.client?.signUp || clerk.client.signUp.status === "complete") {
          router.push("/signup")
        }
      } catch {
        router.push("/signup")
      }
    }
    checkSignupSession()
  }, [router])

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Code required",
        description: "Please enter the verification code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const clerk = await getClerk()
      if (!clerk?.client?.signUp) throw new Error("No active signup session found")

      const result = await clerk.client.signUp.attemptEmailAddressVerification({ code: code.trim() })

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId })
        toast({
          title: "Welcome to GuardianAI! 🎉",
          description: "Your account has been verified and you're now logged in.",
        })
        setTimeout(() => router.push("/"), 1000)
      } else if (result.status === "missing_requirements") {
        toast({
          title: "Additional information required",
          description: "Please complete your profile setup.",
          variant: "destructive",
        })
      } else {
        throw new Error("Verification incomplete")
      }
    } catch (error: any) {
      let errorMessage = "Invalid verification code. Please try again."
      const codeError = error?.errors?.[0]

      switch (codeError?.code) {
        case "form_code_incorrect":
          errorMessage = "The verification code is incorrect. Please check and try again."
          break
        case "verification_expired":
          errorMessage = "The verification code has expired. Please request a new one."
          break
        case "verification_failed":
          errorMessage = "Verification failed. Please request a new code."
          break
        default:
          if (codeError?.longMessage || codeError?.message) {
            errorMessage = codeError.longMessage || codeError.message
          }
      }

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      const clerk = await getClerk()
      if (!clerk?.client?.signUp) throw new Error("No active signup session found")

      await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      toast({
        title: "Code sent! 📧",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error: any) {
      const err = error?.errors?.[0]
      const message = err?.longMessage || err?.message || "Failed to send verification code. Please try again."
      toast({
        title: "Failed to send code",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && code.trim()) {
      handleVerifyCode()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center guardian-bg p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <Mail className="absolute -bottom-1 -right-1 h-6 w-6 bg-background rounded-full p-1 text-primary border-2 border-background" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to your email address. Please enter it below to complete your
            registration and access GuardianAI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={handleKeyPress}
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>
            <Button
              onClick={handleVerifyCode}
              disabled={isLoading || !code.trim() || code.length !== 6}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email & Continue"
              )}
            </Button>
          </div>
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend code"}
              </button>
            </p>
            <Link href="/signup" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to signup
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
