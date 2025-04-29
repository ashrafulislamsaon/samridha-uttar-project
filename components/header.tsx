"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Facebook, Youtube, Mail, Phone } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import UserMenu from "@/components/user-menu"
import { useLanguage } from "@/context/language-context"

export default function Header() {
  const { t } = useLanguage()

  return (
    <>
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-1 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="hidden md:flex space-x-4">
            <Link href="#" className="text-white hover:text-green-100">
              <Facebook size={18} className="inline mr-1" />
            </Link>
            <Link href="#" className="text-white hover:text-green-100">
              <Youtube size={18} className="inline mr-1" />
            </Link>
            <Link href="mailto:info@yourfoundation.org" className="text-white hover:text-green-100">
              <Mail size={18} className="inline mr-1" />
            </Link>
            <Link href="tel:+1234567890" className="text-white hover:text-green-100">
              <Phone size={18} className="inline mr-1" />
            </Link>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/placeholder.svg?height=60&width=60"
                alt="Foundation Logo"
                width={60}
                height={60}
                className="mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-green-700">{t("header.foundation")}</h1>
                <p className="text-sm text-gray-600">{t("header.tagline")}</p>
              </div>
            </Link>
          </div>
          <div className="flex space-x-2">
            <UserMenu />
            <Link href="/donate">
              <Button className="bg-green-600 hover:bg-green-700 text-white">{t("header.donate")}</Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
