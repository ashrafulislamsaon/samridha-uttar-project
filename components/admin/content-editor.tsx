"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { ContentItem, ContentUpdate } from "@/lib/types/content"

interface ContentEditorProps {
  content: ContentItem
  onUpdate: (updates: ContentUpdate) => Promise<{ success: boolean; error?: string }>
  onDelete: () => Promise<{ success: boolean; error?: string }>
}

export default function ContentEditor({ content, onUpdate, onDelete }: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<ContentUpdate>({
    title_en: content.title_en,
    title_bn: content.title_bn || "",
    content_en: content.content_en,
    content_bn: content.content_bn || "",
    image_url: content.image_url || "",
    link: content.link || "",
    is_active: content.is_active,
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await onUpdate(formData)
      if (result.success) {
        toast({
          title: "Content updated",
          description: "The content has been updated successfully.",
        })
        setIsEditing(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this content item? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await onDelete()
      if (result.success) {
        toast({
          title: "Content deleted",
          description: "The content has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{content.title_en}</CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${content.is_active ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className="text-sm text-gray-500">{content.is_active ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-gray-600 line-clamp-2">{content.content_en}</p>
          {content.image_url && (
            <div className="mt-2">
              <Image
                src={content.image_url || "/placeholder.svg"}
                alt={content.title_en}
                width={200}
                height={100}
                className="rounded-md object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="english">
          <TabsList className="mb-4">
            <TabsTrigger value="english">English</TabsTrigger>
            <TabsTrigger value="bengali">Bengali</TabsTrigger>
          </TabsList>

          <TabsContent value="english" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_en">Title</Label>
              <Input
                id="title_en"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_en">Content</Label>
              <Textarea
                id="content_en"
                name="content_en"
                value={formData.content_en}
                onChange={handleChange}
                placeholder="Enter content"
                rows={5}
              />
            </div>
          </TabsContent>

          <TabsContent value="bengali" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_bn">Title (Bengali)</Label>
              <Input
                id="title_bn"
                name="title_bn"
                value={formData.title_bn}
                onChange={handleChange}
                placeholder="Enter title in Bengali"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_bn">Content (Bengali)</Label>
              <Textarea
                id="content_bn"
                name="content_bn"
                value={formData.content_bn}
                onChange={handleChange}
                placeholder="Enter content in Bengali"
                rows={5}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
            {formData.image_url && (
              <div className="mt-2">
                <Image
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Content image"
                  width={200}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link URL (optional)</Label>
            <Input id="link" name="link" value={formData.link} onChange={handleChange} placeholder="Enter link URL" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  )
}
