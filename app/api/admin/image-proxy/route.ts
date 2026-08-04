import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get("admin_auth")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }
  if (!target.hostname.endsWith("supabase.co")) {
    return NextResponse.json({ error: "Forbidden host" }, { status: 400 })
  }

  let res: Response
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    res = await fetch(target.toString(), { signal: controller.signal })
    clearTimeout(timer)
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 })
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 })
  }

  const contentType = res.headers.get("content-type") || "application/octet-stream"
  const bytes = await res.arrayBuffer()

  return new NextResponse(new Blob([bytes], { type: contentType }), {
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  })
}
