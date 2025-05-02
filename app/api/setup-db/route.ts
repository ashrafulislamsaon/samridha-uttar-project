import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secretKey = searchParams.get("key")

    // Check if the secret key matches
    const ADMIN_SECRET_KEY = "aisislam2000mt2025"

    if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Execute SQL to ensure profiles table exists with correct structure
    const { error: sqlError } = await supabase.rpc("setup_profiles_table")

    if (sqlError) {
      // If RPC fails, try direct SQL (might not work depending on permissions)
      try {
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            first_name TEXT,
            last_name TEXT,
            email TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            postal_code TEXT,
            country TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create index on email for faster lookups
          CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        `

        const { error: directSqlError } = await supabase.rpc("exec_sql", { sql: createTableSQL })

        if (directSqlError) {
          return NextResponse.json(
            {
              success: false,
              message: "Could not set up profiles table automatically. Please set up manually.",
              error: directSqlError.message,
              sql: createTableSQL,
            },
            { status: 500 },
          )
        }
      } catch (directError: any) {
        return NextResponse.json(
          {
            success: false,
            message: "Could not set up profiles table automatically. Please set up manually.",
            error: directError.message,
          },
          { status: 500 },
        )
      }
    }

    // Check if the profiles table exists
    const { data: tableExists, error: checkError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "profiles")
      .eq("table_schema", "public")
      .maybeSingle()

    if (checkError || !tableExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not verify profiles table exists. Please check your database setup.",
          error: checkError?.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
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
