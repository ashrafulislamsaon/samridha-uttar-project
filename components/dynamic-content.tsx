"use client"

import type React from "react"

import { useContent } from "@/context/content-context"
import { useLanguage } from "@/context/language-context"
import type { ContentSection } from "@/lib/types/content"
import Image from "next/image"
import Link from "next/link"

interface DynamicContentProps {
  section: ContentSection
  contentKey: string
  fallback?: string
  type?: "title" | "content" | "image" | "link" | "full"
  className?: string
  imageProps?: {
    width?: number
    height?: number
    alt?: string
    className?: string
  }
  linkProps?: {
    className?: string
    children?: React.ReactNode
  }
}

export default function DynamicContent({
  section,
  contentKey,
  fallback = "",
  type = "content",
  className,
  imageProps,
  linkProps,
}: DynamicContentProps) {
  const { getContent } = useContent()
  const { language } = useLanguage()

  const content = getContent(section, contentKey)

  if (!content) {
    return <span className={className}>{fallback}</span>
  }

  // Return the full content object if requested
  if (type === "full") {
    return content
  }

  // Handle image type
  if (type === "image" && content.image_url) {
    return (
      <Image
        src={content.image_url || "/placeholder.svg"}
        alt={imageProps?.alt || (language === "BN" && content.title_bn ? content.title_bn : content.title_en)}
        width={imageProps?.width || 800}
        height={imageProps?.height || 600}
        className={imageProps?.className || className}
      />
    )
  }

  // Handle link type
  if (type === "link" && content.link) {
    return (
      <Link href={content.link} className={linkProps?.className || className}>
        {linkProps?.children || (language === "BN" && content.title_bn ? content.title_bn : content.title_en)}
      </Link>
    )
  }

  // Handle title type
  if (type === "title") {
    return (
      <span className={className}>{language === "BN" && content.title_bn ? content.title_bn : content.title_en}</span>
    )
  }

  // Handle content type (default)
  return (
    <span className={className}>
      {language === "BN" && content.content_bn ? content.content_bn : content.content_en}
    </span>
  )
}
