"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { ToolRenderer } from "@/components/tool-renderer"
import { ClerkErrorBoundary } from "@/components/clerk-error-boundary"
import { useAuth } from "@/hooks/use-auth"
import { gsap } from "gsap"
import type { SECURITY_TOOLS } from "@/lib/tool-registry"

export type Tool = (typeof SECURITY_TOOLS)[number]["id"]

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<Tool>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Animate header on mount
    gsap.fromTo(".header-content", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })

    // Auto-collapse sidebar on mobile after tool selection
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close sidebar when tool changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [activeTool])

  return (
    <ClerkErrorBoundary>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Sidebar - Hidden by default, shown when hamburger is clicked */}
          <AppSidebar activeTool={activeTool} setActiveTool={setActiveTool} />

          <SidebarInset className="flex-1 flex flex-col min-w-0">
            <header className="header-content flex h-16 sm:h-18 shrink-0 items-center gap-3 sm:gap-4 border-b border-gray-200/50 dark:border-gray-800/50 px-4 sm:px-6 guardian-card">
              {/* Hamburger Menu - Always visible */}
              <SidebarTrigger
                className="-ml-1 flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />

              <div className="flex flex-1 items-center justify-between min-w-0">
                <h1 className="text-lg sm:text-xl font-bold guardian-gradient-text truncate">
                  GuardianAI {user && activeTool !== "dashboard" && "• Dashboard"}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <ModeToggle />
                  <UserNav />
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <ToolRenderer activeTool={activeTool} setActiveTool={setActiveTool} />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ClerkErrorBoundary>
  )
}
