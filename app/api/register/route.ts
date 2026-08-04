import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

import { departmentSchema, memberSchema, teamNameSchema } from "@/components/register/schema"
import { REGISTRATION_DEADLINE_ISO } from "@/lib/constants"

// We create a strict schema for the incoming member payload (without photo, as photo is handled separately)
const memberBaseSchema = memberSchema.omit({ photo: true })

export async function POST(req: Request) {
  try {
    if (Date.now() >= new Date(REGISTRATION_DEADLINE_ISO).getTime()) {
      return NextResponse.json({ error: "Registration is closed" }, { status: 403 })
    }

    const formData = await req.formData()
    
    const teamName = formData.get("teamName")
    const teamCode = formData.get("teamCode")
    const department = formData.get("department")

    if (typeof teamName !== "string" || typeof teamCode !== "string") {
      return NextResponse.json({ error: "Invalid teamName or teamCode" }, { status: 400 })
    }

    if (typeof department !== "string") {
      return NextResponse.json({ error: "Missing department" }, { status: 400 })
    }

    const departmentResult = departmentSchema.safeParse(department)
    if (!departmentResult.success) {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 })
    }

    const teamNameResult = teamNameSchema.safeParse(teamName)
    if (!teamNameResult.success) {
      return NextResponse.json({ error: "Invalid teamName" }, { status: 400 })
    }

    // 2. Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })

    const parsedMembers = []

    // 3. Process each member and their photo
    for (let i = 0; i < 3; i++) {
      const memberStr = formData.get(`member_${i}`)
      const photoFile = formData.get(`photo_${i}`)

      if (typeof memberStr !== "string") {
        return NextResponse.json({ error: `Missing data for member ${i + 1}` }, { status: 400 })
      }

      const rawMember = JSON.parse(memberStr)
      const memberResult = memberBaseSchema.safeParse(rawMember)

      if (!memberResult.success) {
        return NextResponse.json({ error: `Validation failed for member ${i + 1}` }, { status: 400 })
      }

      if (!(photoFile instanceof File)) {
        return NextResponse.json({ error: `Missing or invalid photo for member ${i + 1}` }, { status: 400 })
      }

      // Upload raw file to Supabase Storage
      const fileExt = photoFile.name.split('.').pop() || 'jpg'
      const fileName = `${teamCode}-member${i + 1}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("student_images")
        .upload(fileName, photoFile, {
          contentType: photoFile.type,
          upsert: false
        })

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        return NextResponse.json({ error: `Failed to upload photo for member ${i + 1}: ${uploadError.message}` }, { status: 500 })
      }

      const { data: publicUrlData } = supabase.storage.from("student_images").getPublicUrl(fileName)

      parsedMembers.push({
        ...memberResult.data,
        photo: publicUrlData.publicUrl
      })
    }

    // 4. Insert into Supabase 'registrations' table
    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          team_name: teamNameResult.data,
          team_code: teamCode,
          department: departmentResult.data,
          members: parsedMembers, // JSONB array with full member data + public photo URL
        }
      ])
      .select()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to save registration" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
