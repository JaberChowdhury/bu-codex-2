import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import ExcelJS from 'exceljs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LEVEL_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Regular',
  3: 'Expert',
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

type PhotoData = { buffer: Uint8Array; extension: 'jpeg' | 'png' | 'webp' }

async function fetchPhoto(url: string): Promise<PhotoData | null> {
  if (!url) return null
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const contentType = (res.headers.get('content-type') || '').toLowerCase()
    const extension: PhotoData['extension'] = contentType.includes('png')
      ? 'png'
      : contentType.includes('webp')
        ? 'webp'
        : 'jpeg'
    return { buffer: new Uint8Array(await res.arrayBuffer()), extension }
  } catch {
    return null
  }
}

function sanitizeFilename(s: string) {
  return s.replace(/[^a-zA-Z0-9-_]/g, '_')
}

async function buildWorkbook(registrations: Registration[]) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Registrations')

  ws.columns = [
    { header: 'Photo', key: 'photo', width: 60 },
    { header: 'Team Name', key: 'teamName', width: 24 },
    { header: 'Team Code', key: 'teamCode', width: 18 },
    { header: 'Registered At', key: 'registeredAt', width: 24 },
    { header: 'Member #', key: 'memberNumber', width: 16 },
    { header: 'Full Name', key: 'fullName', width: 24 },
    { header: 'Student ID', key: 'studentId', width: 20 },
    { header: 'Section', key: 'section', width: 16 },
    { header: 'Batch', key: 'batch', width: 16 },
    { header: 'Gmail', key: 'gmail', width: 28 },
    { header: 'Mobile', key: 'mobile', width: 20 },
    { header: 'T-Shirt', key: 'tshirt', width: 16 },
    { header: 'Level', key: 'level', width: 16 },
  ]

  const headerRow = ws.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6037C8' } }
  headerRow.height = 20

  for (const reg of registrations) {
    for (const [i, member] of reg.members.entries()) {
      const rowIndex = ws.rowCount + 1
      ws.addRow({
        photo: '',
        teamName: reg.team_name,
        teamCode: reg.team_code,
        registeredAt: new Date(reg.created_at).toLocaleString('en-US'),
        memberNumber: i + 1,
        fullName: member.fullName,
        studentId: member.studentId,
        section: member.section,
        batch: member.batch,
        gmail: member.gmail,
        mobile: member.mobile,
        tshirt: member.tshirt,
        level: LEVEL_LABELS[member.experience ?? -1] ?? String(member.experience ?? ''),
      })
      if (member.photo) {
        try {
          const photo = await fetchPhoto(member.photo)
          if (photo) {
            const imageId = wb.addImage({
              buffer: photo.buffer,
              extension: photo.extension as ExcelJS.Image['extension'],
            } as unknown as ExcelJS.Image)
            ws.addImage(imageId, {
              tl: { col: 0, row: rowIndex },
              ext: { width: 48, height: 48 },
            })
          }
        } catch {
          // skip image for this row
        }
      }
    }
  }

  return wb
}

export async function GET(req: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const teamCode = searchParams.get('team')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  let query = supabase.from('registrations').select('*')
  if (teamCode) query = query.eq('team_code', teamCode)
  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const registrations = (data ?? []) as unknown as Registration[]
  if (registrations.length === 0) {
    return NextResponse.json({ error: 'No registrations found' }, { status: 404 })
  }

  const wb = await buildWorkbook(registrations)
  const buf = await wb.xlsx.writeBuffer()

  const filename = teamCode
    ? `${sanitizeFilename(registrations[0].team_code)}.xlsx`
    : 'bu-codex-registrations.xlsx'

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
