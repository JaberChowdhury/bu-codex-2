"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

import { PhotoField } from "./photo-field"
import { memberSchema, type MemberErrorMap } from "./schema"
import {
  EXPERIENCE_LEVELS,
  GENDERS,
  RELATIONS,
  SECTIONS,
  TSHIRTS,
  type Member,
} from "./types"

type MemberFieldsProps = {
  member: Member
  index: number
  onChange: (patch: Partial<Member>) => void
  attempted: boolean
}

function computeErrors(member: Member): MemberErrorMap {
  const result = memberSchema.safeParse(member)
  if (result.success) return {}
  const map: MemberErrorMap = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]) as keyof MemberErrorMap
    if (key && !map[key]) map[key] = issue.message
  }
  return map
}

function MemberFields({ member, index, onChange, attempted }: MemberFieldsProps) {
  const id = `m${index}`
  const errors = React.useMemo(() => computeErrors(member), [member])
  const [touched, setTouched] = React.useState<Set<string>>(new Set())

  const markTouched = (key: string) => {
    setTouched((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }

  const show = (key: keyof Member): string | undefined =>
    (touched.has(key) || attempted) && errors[key]
      ? errors[key]
      : undefined

  return (
    <div className="space-y-5">
      <PhotoField
        id={`${id}-photo`}
        value={member.photo}
        onChange={(photo) => onChange({ photo })}
        error={show("photo")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="full name" id={`${id}-name`} required error={show("fullName")}>
          <Input
            id={`${id}-name`}
            value={member.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
            onBlur={() => markTouched("fullName")}
            aria-invalid={!!errors.fullName}
            placeholder="e.g. Tanvir Ahmed"
            autoComplete="name"
            aria-required="true"
          />
        </Field>
        <Field label="gender" id={`${id}-gender`} required error={show("gender")}>
          <Select
            value={member.gender || null}
            onValueChange={(value) => {
              markTouched("gender")
              onChange({ gender: value ?? "" })
            }}
          >
            <SelectTrigger
              id={`${id}-gender`}
              className={cn("w-full", errors.gender && "border-destructive")}
            >
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="student id" id={`${id}-sid`} required error={show("studentId")}>
          <Input
            id={`${id}-sid`}
            value={member.studentId}
            onChange={(event) => onChange({ studentId: event.target.value })}
            onBlur={() => markTouched("studentId")}
            aria-invalid={!!errors.studentId}
            placeholder="e.g. 202431070002"
            maxLength={12}
            inputMode="numeric"
            autoComplete="off"
            aria-required="true"
          />
        </Field>
        <Field label="batch" id={`${id}-batch`} required error={show("batch")}>
          <Input
            id={`${id}-batch`}
            value={member.batch}
            onChange={(event) => onChange({ batch: event.target.value })}
            onBlur={() => markTouched("batch")}
            aria-invalid={!!errors.batch}
            placeholder="e.g. 24"
            maxLength={2}
            inputMode="numeric"
            autoComplete="off"
            aria-required="true"
          />
        </Field>
        <Field label="section" id={`${id}-section`} required error={show("section")}>
          <Select
            value={member.section || null}
            onValueChange={(value) => {
              markTouched("section")
              onChange({ section: value ?? "" })
            }}
          >
            <SelectTrigger
              id={`${id}-section`}
              className={cn("w-full", errors.section && "border-destructive")}
            >
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {SECTIONS.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="gmail" id={`${id}-gmail`} required error={show("gmail")}>
          <Input
            id={`${id}-gmail`}
            type="email"
            value={member.gmail}
            onChange={(event) => onChange({ gmail: event.target.value })}
            onBlur={() => markTouched("gmail")}
            aria-invalid={!!errors.gmail}
            placeholder="e.g. tanvir@gmail.com"
            autoComplete="email"
            aria-required="true"
          />
        </Field>
        <Field label="mobile" id={`${id}-mobile`} required error={show("mobile")}>
          <Input
            id={`${id}-mobile`}
            type="tel"
            inputMode="tel"
            value={member.mobile}
            onChange={(event) => onChange({ mobile: event.target.value })}
            onBlur={() => markTouched("mobile")}
            aria-invalid={!!errors.mobile}
            placeholder="e.g. 01712345678"
            autoComplete="tel"
            aria-required="true"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="emergency contact"
          id={`${id}-emergency`}
          required
          error={show("emergencyContact")}
        >
          <Input
            id={`${id}-emergency`}
            type="tel"
            inputMode="tel"
            value={member.emergencyContact}
            onChange={(event) =>
              onChange({ emergencyContact: event.target.value })
            }
            onBlur={() => markTouched("emergencyContact")}
            aria-invalid={!!errors.emergencyContact}
            placeholder="e.g. 01812345678"
            autoComplete="tel"
            aria-required="true"
          />
        </Field>
        <Field
          label="relation to team leader"
          id={`${id}-relation`}
          required
          error={show("relation")}
        >
          <Select
            value={member.relation || null}
            onValueChange={(value) => {
              markTouched("relation")
              onChange({ relation: value ?? "" })
            }}
          >
            <SelectTrigger
              id={`${id}-relation`}
              className={cn("w-full", errors.relation && "border-destructive")}
            >
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONS.map((relation) => (
                <SelectItem key={relation} value={relation}>
                  {relation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="t-shirt size" id={`${id}-tshirt`} required error={show("tshirt")}>
          <Select
            value={member.tshirt || null}
            onValueChange={(value) => {
              markTouched("tshirt")
              onChange({ tshirt: value ?? "" })
            }}
          >
            <SelectTrigger
              id={`${id}-tshirt`}
              className={cn("w-full", errors.tshirt && "border-destructive")}
            >
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {TSHIRTS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          competitive programming experience
          <span className="text-accent"> *</span>
        </Label>
        <Slider
          value={[member.experience]}
          min={1}
          max={3}
          step={1}
          aria-label="Competitive programming experience"
          onValueChange={(value) =>
            onChange({ experience: Array.isArray(value) ? value[0] : value })
          }
        />
        <p className="font-mono text-xs text-muted-foreground">
          <span className="tnum text-accent">{member.experience}</span>
          {" · "}
          {EXPERIENCE_LEVELS[member.experience]}
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  id,
  required,
  error,
  children,
  className,
}: {
  label: string
  id?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="font-mono text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { MemberFields }
