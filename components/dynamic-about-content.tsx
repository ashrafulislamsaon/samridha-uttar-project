"use client"

import { useLanguage } from "@/context/language-context"

interface DynamicAboutContentProps {
  content: any[]
  contentKey: string
  type?: "title" | "content"
  fallback?: string
  className?: string
}

export default function DynamicAboutContent({
  content,
  contentKey,
  type = "content",
  fallback = "",
  className,
}: DynamicAboutContentProps) {
  const { language } = useLanguage()

  // Find the content item with the matching key
  const contentItem = content?.find((item) => item.key === contentKey)

  if (!contentItem) {
    return <span className={className}>{fallback}</span>
  }

  // Return title or content based on type
  if (type === "title") {
    return (
      <span className={className}>
        {language === "BN" && contentItem.title_bn ? contentItem.title_bn : contentItem.title_en}
      </span>
    )
  }

  return (
    <span className={className}>
      {language === "BN" && contentItem.content_bn ? contentItem.content_bn : contentItem.content_en}
    </span>
  )
}
