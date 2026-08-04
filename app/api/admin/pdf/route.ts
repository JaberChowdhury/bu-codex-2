import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PAGE_WIDTH = 595.28 // A4 in pt
const PAGE_HEIGHT = 841.89
const MARGIN = 40

const LEVEL_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Regular",
  3: "Expert",
}

type Member = {
  fullName: string
  studentId: string
  batch: string
  section: string
  gmail: string
  mobile: string
  tshirt: string
  experience?: number
  photo?: string
}

type Registration = {
  id: string
  team_name: string
  team_code: string
  created_at: string
  members: Member[]
}

type PhotoData = { data: Uint8Array; format: "JPEG" | "PNG" | "WEBP" }

async function fetchPhoto(url: string): Promise<PhotoData | null> {
  if (!url) return null
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const contentType = (res.headers.get("content-type") || "").toLowerCase()
    const format: PhotoData["format"] = contentType.includes("png")
      ? "PNG"
      : contentType.includes("webp")
        ? "WEBP"
        : "JPEG"
    return { data: new Uint8Array(await res.arrayBuffer()), format }
  } catch {
    return null
  }
}

function drawHeader(doc: jsPDF, subtitle: string) {
  doc.setFillColor(24, 12, 50)
  doc.rect(0, 0, PAGE_WIDTH, 70, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("BU CODEX 2026", MARGIN, 30)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(190, 170, 255)
  doc.text(subtitle, MARGIN, 50)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text("ADMIN EXPORT", PAGE_WIDTH - MARGIN, 50, { align: "right" })
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 160)
    doc.text(`BU CODEX 2026 · ${i} / ${pageCount}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 18, { align: "center" })
  }
}

function drawTeamHeading(doc: jsPDF, reg: Registration, y: number): number {
  doc.setTextColor(30, 20, 55)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text(reg.team_name, MARGIN, y)

  const code = reg.team_code
  doc.setFontSize(9)
  doc.setFillColor(238, 230, 255)
  doc.setDrawColor(180, 160, 230)
  doc.setLineWidth(0.5)
  const codeW = doc.getTextWidth(code)
  doc.roundedRect(PAGE_WIDTH - MARGIN - codeW - 16, y - 11, codeW + 16, 14, 3, 3, "FD")
  doc.text(code, PAGE_WIDTH - MARGIN - codeW - 8, y + 1, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(110, 110, 120)
  doc.text(`Registered: ${new Date(reg.created_at).toLocaleString("en-US")}`, MARGIN, y + 10)
  return y + 20
}

function drawField(doc: jsPDF, label: string, value: string, x: number, y: number) {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.setTextColor(140, 130, 165)
  doc.text(label.toUpperCase(), x, y)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(40, 35, 55)
  doc.text(value || "—", x, y + 12)
}

function drawSizeBadge(doc: jsPDF, size: string, x: number, y: number) {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  const w = doc.getTextWidth(size) + 14
  doc.setFillColor(96, 55, 200)
  doc.setDrawColor(96, 55, 200)
  doc.setLineWidth(0.5)
  doc.roundedRect(x, y - 10, w, 14, 3, 3, "FD")
  doc.setTextColor(255, 255, 255)
  doc.text(size, x + w / 2, y + 1, { align: "center" })
}

const CARD_H = 108

async function drawMemberCard(doc: jsPDF, member: Member, index: number, y: number): Promise<number> {
  const x = MARGIN
  const w = PAGE_WIDTH - MARGIN * 2

  if (y + CARD_H > PAGE_HEIGHT - MARGIN) {
    doc.addPage()
    y = MARGIN + 16
  }

  doc.setFillColor(247, 245, 253)
  doc.setDrawColor(226, 220, 242)
  doc.setLineWidth(0.5)
  doc.roundedRect(x, y, w, CARD_H, 8, 8, "FD")

  doc.setFillColor(96, 55, 200)
  doc.circle(x + 22, y + CARD_H / 2, 14, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text(String(index), x + 22, y + CARD_H / 2 + 4, { align: "center" })

  const photoX = x + 46
  const photoY = y + (CARD_H - 76) / 2
  let textX = photoX + 14
  const photo = await fetchPhoto(member.photo || "")
  if (photo) {
    try {
      const props = doc.getImageProperties(photo.data)
      const ratio = props.width / props.height
      let ph = 76
      let pw = ph * ratio
      if (pw > 78) {
        pw = 78
        ph = 78 / ratio
      }
      doc.addImage(photo.data, photo.format, photoX, y + (CARD_H - ph) / 2, pw, ph)
      textX = photoX + pw + 14
    } catch {
      drawNoPhoto(doc, photoX, photoY)
    }
  } else {
    drawNoPhoto(doc, photoX, photoY)
  }

  doc.setTextColor(35, 25, 55)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11.5)
  doc.text(member.fullName, textX, y + 24)

  drawSizeBadge(doc, member.tshirt, x + w - 16 - doc.getTextWidth(member.tshirt) - 14, y + 24)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(120, 112, 145)
  doc.text(`${member.studentId}  ·  SEC ${member.section} / BATCH ${member.batch}`, textX, y + 38)

  drawField(doc, "Email", member.gmail, textX, y + 58)
  drawField(doc, "Mobile", member.mobile, textX, y + 80)

  const expX = x + w - 16 - 120
  drawField(doc, "T-Shirt Size", member.tshirt, expX, y + 58)
  drawField(
    doc,
    "Level",
    LEVEL_LABELS[member.experience ?? -1] ?? String(member.experience ?? "—"),
    expX,
    y + 80
  )

  return y + CARD_H + 14
}

function drawNoPhoto(doc: jsPDF, x: number, y: number) {
  doc.setDrawColor(200, 200, 210)
  doc.setLineWidth(0.5)
  doc.rect(x, y, 76, 76)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 160)
  doc.text("NO PHOTO", x + 38, y + 40, { align: "center" })
}

async function buildTeamPdf(doc: jsPDF, reg: Registration) {
  drawHeader(doc, "TEAM REGISTRATION DETAILS")
  let y = drawTeamHeading(doc, reg, 96)
  for (const [i, member] of reg.members.entries()) {
    y = await drawMemberCard(doc, member, i + 1, y)
  }
  drawFooter(doc)
}

async function buildFullListPdf(doc: jsPDF, registrations: Registration[]) {
  drawHeader(doc, "ALL TEAM REGISTRATIONS")
  let y = 96

  for (const reg of registrations) {
    if (y > PAGE_HEIGHT - 120) {
      doc.addPage()
      y = MARGIN + 16
    }
    y = drawTeamHeading(doc, reg, y)
    const photos = await Promise.all(reg.members.map((m) => fetchPhoto(m.photo || "")))
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: "grid",
      head: [["Photo", "#", "Name", "Student ID", "Sec/Batch", "Email", "Phone", "T-Shirt"]],
      body: reg.members.map((m, i) => [
        "",
        String(i + 1),
        m.fullName,
        m.studentId,
        `${m.section}/${m.batch}`,
        m.gmail,
        m.mobile,
        m.tshirt,
      ]),
      styles: { fontSize: 7.5, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: [96, 55, 200], textColor: 255, fontSize: 7.5, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 242, 252] },
      columnStyles: {
        0: { cellWidth: 24, halign: "center" },
        6: { fontStyle: "bold", halign: "center", cellWidth: 42 },
      },
      didDrawCell: (data) => {
        if (data.section !== "body" || data.column.index !== 0) return
        const photo = photos[data.row.index]
        if (!photo) return
        try {
          const props = doc.getImageProperties(photo.data)
          const ratio = props.width / props.height
          const maxSize = 16
          let w = maxSize
          let h = maxSize
          if (ratio > 1) {
            h = w / ratio
          } else {
            w = h * ratio
          }
          const x = data.cell.x + (data.cell.width - w) / 2
          const y = data.cell.y + (data.cell.height - h) / 2
          doc.addImage(photo.data, photo.format, x, y, w, h)
        } catch {
          // ignore malformed image data
        }
      },
    })
    y = ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? y) + 22
  }

  drawFooter(doc)
}

function sanitizeFilename(s: string) {
  return s.replace(/[^a-zA-Z0-9-_]/g, "_")
}

export async function GET(req: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get("admin_auth")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const teamCode = searchParams.get("team")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  let query = supabase.from("registrations").select("*")
  if (teamCode) query = query.eq("team_code", teamCode)
  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const registrations = (data ?? []) as unknown as Registration[]
  if (registrations.length === 0) {
    return NextResponse.json({ error: "No registrations found" }, { status: 404 })
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" })

  if (teamCode) {
    await buildTeamPdf(doc, registrations[0])
  } else {
    await buildFullListPdf(doc, registrations)
  }

  const pdfBytes = doc.output("arraybuffer")
  const filename = teamCode
    ? `${sanitizeFilename(registrations[0].team_code)}.pdf`
    : "bu-codex-registrations.pdf"

  return new NextResponse(new Blob([pdfBytes], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
