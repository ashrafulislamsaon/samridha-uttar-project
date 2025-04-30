export type ContentSection = "hero" | "about" | "mission" | "programs" | "impact" | "footer"

export interface ContentItem {
  id: string
  section: ContentSection
  key: string
  title_en: string
  title_bn?: string
  content_en: string
  content_bn?: string
  image_url?: string
  link?: string
  display_order?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentUpdate {
  title_en?: string
  title_bn?: string
  content_en?: string
  content_bn?: string
  image_url?: string
  link?: string
  is_active?: boolean
  display_order?: number
}
