export interface User {
  id: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified?: boolean
  metadata?: {
    createdAt?: string
    lastSignInAt?: string
    [key: string]: any
  }
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null

  // Core methods
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName?: string) => Promise<{ status: string } | void>
  logout: () => Promise<void>

  // Profile management
  updateUserProfile: (displayName: string) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  updateUserPassword: (newPassword: string) => Promise<void>

  // Optional methods
  sendPasswordReset?: (email: string) => Promise<void>
  sendEmailVerification?: () => Promise<void>
  signInWithProvider?: (provider: string) => Promise<void>
  deleteAccount?: () => Promise<void>
}
