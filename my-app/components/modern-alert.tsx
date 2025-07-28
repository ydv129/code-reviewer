"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernAlertProps {
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost"
  }
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
  showIcon?: boolean
}

export function ModernAlert({
  variant = "default",
  title,
  description,
  action,
  dismissible = false,
  onDismiss,
  className,
  showIcon = true,
}: ModernAlertProps) {
  const getIcon = () => {
    if (!showIcon) return null

    switch (variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />
      case "destructive":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <Alert
      variant={variant}
      className={cn(
        "relative border-l-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
        variant === "success" && "border-l-green-500 bg-green-50/80 dark:bg-green-950/50",
        variant === "destructive" && "border-l-red-500 bg-red-50/80 dark:bg-red-950/50",
        variant === "warning" && "border-l-yellow-500 bg-yellow-50/80 dark:bg-yellow-950/50",
        variant === "info" && "border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/50",
        className,
      )}
    >
      <div className="flex items-start space-x-3">
        {showIcon && <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>}

        <div className="flex-1 min-w-0">
          <AlertTitle className="text-base font-semibold mb-1">{title}</AlertTitle>
          <AlertDescription className="text-sm leading-relaxed">{description}</AlertDescription>

          {action && (
            <div className="mt-3">
              <Button
                variant={action.variant || "default"}
                size="sm"
                onClick={action.onClick}
                className="h-8 px-3 text-xs font-medium"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    </Alert>
  )
}

// Pre-configured alert variants for common use cases
export function SuccessAlert({ title, description, ...props }: Omit<ModernAlertProps, "variant">) {
  return <ModernAlert variant="success" title={title} description={description} {...props} />
}

export function ErrorAlert({ title, description, ...props }: Omit<ModernAlertProps, "variant">) {
  return <ModernAlert variant="destructive" title={title} description={description} {...props} />
}

export function WarningAlert({ title, description, ...props }: Omit<ModernAlertProps, "variant">) {
  return <ModernAlert variant="warning" title={title} description={description} {...props} />
}

export function InfoAlert({ title, description, ...props }: Omit<ModernAlertProps, "variant">) {
  return <ModernAlert variant="info" title={title} description={description} {...props} />
}
