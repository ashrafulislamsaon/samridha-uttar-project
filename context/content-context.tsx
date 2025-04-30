"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { ContentItem, ContentSection } from "@/lib/types/content"

type ContentContextType = {
  content: Record<ContentSection, ContentItem[]>
  getContent: (section: ContentSection, key?: string) => ContentItem | ContentItem[] | null
  loading: boolean
  error: string | null
  refreshContent: () => Promise<void>
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Record<ContentSection, ContentItem[]>>({
    hero: [],
    about: [],
    mission: [],
    programs: [],
    impact: [],
    footer: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) {
        throw error
      }

      // Group content by section
      const contentBySection: Record<ContentSection, ContentItem[]> = {
        hero: [],
        about: [],
        mission: [],
        programs: [],
        impact: [],
        footer: [],
      }

      data?.forEach((item) => {
        const section = item.section as ContentSection
        if (contentBySection[section]) {
          contentBySection[section].push(item as ContentItem)
        }
      })

      setContent(contentBySection)
    } catch (error: any) {
      console.error("Error fetching content:", error)
      setError(error.message || "Failed to fetch content")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const getContent = (section: ContentSection, key?: string): ContentItem | ContentItem[] | null => {
    if (!content[section] || content[section].length === 0) {
      return null
    }

    if (key) {
      return content[section].find((item) => item.key === key) || null
    }

    return content[section]
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        getContent,
        loading,
        error,
        refreshContent: fetchContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}
