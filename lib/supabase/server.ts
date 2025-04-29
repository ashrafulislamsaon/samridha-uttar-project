import { createServerComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export const getServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

export const getActionSupabaseClient = () => {
  return createServerActionClient<Database>({ cookies })
}
