"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { EXPERIENCE_LEVELS, type Draft } from "./types"

type ReviewStepProps = {
  draft: Draft
  ready: boolean
  onEdit: (memberIndex: number) => void
}

function ReviewStep({ draft, ready, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          team
        </p>
        <p className="font-heading text-lg font-medium">{draft.teamName}</p>
      </div>

      <div className="space-y-3">
        {draft.members.map((member, index) => (
          <div key={index} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                member {String(index + 1).padStart(2, "0")}
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => onEdit(index)}
                className="font-mono"
              >
                {"[ edit ]"}
              </Button>
            </div>
            <dl className="grid gap-x-4 gap-y-1.5 font-mono text-xs sm:grid-cols-2">
              <Row k="name" v={member.fullName} />
              <Row k="gender" v={member.gender || "—"} />
              <Row k="sid" v={member.studentId} />
              <Row
                k="batch / section"
                v={[member.batch, member.section].filter(Boolean).join(" / ") || "—"}
              />
              <Row k="gmail" v={member.gmail} />
              <Row k="mobile" v={member.mobile} />
              <Row k="tshirt" v={member.tshirt || "—"} />
              <Row
                k="cp experience"
                v={`${member.experience} · ${EXPERIENCE_LEVELS[member.experience]}`}
              />
              <Row k="photo" v={member.photo ? "attached" : "none"} />
            </dl>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        status:{" "}
        <span className={cn(ready ? "text-accent" : "text-muted-foreground")}>
          {ready ? "ready" : "incomplete — use edit to finish"}
        </span>
      </p>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-muted-foreground">{k}:</dt>
      <dd className="tnum truncate text-foreground">{v}</dd>
    </div>
  )
}

export { ReviewStep }
