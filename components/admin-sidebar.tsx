"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Users, FileText, BarChart, Settings, Home } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const menuItems = [
    { icon: Shield, label: "Dashboard", href: "/admin" },
    { icon: Users, label: t("auth.users"), href: "/admin/users" },
    { icon: FileText, label: "Content", href: "/admin/content" },
    { icon: BarChart, label: "Reports", href: "/admin/reports" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <div className="w-64 bg-green-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("auth.admin_panel")}</h1>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive ? "bg-green-700 text-white" : "text-green-100 hover:bg-green-700 hover:text-white"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="pt-8">
          <Link
            href="/"
            className="flex items-center px-4 py-3 rounded-md text-green-100 hover:bg-green-700 hover:text-white transition-colors"
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Back to Website</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
