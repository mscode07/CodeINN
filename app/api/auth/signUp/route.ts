// app/api/auth/signup/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign up the user with Supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
    });

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: data.user.id, email: data.user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
