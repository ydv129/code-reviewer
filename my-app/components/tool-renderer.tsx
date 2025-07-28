"use client"

import { Dashboard } from "@/components/dashboard"
import { UrlChecker } from "@/components/url-checker"
import { ImageScanner } from "@/components/image-scanner"
import { EmailScanner } from "@/components/email-scanner"
import { Chatbot } from "@/components/chatbot"
import { SecurityAuditor } from "@/components/security-auditor"
import { Protected } from "@/components/protected"
import { getToolById } from "@/lib/tool-registry"
import type { Tool } from "@/app/page"

interface ToolRendererProps {
  activeTool: Tool
  setActiveTool?: (tool: Tool) => void
}

export function ToolRenderer({ activeTool, setActiveTool }: ToolRendererProps) {
  const tool = getToolById(activeTool)

  if (!tool) {
    return <Dashboard setActiveTool={setActiveTool!} />
  }

  const renderToolComponent = () => {
    switch (tool.component) {
      case "dashboard":
        return <Dashboard setActiveTool={setActiveTool!} />
      case "url-checker":
        return <UrlChecker />
      case "image-scanner":
        return <ImageScanner />
      case "email-scanner":
        return <EmailScanner />
      case "chatbot":
        return <Chatbot />
      case "security-auditor":
        return <SecurityAuditor />
      default:
        return <Dashboard setActiveTool={setActiveTool!} />
    }
  }

  if (tool.requiresAuth && tool.id !== "dashboard") {
    return <Protected>{renderToolComponent()}</Protected>
  }

  return renderToolComponent()
}
