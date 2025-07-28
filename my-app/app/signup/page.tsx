"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useModernToast } from "@/components/modern-toast-helpers"
import { ModernAlert } from "@/components/modern-alert"
import Link from "next/link"
import { Shield, Github, Mail, Loader2, UserPlus } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})
  const [showAlert, setShowAlert] = useState<{
    type: "success" | "error" | "warning" | "info"
    title: string
    description: string
  } | null>(null)

  const { signup, signInWithProvider } = useAuth()
  const { showSuccess, showError, showWarning } = useModernToast()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    if (showAlert) {
      setShowAlert(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || isLoading) return

    setIsLoading(true)
    setShowAlert(null)

    try {
      const result = await signup(formData.email, formData.password)

      if (result?.status === "complete") {
        showSuccess("Welcome to GuardianAI! 🛡️", "Your account has been created and you're now logged in.")
        setShowAlert({
          type: "success",
          title: "Account Created Successfully! 🎉",
          description: "You're now logged in and ready to use GuardianAI's security tools.",
        })
        setTimeout(() => router.push("/"), 1500)
      } else {
        showSuccess(
          "Account Created! 📧",
          "Please check your email for a verification code to complete your registration.",
        )
        setShowAlert({
          type: "success",
          title: "Check Your Email! 📧",
          description: "We've sent a verification code to your email address. Please verify to complete registration.",
        })
        setTimeout(() => router.push("/verify-email"), 2000)
      }
    } catch (error: any) {
      const errorMessage = error?.message || "There was an error creating your account. Please try again."
      let alertType: "error" | "warning" = "error"

      if (errorMessage.includes("already registered") || errorMessage.includes("identifier_exists")) {
        alertType = "warning"
        setErrors((prev) => ({ ...prev, email: "This email is already registered" }))
      } else if (errorMessage.includes("password")) {
        setErrors((prev) => ({ ...prev, password: "Password does not meet requirements" }))
      } else if (errorMessage.includes("email") || errorMessage.includes("format")) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      }

      setShowAlert({
        type: alertType,
        title: alertType === "warning" ? "Account Already Exists" : "Account Creation Failed",
        description: errorMessage,
      })

      alertType === "warning"
        ? showWarning("Account Already Exists", errorMessage)
        : showError("Signup Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: string) => {
    if (!signInWithProvider || isSocialLoading) return

    setIsSocialLoading(provider)
    setShowAlert(null)

    try {
      await signInWithProvider(provider)
      showSuccess(
        `Welcome to GuardianAI! 🎉`,
        `Successfully signed up with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`,
      )
    } catch (error: any) {
      const errorMessage = error?.message || "Please try again."
      setShowAlert({
        type: "error",
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Signup Failed`,
        description: errorMessage,
      })
      showError("Social Signup Failed", errorMessage)
    } finally {
      setIsSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center guardian-bg p-4">
      <div className="w-full max-w-md space-y-6">
        {showAlert && (
          <ModernAlert
            variant={showAlert.type === "error" ? "destructive" : showAlert.type}
            title={showAlert.title}
            description={showAlert.description}
            dismissible
            onDismiss={() => setShowAlert(null)}
            className="animate-in slide-in-from-top-2 duration-300"
            action={
              showAlert.type === "warning" && showAlert.title.includes("Already Exists")
                ? {
                    label: "Sign In Instead",
                    onClick: () => router.push("/login"),
                    variant: "outline",
                  }
                : undefined
            }
          />
        )}

        <Card>
          <CardHeader className="text-center">
            <Shield className="mx-auto mb-2 h-10 w-10 text-primary" />
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Join GuardianAI and start protecting your digital world.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Sign Up
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm">
                Already have an account?
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignup("google")}
                  disabled={isSocialLoading === "google"}
                >
                  {isSocialLoading === "google" ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Mail className="mr-2 h-4 w-4" />}
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignup("github")}
                  disabled={isSocialLoading === "github"}
                >
                  {isSocialLoading === "github" ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Github className="mr-2 h-4 w-4" />}
                  GitHub
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
