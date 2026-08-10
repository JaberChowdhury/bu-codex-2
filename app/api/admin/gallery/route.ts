import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const tagsStr = formData.get("tags") as string
    const file = formData.get("file") as File

    if (!title || !category || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const tags = JSON.parse(tagsStr || "[]")

    // Upload to bucket
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `gallery-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("student_images")
      .upload(fileName, file, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload error: ${uploadError.message}` },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from("student_images")
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData.publicUrl

    // Insert into table
    const { data, error } = await supabase
      .from("gallery")
      .insert([{ title, category, tags, image_url: imageUrl }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
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
    const formData = await req.formData()
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const tagsStr = formData.get("tags") as string
    const file = formData.get("file") as File | null

    if (!id || !title || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const tags = JSON.parse(tagsStr || "[]")
    
    type UpdatePayload = { title: string; category: string; tags: string[]; image_url?: string }
    const updatePayload: UpdatePayload = { title, category, tags }

    // Upload to bucket if a new file is provided
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `gallery-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("student_images")
        .upload(fileName, file, { contentType: file.type })

      if (uploadError) {
        return NextResponse.json(
          { error: `Upload error: ${uploadError.message}` },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from("student_images")
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

    return NextResponse.json(data)
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
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
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
