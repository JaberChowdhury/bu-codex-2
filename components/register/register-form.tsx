"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import { MemberFields } from "./member-fields"
import { ReviewStep } from "./review-step"
import { memberSchema, teamNameSchema } from "./schema"
import {
  STORAGE_KEY,
  STEP_LABELS,
  emptyDraft,
  makeTeamCode,
  sanitizeDraft,
  type Draft,
} from "./types"

const TOTAL_STEPS = STEP_LABELS.length

function readStoredDraft(): Draft {
  if (typeof window === "undefined") return emptyDraft()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyDraft()
    const parsed: unknown = JSON.parse(raw)
    return sanitizeDraft(parsed)
  } catch {
    return emptyDraft()
  }
}

function RegisterForm() {
  const [draft, setDraft] = React.useState<Draft>(readStoredDraft)
  const [step, setStep] = React.useState(0)
  const [attempted, setAttempted] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [teamCode, setTeamCode] = React.useState("")
  const submittedRef = React.useRef(false)

  React.useEffect(() => {
    if (submittedRef.current) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // storage may be unavailable
    }
  }, [draft])

  const patchMember = React.useCallback(
    (index: number, patch: Partial<Draft["members"][number]>) => {
      setDraft((prev) => {
        const members = prev.members.map((member, i) =>
          i === index ? { ...member, ...patch } : member
        ) as Draft["members"]
        return { ...prev, members }
      })
    },
    []
  )

  const teamNameError = React.useMemo(() => {
    const result = teamNameSchema.safeParse(draft.teamName)
    return result.success ? "" : result.error.issues[0]?.message ?? ""
  }, [draft.teamName])

  const teamStepValid = !teamNameError
  const memberStepValid = React.useMemo(() => {
    if (step < 1 || step > 3) return false
    return memberSchema.safeParse(draft.members[step - 1]).success
  }, [draft.members, step])

  const overallValid = React.useMemo(() => {
    return (
      teamStepValid &&
      draft.members.every((member) => memberSchema.safeParse(member).success)
    )
  }, [draft, teamStepValid])

  const stepValid =
    step === 0 ? teamStepValid : step >= 1 && step <= 3 ? memberStepValid : overallValid

  const handleNext = () => {
    if (!stepValid) {
      setAttempted(true)
      return
    }
    setAttempted(false)
    setStep((current) => Math.min(TOTAL_STEPS - 1, current + 1))
  }

  const handleBack = () => {
    setAttempted(false)
    setStep((current) => Math.max(0, current - 1))
  }

  const handleSubmit = () => {
    if (!overallValid) {
      setAttempted(true)
      return
    }
    setTeamCode(makeTeamCode(draft.teamName))
    submittedRef.current = true
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setDraft(emptyDraft())
    setDialogOpen(true)
  }

  const percent = Math.round((step / (TOTAL_STEPS - 1)) * 100)

  return (
    <div className="space-y-6">
      <Progress value={percent} className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>
            step {String(step + 1).padStart(2, "0")}/
            {String(TOTAL_STEPS).padStart(2, "0")} — {STEP_LABELS[step]}
          </span>
          <span className="tnum">{percent}%</span>
        </div>
      </Progress>

      <Card>
        <CardContent key={step} className="rise pt-2">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="team-name"
                  className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
                >
                  team name
                  <span className="text-accent"> *</span>
                </Label>
                <Input
                  id="team-name"
                  value={draft.teamName}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, teamName: event.target.value }))
                  }
                  aria-invalid={!!teamNameError}
                  placeholder="BU_CODEX_TEAM"
                  autoComplete="off"
                  aria-required="true"
                />
                {attempted && teamNameError ? (
                  <p role="alert" className="font-mono text-xs text-destructive">
                    {teamNameError}
                  </p>
                ) : null}
              </div>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                three members register together. one leader coordinates the
                entry — this form captures the whole team under a single code.
              </p>
            </div>
          )}

          {step >= 1 && step <= 3 && (
            <MemberFields
              member={draft.members[step - 1]}
              index={step - 1}
              onChange={(patch) => patchMember(step - 1, patch)}
              attempted={attempted}
            />
          )}

          {step === TOTAL_STEPS - 1 && (
            <ReviewStep
              draft={draft}
              ready={overallValid}
              onEdit={(memberIndex) => setStep(memberIndex + 1)}
            />
          )}
        </CardContent>

        <CardFooter className="justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>
            {"< back"}
          </Button>
          {step < TOTAL_STEPS - 1 ? (
            <Button variant="default" onClick={handleNext}>
              {"> next"}
            </Button>
          ) : (
            <Button variant="default" onClick={handleSubmit}>
              {"> submit"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-accent">
              registration: SUCCESS
            </DialogTitle>
            <DialogDescription className="font-mono">
              This is a demo build — registration opens Aug 02 2026. Data is
              stored only in your browser.
            </DialogDescription>
          </DialogHeader>
          <div
            role="status"
            aria-live="polite"
            className="space-y-2 rounded-lg border border-border bg-muted/50 p-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              team code
            </p>
            <p className="tnum font-mono text-xl tracking-wider text-accent">
              {teamCode}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { RegisterForm }
