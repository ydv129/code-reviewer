"use client"

import { useEffect } from "react"
import { Shield, User, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { getToolsForSidebar } from "@/lib/tool-registry"
import { gsap } from "gsap"
import { useSidebar } from "@/components/ui/sidebar"
import type { Tool } from "@/app/page"

interface AppSidebarProps {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
}

export function AppSidebar({ activeTool, setActiveTool }: AppSidebarProps) {
  const sidebarTools = getToolsForSidebar()
  const { setOpen } = useSidebar()

  useEffect(() => {
    // Animate sidebar items on mount
    gsap.fromTo(
      ".sidebar-item",
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
    )

    // Animate logo
    gsap.fromTo(
      ".sidebar-logo",
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
    )
  }, [])

  const handleToolClick = (toolId: Tool) => {
    setActiveTool(toolId)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setOpen(false)
    }
  }

  const handleDashboardClick = () => {
    setActiveTool("dashboard")
    if (window.innerWidth < 768) {
      setOpen(false)
    }
  }

  return (
    <Sidebar className="border-r border-gray-200/50 dark:border-gray-800/50 guardian-card">
      <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50">
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleDashboardClick}>
            <div className="sidebar-logo relative">
              <div className="absolute inset-0 guardian-gradient rounded-full blur-md opacity-30"></div>
              <Shield className="relative h-8 w-8 sm:h-10 sm:w-10 text-white guardian-gradient p-2 rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold guardian-gradient-text truncate">GuardianAI</h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Security Assistant</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <Button variant="ghost" size="sm" className="md:hidden p-1 h-8 w-8" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Dashboard Link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem className="sidebar-item">
                <SidebarMenuButton
                  isActive={activeTool === "dashboard"}
                  onClick={handleDashboardClick}
                  className={`w-full justify-start rounded-xl transition-all duration-300 hover:scale-105 ${
                    activeTool === "dashboard"
                      ? "guardian-gradient text-white shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTool === "dashboard" ? "bg-white/20" : "bg-gray-500/10"}`}>
                    <Shield className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <span className="truncate font-medium">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Security Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm font-semibold text-muted-foreground px-3 py-2">
            Security Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarTools.map((tool, index) => (
                <SidebarMenuItem key={tool.id} className="sidebar-item">
                  <SidebarMenuButton
                    isActive={activeTool === tool.id}
                    onClick={() => handleToolClick(tool.id as Tool)}
                    tooltip={tool.description}
                    className={`w-full justify-start rounded-xl transition-all duration-300 hover:scale-105 ${
                      activeTool === tool.id
                        ? "guardian-gradient text-white shadow-lg"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${activeTool === tool.id ? "bg-white/20" : tool.color.replace("text-", "bg-") + "/10"}`}
                    >
                      <tool.icon className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate font-medium">{tool.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/50 dark:border-gray-800/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem className="sidebar-item">
            <SidebarMenuButton
              asChild
              className="w-full justify-start rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              <a href="/profile">
                <div className="p-2 rounded-lg bg-gray-500/10">
                  <User className="h-4 w-4 flex-shrink-0" />
                </div>
                <span className="truncate font-medium">Profile</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
