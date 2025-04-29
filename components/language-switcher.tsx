"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs px-2 py-1 ${language === "EN" ? "bg-green-500" : "hover:bg-green-500"}`}
        onClick={() => setLanguage("EN")}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs px-2 py-1 ${language === "BN" ? "bg-green-500" : "hover:bg-green-500"}`}
        onClick={() => setLanguage("BN")}
      >
        বাংলা
      </Button>
    </div>
  )
}
