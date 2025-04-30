"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Debug logs
    console.log("AdminProtectedRoute - User:", user)
    console.log("AdminProtectedRoute - Loading:", loading)
    console.log("AdminProtectedRoute - Is Admin:", isAdmin())

    if (!loading) {
      if (!user) {
        console.log("No user, redirecting to login")
        router.push("/auth/login")
      } else if (!isAdmin()) {
        console.log("User is not admin, redirecting to dashboard")
        router.push("/dashboard")
      } else {
        console.log("User is admin, authorizing")
        setAuthorized(true)
      }
    }
  }, [user, loading, router, isAdmin])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checking authorization...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
