"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
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
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchContent() {
      try {
        console.log("Fetching content...")
        setLoading(true)

        const { data, error } = await supabase.from("content").select("*").order("display_order", { ascending: true })

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        console.log("Content data:", data)

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
        setError(null)
      } catch (error: any) {
        console.error("Error fetching content:", error)
        setError(error.message || "Failed to fetch content")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

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

      // Update local state instead of refetching
      setContent((prevContent) => {
        const newContent = { ...prevContent }

        // Find the section that contains this item
        Object.keys(newContent).forEach((sectionKey) => {
          const section = sectionKey as ContentSection
          const index = newContent[section].findIndex((item) => item.id === id)

          if (index !== -1) {
            // Update the item in that section
            newContent[section] = [
              ...newContent[section].slice(0, index),
              { ...newContent[section][index], ...updates },
              ...newContent[section].slice(index + 1),
            ]
          }
        })

        return newContent
      })

      return { success: true }
    } catch (error: any) {
      console.error("Error updating content:", error)
      return { success: false, error: error.message }
    }
  }

  const handleContentCreate = async (sectionName: ContentSection, newContent: any) => {
    try {
      const { data, error } = await supabase
        .from("content")
        .insert({
          section: sectionName,
          ...newContent,
          display_order: content[sectionName].length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        throw error
      }

      // Update local state instead of refetching
      setContent((prevContent) => {
        const newContent = { ...prevContent }
        if (data && data.length > 0) {
          newContent[sectionName] = [...newContent[sectionName], data[0] as ContentItem]
        }
        return newContent
      })

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

      // Update local state instead of refetching
      setContent((prevContent) => {
        const newContent = { ...prevContent }

        // Find the section that contains this item and remove it
        Object.keys(newContent).forEach((sectionKey) => {
          const section = sectionKey as ContentSection
          newContent[section] = newContent[section].filter((item) => item.id !== id)
        })

        return newContent
      })

      return { success: true }
    } catch (error: any) {
      console.error("Error deleting content:", error)
      return { success: false, error: error.message }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
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
