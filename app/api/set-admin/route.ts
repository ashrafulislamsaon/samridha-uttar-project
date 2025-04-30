import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const secretKey = searchParams.get("key")

    // Check if the secret key matches (replace with your own secure key)
    const ADMIN_SECRET_KEY = "aisislam2000mt2025"

    if (!email || !secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: "Invalid parameters or unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // First, check if the user exists in auth
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
      filters: {
        email: email,
      },
    })

    if (userError) {
      return NextResponse.json({ success: false, message: userError.message }, { status: 500 })
    }

    if (!userData || !userData.users || userData.users.length === 0) {
      return NextResponse.json({ success: false, message: "User not found in auth system" }, { status: 404 })
    }

    const authUser = userData.users[0]

    // Check if user has a profile
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", authUser.id)

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      return NextResponse.json({ success: false, message: profileError.message }, { status: 500 })
    }

    // If profile doesn't exist, create it
    if (!profileData || profileData.length === 0) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: authUser.id,
        email: email.toLowerCase(),
        role: "admin", // Set as admin directly
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        return NextResponse.json(
          { success: false, message: `Error creating profile: ${insertError.message}` },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: `Created new profile for ${email} with admin role`,
      })
    }

    // Update the existing profile to admin
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role: "admin",
        email: email.toLowerCase(), // Ensure email is consistent
        updated_at: new Date().toISOString(),
      })
      .eq("id", authUser.id)

    if (updateError) {
      return NextResponse.json({ success: false, message: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} has been set as admin`,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
