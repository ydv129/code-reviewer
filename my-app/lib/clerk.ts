import { Clerk } from "@clerk/clerk-js"
import type { User } from "./types"

let clerkInstance: Clerk | null = null

export async function getClerk(): Promise<Clerk> {
  if (clerkInstance) {
    return clerkInstance
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set")
  }

  try {
    clerkInstance = new Clerk(publishableKey)
    await clerkInstance.load({
      appearance: {
        baseTheme: undefined,
      },
      localization: {
        // You can add custom error messages here if needed
      },
    })
    return clerkInstance
  } catch (error) {
    console.error("Failed to initialize Clerk:", error)
    throw error
  }
}

export function mapClerkUser(clerkUser: any): User | null {
  if (!clerkUser) return null

  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || null,
    displayName: clerkUser.fullName || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
    photoURL: clerkUser.imageUrl || null,
    emailVerified: clerkUser.primaryEmailAddress?.verification?.status === "verified",
    metadata: {
      createdAt: clerkUser.createdAt,
      lastSignInAt: clerkUser.lastSignInAt,
    },
  }
}
