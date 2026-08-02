export type Member = {
  photo: string
  fullName: string
  gender: string
  studentId: string
  batch: string
  section: string
  gmail: string
  mobile: string
  emergencyContact: string
  relation: string
  tshirt: string
  experience: number
}

export type Draft = {
  teamName: string
  members: [Member, Member, Member]
}

export const STORAGE_KEY = "bu-codex-reg-draft"

export const TSHIRTS = ["XS", "S", "M", "L", "XL", "XXL"] as const

export const RELATIONS = ["teammate", "friend", "classmate", "other"] as const

export const GENDERS = ["male", "female"] as const

export const EXPERIENCE_LEVELS: Record<number, string> = {
  1: "Beginner",
  2: "Regular",
  3: "Expert",
}

export const STEP_LABELS = [
  "TEAM",
  "MEMBER 01",
  "MEMBER 02",
  "MEMBER 03",
  "REVIEW",
] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_RE = /^[0-9+()\- ]{7,15}$/

export function emptyMember(): Member {
  return {
    photo: "",
    fullName: "",
    gender: "",
    studentId: "",
    batch: "",
    section: "",
    gmail: "",
    mobile: "",
    emergencyContact: "",
    relation: "",
    tshirt: "",
    experience: 1,
  }
}

export function emptyDraft(): Draft {
  return {
    teamName: "",
    members: [emptyMember(), emptyMember(), emptyMember()],
  }
}

export function isEmailValid(value: string) {
  return EMAIL_RE.test(value.trim())
}

export function isMobileValid(value: string) {
  return MOBILE_RE.test(value.trim())
}

export function isMemberRequiredValid(member: Member) {
  return (
    member.photo !== "" &&
    member.fullName.trim() !== "" &&
    member.gender !== "" &&
    member.studentId.trim() !== "" &&
    member.batch.trim() !== "" &&
    member.section.trim() !== "" &&
    isEmailValid(member.gmail) &&
    isMobileValid(member.mobile) &&
    member.tshirt !== "" &&
    member.experience >= 1 &&
    member.experience <= 3
  )
}

export function isDraftValid(draft: Draft) {
  return (
    draft.teamName.trim() !== "" &&
    draft.members.every(isMemberRequiredValid)
  )
}

export function makeTeamCode(teamName: string) {
  const slug =
    teamName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4) || "TEAM"
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let random = ""
  for (let i = 0; i < 4; i++) {
    random += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `BU-${slug}-${random}`
}

export function sanitizeDraft(raw: unknown): Draft {
  const fallback = emptyDraft()
  if (typeof raw !== "object" || raw === null) return fallback
  const record = raw as Record<string, unknown>
  const teamName = typeof record.teamName === "string" ? record.teamName : ""
  const rawMembers = Array.isArray(record.members) ? record.members : []
  const members = fallback.members.map((fallbackMember, index) => {
    const source = (rawMembers[index] ?? {}) as Record<string, unknown>
    const member: Member = { ...fallbackMember }
    if (typeof source.photo === "string") member.photo = source.photo
    if (typeof source.fullName === "string") member.fullName = source.fullName
    if (typeof source.gender === "string") member.gender = source.gender
    if (typeof source.studentId === "string") member.studentId = source.studentId
    if (typeof source.batch === "string") member.batch = source.batch
    if (typeof source.section === "string") member.section = source.section
    if (typeof source.gmail === "string") member.gmail = source.gmail
    if (typeof source.mobile === "string") member.mobile = source.mobile
    if (typeof source.emergencyContact === "string")
      member.emergencyContact = source.emergencyContact
    if (typeof source.relation === "string") member.relation = source.relation
    if (typeof source.tshirt === "string") member.tshirt = source.tshirt
    if (
      typeof source.experience === "number" &&
      source.experience >= 1 &&
      source.experience <= 3
    ) {
      member.experience = source.experience
    }
    return member
  }) as Draft["members"]
  return { teamName, members }
}
