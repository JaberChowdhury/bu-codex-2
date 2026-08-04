import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const formData = await req.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies()
    cookieStore.set("admin_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
}
