"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateProfilePage() {
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleCreateProfile = async () => {
    if (!email && !userId) {
      setError("Either email or user ID is required")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setResult(null)

    try {
      const params = new URLSearchParams()
      params.append("key", "aisislam2000mt2025")

      if (email) params.append("email", email)
      if (userId) params.append("userId", userId)
      params.append("role", role)

      const response = await fetch(`/api/create-profile?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setResult(data)
      } else {
        setError(data.message || "Failed to create profile")
        setResult(data)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create User Profile</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create or Update Profile</CardTitle>
          <CardDescription>
            Create a profile for a user or update an existing one. You need either the email or user ID.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID (optional if email provided)</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="UUID from auth.users"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {result && (
            <div className="mt-4">
              <Label>API Response:</Label>
              <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateProfile} disabled={loading}>
            {loading ? "Creating..." : "Create Profile"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
