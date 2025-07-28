import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { SettingsProvider } from "@/hooks/use-settings"
import { GSAPProvider } from "@/components/animations/gsap-provider"
import { ClerkErrorBoundary } from "@/components/clerk-error-boundary"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GuardianAI - AI-Powered Security Assistant",
  description: "Comprehensive security analysis tools powered by AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <GSAPProvider>
              <SettingsProvider>
                <AuthProvider>
                  {children}
                  <Toaster />
                </AuthProvider>
              </SettingsProvider>
            </GSAPProvider>
          </ThemeProvider>
        </ClerkErrorBoundary>
      </body>
    </html>
  )
}
