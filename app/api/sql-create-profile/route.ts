import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const userId = searchParams.get("userId")
    const secretKey = searchParams.get("key")
    const role = searchParams.get("role") || "admin" // Default to admin for this endpoint

    // Check if the secret key matches
    const ADMIN_SECRET_KEY = "aisislam2000mt2025"

    if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    if (!email && !userId) {
      return NextResponse.json({ success: false, message: "Either email or userId must be provided" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get current user if no userId provided
    let targetUserId = userId
    if (!targetUserId) {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        targetUserId = session.user.id
      } else {
        return NextResponse.json(
          { success: false, message: "No user ID provided and no active session" },
          { status: 400 },
        )
      }
    }

    // Use raw SQL to insert or update the profile
    const sql = `
      INSERT INTO profiles (id, email, role, created_at, updated_at)
      VALUES ('${targetUserId}', '${email || ""}', '${role}', NOW(), NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        updated_at = NOW()
      RETURNING id, email, role;
    `

    const { data, error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `SQL error: ${error.message}`,
          sql: sql,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Profile created/updated for user ID: ${targetUserId}`,
      data: data,
    })
  } catch (error: any) {
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
