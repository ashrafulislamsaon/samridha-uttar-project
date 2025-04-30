"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"
import type { ContentSection } from "@/lib/types/content"

// Get a fresh Supabase client for each server action
const getSupabase = () => {
  return createServerActionClient<Database>({ cookies })
}

export async function getContentBySection(section: ContentSection) {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("content")
      .select("*")
      .eq("section", section)
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error(`Error fetching ${section} content:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Error in getContentBySection(${section}):`, error)
    return []
  }
}

export async function getAllContent() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("content")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all content:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllContent:", error)
    return []
  }
}
