import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const userId = searchParams.get("userId")
    const secretKey = searchParams.get("key")
    const role = searchParams.get("role") || "user"

    // Check if the secret key matches
    const ADMIN_SECRET_KEY = "aisislam2000mt2025"

    if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    if (!email && !userId) {
      return NextResponse.json({ success: false, message: "Either email or userId must be provided" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    let targetUserId = userId

    // If no userId provided, look up by email
    if (!targetUserId && email) {
      console.log(`Looking up user by email: ${email}`)

      try {
        // First try with auth.users() if available
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
          filters: {
            email: email,
          },
        })

        if (userError) {
          console.log(`Error looking up user with admin API: ${userError.message}`)
          throw userError
        }

        if (userData?.users && userData.users.length > 0) {
          targetUserId = userData.users[0].id
          console.log(`Found user ID: ${targetUserId}`)
        }
      } catch (adminError) {
        console.log(`Admin API not available or error: ${adminError}`)

        // Fallback: try to get the user ID from an existing session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user?.email?.toLowerCase() === email.toLowerCase()) {
          targetUserId = session.user.id
          console.log(`Using session user ID: ${targetUserId}`)
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, message: "Could not find user ID" }, { status: 404 })
    }

    // Check if profile already exists
    console.log(`Checking if profile exists for user ID: ${targetUserId}`)
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", targetUserId)
      .maybeSingle()

    if (profileCheckError) {
      console.log(`Error checking profile: ${profileCheckError.message}`)
      return NextResponse.json(
        { success: false, message: `Error checking profile: ${profileCheckError.message}` },
        { status: 500 },
      )
    }

    if (existingProfile) {
      console.log(`Profile already exists for user ID: ${targetUserId}`)

      // Update the profile instead
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          email: email,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetUserId)

      if (updateError) {
        console.log(`Error updating profile: ${updateError.message}`)
        return NextResponse.json(
          { success: false, message: `Error updating profile: ${updateError.message}` },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: `Profile updated for user ID: ${targetUserId}`,
        profile: { id: targetUserId, email, role },
      })
    }

    // Create new profile
    console.log(`Creating new profile for user ID: ${targetUserId}`)
    const profileData = {
      id: targetUserId,
      email: email,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: newProfile, error: insertError } = await supabase.from("profiles").insert(profileData).select()

    if (insertError) {
      console.log(`Error creating profile: ${insertError.message}`)
      return NextResponse.json(
        {
          success: false,
          message: `Error creating profile: ${insertError.message}`,
          details: insertError,
          attempted_data: profileData,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Profile created for user ID: ${targetUserId}`,
      profile: newProfile,
    })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Unexpected error: ${error.message}`,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
