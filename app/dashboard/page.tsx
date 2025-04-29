"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*, projects(title)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setDonations(data || [])
      } catch (err: any) {
        setError(err.message || "Failed to fetch donations")
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [user])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="bg-white py-4 px-4 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-green-700">
              Your Foundation
            </Link>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </header>

        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="donations">
              <TabsList className="mb-4">
                <TabsTrigger value="donations">My Donations</TabsTrigger>
                <TabsTrigger value="profile">My Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="donations">
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Your Donation History</h2>

                  {loading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                  ) : donations.length > 0 ? (
                    <div className="grid gap-4">
                      {donations.map((donation) => (
                        <Card key={donation.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              ${donation.amount} - {donation.projects?.title || "General Donation"}
                            </CardTitle>
                            <CardDescription>{new Date(donation.created_at).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                Status: <span className="font-medium">{donation.payment_status}</span>
                              </div>
                              <div>
                                Method: <span className="font-medium">{donation.payment_method}</span>
                              </div>
                              {donation.message && (
                                <div className="col-span-2">
                                  Message: <span className="italic">{donation.message}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="mb-4 text-gray-500">You haven't made any donations yet.</p>
                        <Link href="/donate">
                          <Button className="bg-green-600 hover:bg-green-700">Make Your First Donation</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-gray-700">{user?.email}</p>
                      </div>
                      <Link href="/dashboard/profile">
                        <Button className="bg-green-600 hover:bg-green-700">Edit Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
