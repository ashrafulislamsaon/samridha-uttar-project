"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import ContentEditor from "@/components/admin/content-editor"
import type { ContentItem, ContentSection } from "@/lib/types/content"

export default function ContentManagementPage() {
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
  const [activeTab, setActiveTab] = useState<ContentSection>("hero")
  const { t } = useLanguage()
  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("content").select("*").order("display_order", { ascending: true })

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

  const handleContentUpdate = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from("content")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        throw error
      }

      // Refresh content
      await fetchContent()
      return { success: true }
    } catch (error: any) {
      console.error("Error updating content:", error)
      return { success: false, error: error.message }
    }
  }

  const handleContentCreate = async (sectionName: ContentSection, newContent: any) => {
    try {
      const { error } = await supabase.from("content").insert({
        section: sectionName,
        ...newContent,
        display_order: content[sectionName].length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      // Refresh content
      await fetchContent()
      return { success: true }
    } catch (error: any) {
      console.error("Error creating content:", error)
      return { success: false, error: error.message }
    }
  }

  const handleContentDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("content").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Refresh content
      await fetchContent()
      return { success: true }
    } catch (error: any) {
      console.error("Error deleting content:", error)
      return { success: false, error: error.message }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const sections: { id: ContentSection; label: string }[] = [
    { id: "hero", label: "Hero Section" },
    { id: "about", label: "About Us" },
    { id: "mission", label: "Mission & Vision" },
    { id: "programs", label: "Programs" },
    { id: "impact", label: "Impact" },
    { id: "footer", label: "Footer" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="hero" value={activeTab} onValueChange={(value) => setActiveTab(value as ContentSection)}>
        <TabsList className="mb-4">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{section.label} Content</CardTitle>
                <Button
                  onClick={() => {
                    // Create new content item
                    handleContentCreate(section.id, {
                      key: `new-${Date.now()}`,
                      title_en: "New Content",
                      content_en: "Enter content here",
                      is_active: true,
                    })
                  }}
                >
                  Add New Item
                </Button>
              </CardHeader>
              <CardContent>
                {content[section.id].length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No content items found for this section.</p>
                ) : (
                  <div className="space-y-6">
                    {content[section.id].map((item) => (
                      <ContentEditor
                        key={item.id}
                        content={item}
                        onUpdate={(updates) => handleContentUpdate(item.id, updates)}
                        onDelete={() => handleContentDelete(item.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
