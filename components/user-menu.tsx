"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Heart, Shield } from "lucide-react"

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
          {language === "BN" ? "সদস্য হোন" : "Be a member"}
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Image
            src="/placeholder.svg?height=32&width=32"
            width="32"
            height="32"
            className="rounded-full border"
            alt="User avatar"
          />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <User className="h-4 w-4 text-green-700" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{t("nav.dashboard")}</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/donations" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem>
            <Heart className="mr-2 h-4 w-4" />
            <span>My Donations</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        {user.role === "admin" && (
          <Link href="/admin" onClick={() => setIsOpen(false)}>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false)
            signOut()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("auth.signout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
