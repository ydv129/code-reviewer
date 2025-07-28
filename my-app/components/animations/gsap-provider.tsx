"use client"

import type React from "react"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface GSAPProviderProps {
  children: React.ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger)

    // Set default GSAP settings
    gsap.defaults({
      duration: 0.6,
      ease: "power2.out",
    })

    // Global animations
    gsap.set(".gsap-fade-in", { opacity: 0, y: 30 })
    gsap.set(".gsap-slide-in-left", { opacity: 0, x: -50 })
    gsap.set(".gsap-slide-in-right", { opacity: 0, x: 50 })
    gsap.set(".gsap-scale-in", { opacity: 0, scale: 0.8 })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
