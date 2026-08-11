import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

function normalizeTags(rawTags: unknown): string[] {
  if (!rawTags) return []
  if (Array.isArray(rawTags)) return rawTags.map(String).filter(Boolean)
  if (typeof rawTags === "string") {
    const trimmed = rawTags.trim()
    if (!trimmed) return []

    // Postgres array format string: {"tag1","tag2"}
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((t) => t.replace(/^["']|["']$/g, "").trim())
        .filter(Boolean)
    }

    // JSON array format string: ["tag1","tag2"]
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
      } catch {
        // fallback
      }
    }

    // Comma-separated format string: "tag1, tag2"
    return trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

export async function GET() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const formatted = data?.map((item) => ({
    ...item,
    tags: normalizeTags(item.tags),
  }))

  return NextResponse.json(formatted)
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("admin_auth")?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const formData = await req.formData()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const date = formData.get("date") as string
    const tagsStr = formData.get("tags") as string
    const file = formData.get("file") as File

    if (!title || !category || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const tags = normalizeTags(tagsStr)

    // Upload to bucket
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `gallery-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("gallery_images")
      .upload(fileName, file, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload error: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from("gallery_images")
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData.publicUrl

    // Insert into table
    const payload: Record<string, string | string[]> = {
      title,
      category,
      tags,
      image_url: imageUrl,
    }
    if (date) payload.date = date

    const { data, error } = await supabase
      .from("gallery")
      .insert([payload])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...data, tags: normalizeTags(data.tags) })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("admin_auth")?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const formData = await req.formData()
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const date = formData.get("date") as string
    const tagsStr = formData.get("tags") as string
    const file = formData.get("file") as File | null

    if (!id || !title || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const tags = normalizeTags(tagsStr)

    type UpdatePayload = {
      title: string
      category: string
      tags: string[]
      date?: string
      image_url?: string
    }
    const updatePayload: UpdatePayload = { title, category, tags }
    if (date) updatePayload.date = date

    // Upload to bucket if a new file is provided
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `gallery-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(fileName, file, { contentType: file.type })

      if (uploadError) {
        return NextResponse.json(
          { error: `Upload error: ${uploadError.message}` },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from("gallery_images")
        .getPublicUrl(fileName)

      updatePayload.image_url = publicUrlData.publicUrl
    }

    const { data, error } = await supabase
      .from("gallery")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...data, tags: normalizeTags(data.tags) })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get("admin_auth")?.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    // First fetch the record to get the image URL
    const { data: record, error: fetchError } = await supabase
      .from("gallery")
      .select("image_url")
      .eq("id", id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Delete from storage if URL exists
    if (record?.image_url) {
      const urlParts = record.image_url.split("/")
      const fileName = urlParts[urlParts.length - 1]

      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("gallery_images")
          .remove([fileName])

        if (storageError) {
          console.error("Failed to delete image from storage:", storageError)
        }
      }
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
