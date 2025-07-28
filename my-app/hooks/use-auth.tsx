"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import type { AuthContextType, User } from "@/lib/types"
import { getClerk, mapClerkUser } from "@/lib/clerk"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clerk, setClerk] = useState<any>(null)

  const refreshUser = useCallback(() => {
    if (clerk?.user) setUser(mapClerkUser(clerk.user))
    else setUser(null)
  }, [clerk])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initializeClerk = async () => {
      setLoading(true)
      try {
        const clerkInstance = await getClerk()
        setClerk(clerkInstance)
        setUser(mapClerkUser(clerkInstance.user))
        setError(null)
        unsubscribe = clerkInstance.addListener((resources: any) => {
          setUser(mapClerkUser(resources.user))
        })
      } catch (err: any) {
        console.error("Failed to initialize Clerk:", err)
        setError(err.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeClerk()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const handleClerkError = (error: any, fallback: string) => {
    if (error?.errors?.[0]) {
      return error.errors[0].longMessage || error.errors[0].message || fallback
    }
    return error?.message || fallback
  }

  const login = async (email: string, password: string) => {
    if (!clerk) throw new Error("Clerk not initialized")
    setLoading(true)
    try {
      setError(null)
      const signInAttempt = await clerk.client.signIn.create({ identifier: email, password })

      if (signInAttempt.status === "complete") {
        await clerk.setActive({ session: signInAttempt.createdSessionId })
        refreshUser()
      } else if (signInAttempt.status === "needs_first_factor") {
        throw new Error("Additional verification required. Check your email.")
      } else {
        throw new Error("Login incomplete. Please try again.")
      }
    } catch (err: any) {
      const msg = handleClerkError(err, "Login failed. Please try again.")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string) => {
    if (!clerk) throw new Error("Clerk not initialized")
    setLoading(true)
    try {
      setError(null)
      await clerk.client.signUp.create({ emailAddress: email, password })
      await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      refreshUser()
    } catch (err: any) {
      const msg = handleClerkError(err, "Signup failed. Please try again.")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!clerk) throw new Error("Clerk not initialized")
    setLoading(true)
    try {
      await clerk.signOut()
      setUser(null)
      setError(null)
    } catch (err: any) {
      const msg = handleClerkError(err, "Logout failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (displayName: string) => {
    if (!clerk?.user) throw new Error("No user logged in")
    setLoading(true)
    try {
      const [firstName, ...lastParts] = displayName.trim().split(" ")
      await clerk.user.update({ firstName, lastName: lastParts.join(" ") })
      refreshUser()
    } catch (err: any) {
      const msg = handleClerkError(err, "Profile update failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!clerk?.user) throw new Error("No user logged in")
    setLoading(true)
    try {
      await clerk.user.setProfileImage({ file })
      refreshUser()
    } catch (err: any) {
      const msg = handleClerkError(err, "Avatar upload failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const updateUserPassword = async (newPassword: string) => {
    if (!clerk?.user) throw new Error("No user logged in")
    setLoading(true)
    try {
      await clerk.user.updatePassword({ newPassword })
    } catch (err: any) {
      const msg = handleClerkError(err, "Password update failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const sendPasswordReset = async (email: string) => {
    if (!clerk) throw new Error("Clerk not initialized")
    setLoading(true)
    try {
      await clerk.client.signIn.create({ identifier: email })
      await clerk.client.signIn.prepareFirstFactor({ strategy: "reset_password_email_code" })
    } catch (err: any) {
      const msg = handleClerkError(err, "Password reset failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const sendEmailVerification = async () => {
    if (!clerk?.user) throw new Error("No user logged in")
    setLoading(true)
    try {
      const email = clerk.user.primaryEmailAddress
      if (email) await email.prepareVerification({ strategy: "email_code" })
    } catch (err: any) {
      const msg = handleClerkError(err, "Email verification failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const signInWithProvider = async (provider: string) => {
    if (!clerk) throw new Error("Clerk not initialized")
    setLoading(true)
    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      })
    } catch (err: any) {
      const msg = handleClerkError(err, "Social sign-in failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!clerk?.user) throw new Error("No user logged in")
    setLoading(true)
    try {
      await clerk.user.delete()
      setUser(null)
    } catch (err: any) {
      const msg = handleClerkError(err, "Account deletion failed")
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUserProfile,
    uploadAvatar,
    updateUserPassword,
    sendPasswordReset,
    sendEmailVerification,
    signInWithProvider,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
