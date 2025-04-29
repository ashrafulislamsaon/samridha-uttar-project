"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Get a fresh Supabase client for each server action
const getSupabase = () => {
  return createServerActionClient<Database>({ cookies })
}

export async function getFeaturedProjects() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching featured projects:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeaturedProjects:", error)
    // Return empty array instead of throwing to prevent page from crashing
    return []
  }
}

export async function getLatestNews() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching latest news:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getLatestNews:", error)
    // Return empty array instead of throwing to prevent page from crashing
    return []
  }
}

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, message: "Please provide a valid email address" }
  }

  try {
    const supabase = getSupabase()

    const { error } = await supabase.from("subscribers").insert({ email })

    if (error) {
      if (error.code === "23505") {
        // Unique violation
        return { success: true, message: "You're already subscribed to our newsletter!" }
      }

      console.error("Error subscribing to newsletter:", error)
      return { success: false, message: "An error occurred. Please try again later." }
    }

    return { success: true, message: "Thank you for subscribing to our newsletter!" }
  } catch (error) {
    console.error("Error in subscribeToNewsletter:", error)
    return { success: false, message: "An error occurred. Please try again later." }
  }
}
