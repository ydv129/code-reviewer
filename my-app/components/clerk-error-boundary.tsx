"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ClerkErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Clerk Error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      const isClerkConfigError =
        this.state.error?.message?.includes("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") ||
        this.state.error?.message?.includes("Clerk")

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>{isClerkConfigError ? "Clerk Configuration Error" : "Application Error"}</CardTitle>
              <CardDescription>
                {isClerkConfigError
                  ? "There's an issue with Clerk authentication setup"
                  : "Something went wrong with the application"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {isClerkConfigError ? (
                <div className="text-left space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This error typically occurs when Clerk isn't properly configured. To fix this:
                  </p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>
                      Create a Clerk application at{" "}
                      <a
                        href="https://dashboard.clerk.com"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Clerk Dashboard
                      </a>
                    </li>
                    <li>Copy your Publishable Key</li>
                    <li>Add it to your environment variables</li>
                    <li>Restart the development server</li>
                  </ol>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please refresh the page or check the console for more details.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => window.location.reload()} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                {isClerkConfigError && (
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://dashboard.clerk.com", "_blank")}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Clerk Dashboard
                  </Button>
                )}
              </div>

              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 text-left">
                  <summary className="text-sm font-medium cursor-pointer">Error Details</summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">{this.state.error?.stack}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
