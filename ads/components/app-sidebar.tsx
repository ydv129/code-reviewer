"use client"

import type * as React from "react"
import {
  Shield,
  LayoutDashboard,
  Wrench,
  MessageSquare,
  Info,
  Zap,
  Users,
  Settings,
  Lock,
  Search,
  Wifi,
  Eye,
  Key,
  UserCheck,
  Database,
  Mail,
  Monitor,
  Smartphone,
  QrCode,
  FileJson,
} from "lucide-react"

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

// Menu items
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: false,
    },
    {
      title: "Security Tools",
      url: "/tools",
      icon: Wrench,
      isActive: false,
      items: [
        {
          title: "Password Generator",
          url: "/tools/password-generator",
          icon: Key,
        },
        {
          title: "Password Strength",
          url: "/tools/password-strength",
          icon: Lock,
        },
        {
          title: "Breach Checker",
          url: "/tools/breach-checker",
          icon: Search,
        },
        {
          title: "Network Scanner",
          url: "/tools/network-scanner",
          icon: Wifi,
        },
        {
          title: "Privacy Audit",
          url: "/tools/privacy-audit",
          icon: Eye,
        },
        {
          title: "DNS Leak Test",
          url: "/tools/dns-leak",
          icon: Wifi,
        },
      ],
    },
    {
      title: "Advanced Tools",
      url: "#",
      icon: Zap,
      isActive: false,
      items: [
        {
          title: "App Privacy Tracker",
          url: "/tools/app-tracker",
          icon: Smartphone,
        },
        {
          title: "Fake Data Generator",
          url: "/tools/fake-data-generator",
          icon: Database,
        },
        {
          title: "Email Mask Generator",
          url: "/tools/email-mask",
          icon: Mail,
        },
        {
          title: "System Monitor",
          url: "/tools/system-monitor",
          icon: Monitor,
        },
        {
          title: "JSON Beautifier",
          url: "/tools/json-beautifier",
          icon: FileJson,
        },
        {
          title: "QR Scanner & Generator",
          url: "/tools/qr-scanner",
          icon: QrCode,
        },
      ],
    },
    {
      title: "AI Assistant",
      url: "/chat",
      icon: MessageSquare,
      isActive: false,
    },
    {
      title: "Information",
      url: "#",
      icon: Info,
      isActive: false,
      items: [
        {
          title: "About",
          url: "/about",
          icon: Info,
        },
        {
          title: "Features",
          url: "/features",
          icon: Zap,
        },
        {
          title: "Developers",
          url: "/developers",
          icon: Users,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="size-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-600">GuardianAI</h2>
            <p className="text-xs text-muted-foreground">Security Suite</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              {item.title === "Dashboard"
                ? "Overview"
                : item.title === "Security Tools"
                  ? "Security"
                  : item.title === "Advanced Tools"
                    ? "Advanced"
                    : item.title === "AI Assistant"
                      ? "AI"
                      : "Resources"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items ? (
                  <Collapsible key={item.title} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url} className="flex items-center gap-2">
                                  <subItem.icon className="size-3" />
                                  <span>{subItem.title}</span>
                                  {subItem.title === "System Monitor" && (
                                    <Badge variant="secondary" className="text-xs ml-auto">
                                      Enhanced
                                    </Badge>
                                  )}
                                  {subItem.title === "Network Scanner" && (
                                    <Badge variant="secondary" className="text-xs ml-auto">
                                      Auto
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.title === "AI Assistant" && (
                          <Badge variant="secondary" className="text-xs ml-auto">
                            AI
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === "/settings"}>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                <span>Settings</span>
                <Badge variant="outline" className="text-xs ml-auto">
                  <UserCheck className="size-3 mr-1" />
                  Config
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 py-2 text-center">
          <p className="text-xs text-muted-foreground">© 2024 GuardianAI</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
