import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const secretKey = searchParams.get("key")

    // Check if the secret key matches (replace with your own secure key)
    const ADMIN_SECRET_KEY = "your-secure-admin-key"

    if (!email || !secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: "Invalid parameters or unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Update the user's role to admin
    const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userData.id)

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
