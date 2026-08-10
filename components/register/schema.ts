import { z } from "zod"

import { SECTIONS, TSHIRTS } from "./types"
import { DEPARTMENTS } from "@/lib/constants"

export const genderSchema = z.enum(["male", "female"], {
  error: "select gender",
})

export const sectionSchema = z.enum([...SECTIONS], {
  error: "select section",
})

export const departmentSchema = z.enum([...DEPARTMENTS], {
  error: "select department",
})

export const memberSchema = z.object({
  photo: z
    .any()
    .refine(
      (val) => val !== null && typeof val !== "string",
      "photo is required"
    ),
  fullName: z
    .string()
    .trim()
    .min(1, "full name is required")
    .min(3, "full name must be at least 3 characters"),
  gender: genderSchema,
  studentId: z
    .string()
    .trim()
    .min(1, "student id is required")
    .length(12, "student id must be 12 digits")
    .regex(/^\d{12}$/, "use format 202431070002"),
  batch: z
    .string()
    .trim()
    .min(1, "batch is required")
    .length(2, "batch must be 2 digits")
    .regex(/^\d{2}$/, "e.g. 24"),
  section: sectionSchema,
  gmail: z
    .string()
    .trim()
    .min(1, "gmail is required")
    .email("enter a valid gmail address")
    .regex(/@gmail\.com$/i, "must be a gmail address"),
  mobile: z
    .string()
    .trim()
    .min(1, "mobile is required")
    .regex(
      /^01[3-9]\d{8}$/,
      "enter a valid BD mobile number, e.g. 01712345678"
    ),
  emergencyContact: z
    .string()
    .trim()
    .min(1, "emergency contact is required")
    .regex(
      /^01[3-9]\d{8}$/,
      "enter a valid BD mobile number, e.g. 01712345678"
    ),
  relation: z.string().min(1, "relation to team leader is required"),
  tshirt: z.enum([...TSHIRTS], { error: "select t-shirt size" }),
  experience: z.number().int().min(1).max(3),
})

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, "team name is required")
  .min(3, "team name must be at least 3 characters")
  .max(24, "team name must be 24 characters or fewer")
  .regex(/^[A-Za-z0-9 _-]+$/, "only letters, numbers, spaces, - and _ allowed")

export type MemberErrorMap = Partial<
  Record<keyof z.infer<typeof memberSchema>, string>
>
