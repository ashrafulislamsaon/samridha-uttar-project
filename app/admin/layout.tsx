import type React from "react"
import AdminProtectedRoute from "@/components/admin-protected-route"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8">{children}</div>
      </div>
    </AdminProtectedRoute>
  )
}
