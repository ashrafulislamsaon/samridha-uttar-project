"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div>
                <strong>User ID:</strong> {user.id}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role || "No role set"}
              </div>
              <div>
                <strong>Is Admin:</strong> {isAdmin() ? "Yes" : "No"}
              </div>
              <div>
                <strong>Auth Provider:</strong> {user.app_metadata?.provider || "Unknown"}
              </div>
              <div>
                <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
              </div>
              <div>
                <strong>Last Sign In:</strong> {new Date(user.last_sign_in_at || "").toLocaleString()}
              </div>
              <pre className="bg-gray-100 p-4 rounded-md mt-4 overflow-auto max-h-96">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          ) : (
            <p>No user is currently logged in.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
