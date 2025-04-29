"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Users, Heart, FileText, DollarSign } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalProjects: 0,
  })
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: userCount, error: userError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        if (userError) throw userError

        // Get total donations and amount
        const { data: donations, error: donationsError } = await supabase.from("donations").select("amount")

        if (donationsError) throw donationsError

        const totalAmount =
          donations?.reduce((sum, donation) => sum + Number.parseFloat(donation.amount.toString()), 0) || 0

        // Get total projects
        const { count: projectCount, error: projectError } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })

        if (projectError) throw projectError

        setStats({
          totalUsers: userCount || 0,
          totalDonations: donations?.length || 0,
          totalAmount,
          totalProjects: projectCount || 0,
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        // Set default values in case of error
        setStats({
          totalUsers: 0,
          totalDonations: 0,
          totalAmount: 0,
          totalProjects: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Donations",
      value: stats.totalDonations,
      icon: Heart,
      color: "bg-red-500",
    },
    {
      title: "Total Amount",
      value: `৳${stats.totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Active Projects",
      value: stats.totalProjects,
      icon: FileText,
      color: "bg-purple-500",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No recent activity to display.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <a href="/admin/users" className="text-green-600 hover:underline">
                Manage Users
              </a>
            </p>
            <p>
              <a href="/admin/content" className="text-green-600 hover:underline">
                Edit Content
              </a>
            </p>
            <p>
              <a href="/admin/settings" className="text-green-600 hover:underline">
                System Settings
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
