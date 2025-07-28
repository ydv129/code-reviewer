"use client"

import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, AlertTriangle, Info, AlertCircle, Sparkles, Shield } from "lucide-react"

export function useModernToast() {
  const { toast } = useToast()

  const showSuccess = (title: string, description?: string) => {
    toast({
      variant: "success",
      title,
      description,
      icon: <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />,
      showIcon: true,
    })
  }

  const showError = (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title,
      description,
      icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      showIcon: true,
    })
  }

  const showWarning = (title: string, description?: string) => {
    toast({
      variant: "warning",
      title,
      description,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
      showIcon: true,
    })
  }

  const showInfo = (title: string, description?: string) => {
    toast({
      variant: "info",
      title,
      description,
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      showIcon: true,
    })
  }

  const showSecurityAlert = (title: string, description?: string) => {
    toast({
      variant: "warning",
      title,
      description,
      icon: <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
      showIcon: true,
    })
  }

  const showWelcome = (title: string, description?: string) => {
    toast({
      variant: "success",
      title,
      description,
      icon: <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      showIcon: true,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showSecurityAlert,
    showWelcome,
    toast, // Original toast function for custom usage
  }
}
