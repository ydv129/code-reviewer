"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useModernToast } from "@/components/modern-toast-helpers";
import { ModernAlert } from "@/components/modern-alert";
import Link from "next/link";
import { Shield, Github, Mail, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showAlert, setShowAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
  } | null>(null);

  const { login, signInWithProvider } = useAuth();
  const { showWelcome, showError, showWarning } = useModernToast();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setShowAlert(null);

    try {
      await login(email, password);

      showWelcome(
        "Welcome back to GuardianAI! 🛡️",
        "You're now protected and ready to analyze security threats."
      );

      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage = error.message || "Login failed. Please try again.";
      let alertType: "error" | "warning" = "error";

      // Handle specific error cases
      if (
        errorMessage.includes("No account found") ||
        errorMessage.includes("Couldn't find your account")
      ) {
        alertType = "warning";
        setErrors((prev) => ({ ...prev, email: "No account found with this email" }));
      } else if (errorMessage.includes("password")) {
        setErrors((prev) => ({ ...prev, password: "Incorrect password" }));
      }

      setShowAlert({
        type: alertType,
        title: alertType === "warning" ? "Account Not Found" : "Login Failed",
        description: errorMessage,
      });

      if (alertType === "warning") {
        showWarning("Account Not Found", errorMessage);
      } else {
        showError("Login Failed", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (!signInWithProvider || isSocialLoading) return;

    setIsSocialLoading(provider);
    setShowAlert(null);

    try {
      await signInWithProvider(provider);
      showWelcome(
        `Welcome back! 🎉`,
        `Successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`
      );
    } catch (error: any) {
      console.error("Social login error:", error);

      const errorMessage = error.message || "Please try again.";
      setShowAlert({
        type: "error",
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`,
        description: errorMessage,
      });

      showError("Social Login Failed", errorMessage);
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center guardian-bg p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Alert Messages */}
        {showAlert && (
          <ModernAlert
            variant={showAlert.type === "error" ? "destructive" : showAlert.type}
            title={showAlert.title}
            description={showAlert.description}
            dismissible
            onDismiss={() => setShowAlert(null)}
            className="animate-in slide-in-from-top-2 duration-300"
            action={
              showAlert.type === "warning" && showAlert.title.includes("Account Not Found")
                ? {
                    label: "Create Account",
                    onClick: () => router.push("/signup"),
                    variant: "outline",
                  }
                : undefined
            }
          />
        )}

        <Card className="guardian-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 guardian-gradient rounded-full blur-lg opacity-30 animate-pulse"></div>
                <Shield className="relative h-12 w-12 text-white guardian-gradient p-3 rounded-full" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold guardian-gradient-text">
              Welcome to GuardianAI
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to access your security dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => handleSocialLogin("google")}
                disabled={isSocialLoading === "google" || isLoading}
              >
                {isSocialLoading === "google" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4 text-red-500" />
                )}
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => handleSocialLogin("github")}
                disabled={isSocialLoading === "github" || isLoading}
              >
                {isSocialLoading === "github" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                    if (showAlert) {
                      setShowAlert(null);
                    }
                  }}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 animate-in slide-in-from-left-2 duration-200">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                    if (showAlert) {
                      setShowAlert(null);
                    }
                  }}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 animate-in slide-in-from-left-2 duration-200">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full guardian-gradient text-white font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline font-medium transition-colors"
              >
                Forgot your password?
              </Link>
              <div className="text-sm">
                {"Don't have an account? "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
