import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secretKey = searchParams.get("key")

    // Check if the secret key matches (replace with your own secure key)
    const ADMIN_SECRET_KEY = "aisislam2000mt2025"

    if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      return NextResponse.json({ success: false, message: authError.message }, { status: 500 })
    }

    if (!authUsers || !authUsers.users || authUsers.users.length === 0) {
      return NextResponse.json({ success: false, message: "No users found in auth system" }, { status: 404 })
    }

    console.log(`Found ${authUsers.users.length} users in auth system`)

    // Get all profiles
    const { data: existingProfiles, error: profilesError } = await supabase.from("profiles").select("id, email")

    if (profilesError) {
      return NextResponse.json({ success: false, message: profilesError.message }, { status: 500 })
    }

    const existingProfileIds = new Set(existingProfiles?.map((profile) => profile.id) || [])
    const existingProfileEmails = new Set(existingProfiles?.map((profile) => profile.email?.toLowerCase()) || [])

    // Create missing profiles
    const profilesToCreate = []
    const updatedProfiles = []

    for (const user of authUsers.users) {
      const userEmail = user.email?.toLowerCase()

      if (!userEmail) continue

      if (!existingProfileIds.has(user.id)) {
        // Profile doesn't exist by ID, create it
        profilesToCreate.push({
          id: user.id,
          email: userEmail,
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } else if (!existingProfileEmails.has(userEmail)) {
        // Profile exists but email might be different, update it
        updatedProfiles.push({
          id: user.id,
          email: userEmail,
          updated_at: new Date().toISOString(),
        })
      }
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [],
    }

    // Insert new profiles
    if (profilesToCreate.length > 0) {
      const { data: insertData, error: insertError } = await supabase.from("profiles").insert(profilesToCreate).select()

      if (insertError) {
        results.errors.push(`Error creating profiles: ${insertError.message}`)
      } else {
        results.created = profilesToCreate.length
      }
    }

    // Update existing profiles
    for (const profile of updatedProfiles) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ email: profile.email, updated_at: profile.updated_at })
        .eq("id", profile.id)

      if (updateError) {
        results.errors.push(`Error updating profile ${profile.id}: ${updateError.message}`)
      } else {
        results.updated++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced profiles: ${results.created} created, ${results.updated} updated`,
      details: results,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
