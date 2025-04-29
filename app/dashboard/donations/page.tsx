"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DonationsPage() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("donations")
          .select("*, projects(title, slug)")
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
            <button onClick={() => router.back()} className="text-green-600 hover:text-green-700">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-green-700">Your Donations</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </header>

        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>View all your donations to Your Foundation</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                  </div>
                ) : donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <Card key={donation.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                ${donation.amount.toFixed(2)} - {donation.projects?.title || "General Donation"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(donation.created_at).toLocaleDateString()} •
                                {donation.payment_status === "completed" ? (
                                  <span className="text-green-600 ml-1">Completed</span>
                                ) : (
                                  <span className="text-amber-600 ml-1">{donation.payment_status}</span>
                                )}
                              </p>
                              {donation.message && <p className="mt-2 text-gray-600 italic">"{donation.message}"</p>}
                            </div>
                            <div className="mt-4 md:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600"
                                onClick={() => router.push(`/donate/receipt?id=${donation.id}`)}
                              >
                                View Receipt
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                    <Link href="/donate">
                      <Button className="bg-green-600 hover:bg-green-700">Make Your First Donation</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
