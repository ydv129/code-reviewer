import type { LucideIcon } from "lucide-react"
import { Home, Link, ImageIcon, Mail, MessageCircle, Search } from "lucide-react"

export interface SecurityTool {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  requiresAuth: boolean
  component: string // Component file name
}

export const SECURITY_TOOLS: SecurityTool[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Overview and welcome",
    icon: Home,
    color: "text-gray-500",
    requiresAuth: false,
    component: "dashboard",
  },
  {
    id: "url-checker",
    title: "URL Checker",
    description: "Check URLs for threats",
    icon: Link,
    color: "text-blue-500",
    requiresAuth: true,
    component: "url-checker",
  },
  {
    id: "image-scanner",
    title: "Image Scanner",
    description: "Scan images for malicious content",
    icon: ImageIcon,
    color: "text-green-500",
    requiresAuth: true,
    component: "image-scanner",
  },
  {
    id: "email-scanner",
    title: "Email Scanner",
    description: "Analyze emails for phishing",
    icon: Mail,
    color: "text-yellow-500",
    requiresAuth: true,
    component: "email-scanner",
  },
  {
    id: "chatbot",
    title: "Security Assistant",
    description: "AI-powered security advice",
    icon: MessageCircle,
    color: "text-purple-500",
    requiresAuth: true,
    component: "chatbot",
  },
  {
    id: "security-auditor",
    title: "Security Auditor",
    description: "Comprehensive security analysis",
    icon: Search,
    color: "text-red-500",
    requiresAuth: true,
    component: "security-auditor",
  },
]

export const getToolById = (id: string): SecurityTool | undefined => {
  return SECURITY_TOOLS.find((tool) => tool.id === id)
}

export const getToolsForSidebar = (): SecurityTool[] => {
  return SECURITY_TOOLS.filter((tool) => tool.id !== "dashboard")
}
