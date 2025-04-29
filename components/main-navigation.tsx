"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Menu, X } from "lucide-react"

export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.programs"), href: "/programs" },
    { label: t("nav.projects"), href: "/projects" },
    { label: t("nav.charity"), href: "/charity" },
    { label: t("nav.gallery"), href: "/gallery" },
    { label: t("nav.media"), href: "/media" },
    { label: t("nav.news"), href: "/news" },
    { label: t("nav.contact"), href: "/contact" },
  ]

  return (
    <nav className="bg-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-1 justify-between w-full">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-500 transition-colors"
              >
                {t("nav.dashboard")}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.dashboard")}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
