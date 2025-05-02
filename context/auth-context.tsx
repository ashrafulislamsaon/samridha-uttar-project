"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type UserWithRole = User & { role?: string }

type AuthContextType = {
  user: UserWithRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user role:", error)
        return null
      }

      return data?.role || "user"
    } catch (err) {
      console.error("Error in fetchUserRole:", err)
      return null
    }
  }

  const updateUserWithRole = async (authUser: User) => {
    if (!authUser) return null

    const role = await fetchUserRole(authUser.id)
    return { ...authUser, role }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()

        if (data.user) {
          const userWithRole = await updateUserWithRole(data.user)
          setUser(userWithRole)
          console.log("User with role:", userWithRole) // Debug log
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event) // Debug log
      if (event === "SIGNED_IN" && session) {
        const userWithRole = await updateUserWithRole(session.user)
        setUser(userWithRole)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      } else if (event === "USER_UPDATED" && session) {
        const userWithRole = await updateUserWithRole(session.user)
        setUser(userWithRole)
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error && data.user) {
        const userWithRole = await updateUserWithRole(data.user)
        setUser(userWithRole)
        router.push("/dashboard")
        router.refresh()
      }

      return { error }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      // When a user signs up, create a profile with default role "user"
      if (!error && data.user) {
        try {
          console.log("Creating profile for new user:", data.user.id)

          const { error: profileError } = await supabase.from("profiles").upsert(
            {
              id: data.user.id,
              email: email.toLowerCase(),
              role: "user",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "id",
            },
          )

          if (profileError) {
            console.error("Error creating profile:", profileError)
          }
        } catch (profileErr) {
          console.error("Exception creating profile:", profileErr)
        }
      }

      return { data, error }
    } catch (error) {
      console.error("Error signing up:", error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      return { error }
    } catch (error) {
      console.error("Error resetting password:", error)
      return { error }
    }
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
