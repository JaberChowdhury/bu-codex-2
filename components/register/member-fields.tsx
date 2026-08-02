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
import {
  EXPERIENCE_LEVELS,
  GENDERS,
  RELATIONS,
  TSHIRTS,
  type Member,
} from "./types"

type MemberFieldsProps = {
  member: Member
  index: number
  onChange: (patch: Partial<Member>) => void
}

function MemberFields({ member, index, onChange }: MemberFieldsProps) {
  const id = `m${index}`

  return (
    <div className="space-y-5">
      <PhotoField
        id={`${id}-photo`}
        value={member.photo}
        onChange={(photo) => onChange({ photo })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="full name" id={`${id}-name`} required>
          <Input
            id={`${id}-name`}
            value={member.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
            placeholder="e.g. Tanvir Ahmed"
            autoComplete="name"
            aria-required="true"
          />
        </Field>
        <Field label="gender" id={`${id}-gender`} required>
          <Select
            value={member.gender || null}
            onValueChange={(value) => onChange({ gender: value ?? "" })}
          >
            <SelectTrigger id={`${id}-gender`} className="w-full">
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
        <Field label="student id" id={`${id}-sid`} required>
          <Input
            id={`${id}-sid`}
            value={member.studentId}
            onChange={(event) => onChange({ studentId: event.target.value })}
            placeholder="e.g. 2024-3-60-000"
            autoComplete="off"
            aria-required="true"
          />
        </Field>
        <Field label="batch" id={`${id}-batch`} required>
          <Input
            id={`${id}-batch`}
            value={member.batch}
            onChange={(event) => onChange({ batch: event.target.value })}
            placeholder="e.g. 2024"
            autoComplete="off"
            aria-required="true"
          />
        </Field>
        <Field label="section" id={`${id}-section`} required>
          <Input
            id={`${id}-section`}
            value={member.section}
            onChange={(event) => onChange({ section: event.target.value })}
            placeholder="e.g. B1"
            autoComplete="off"
            aria-required="true"
          />
        </Field>
        <Field label="gmail" id={`${id}-gmail`} required>
          <Input
            id={`${id}-gmail`}
            type="email"
            value={member.gmail}
            onChange={(event) => onChange({ gmail: event.target.value })}
            placeholder="e.g. tanvir@gmail.com"
            autoComplete="email"
            aria-required="true"
          />
        </Field>
        <Field label="mobile" id={`${id}-mobile`} required>
          <Input
            id={`${id}-mobile`}
            type="tel"
            inputMode="tel"
            value={member.mobile}
            onChange={(event) => onChange({ mobile: event.target.value })}
            placeholder="e.g. 01712345678"
            autoComplete="tel"
            aria-required="true"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="emergency contact (optional)" id={`${id}-emergency`}>
          <Input
            id={`${id}-emergency`}
            value={member.emergencyContact}
            onChange={(event) =>
              onChange({ emergencyContact: event.target.value })
            }
            placeholder="e.g. guardian / friend"
            autoComplete="tel"
          />
        </Field>
        <Field label="relation to team leader" id={`${id}-relation`}>
          <Select
            value={member.relation || null}
            onValueChange={(value) => onChange({ relation: value ?? "" })}
          >
            <SelectTrigger id={`${id}-relation`} className="w-full">
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
        <Field label="t-shirt size" id={`${id}-tshirt`} required>
          <Select
            value={member.tshirt || null}
            onValueChange={(value) => onChange({ tshirt: value ?? "" })}
          >
            <SelectTrigger id={`${id}-tshirt`} className="w-full">
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
  children,
  className,
}: {
  label: string
  id?: string
  required?: boolean
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
    </div>
  )
}

export { MemberFields }
