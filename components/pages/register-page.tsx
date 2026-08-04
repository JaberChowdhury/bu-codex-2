import type { Metadata } from "next"

import { Card, CardContent } from "@/components/ui/card"
import { RegisterForm } from "@/components/register/register-form"
import { EVENT_DETAILS, REGISTRATION_DEADLINE_ISO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "REGISTER // ROUND_02",
  description:
    `BU CODEX Round 02 registration. Teams of ${EVENT_DETAILS.TEAM_SIZE}. One registration. Slots: ${EVENT_DETAILS.TEAM_SLOTS}.`,
}

const REGISTRATION_DEADLINE = new Date(REGISTRATION_DEADLINE_ISO)

function isDeadlinePassed(deadline: Date) {
  return Date.now() >= deadline.getTime()
}

export default function RegisterPage() {
  const isClosed = isDeadlinePassed(REGISTRATION_DEADLINE)

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8 space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          bu codex --register
        </p>
        <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
          REGISTER // ROUND_02
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          Teams of {EVENT_DETAILS.TEAM_SIZE}. One registration. {EVENT_DETAILS.TEAM_SLOTS} slots. Entry fee: {EVENT_DETAILS.ENTRY_FEE_TEXT}.
        </p>
      </header>

      {isClosed ? (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-destructive">
              registration: CLOSED
            </p>
            <h2 className="font-heading text-xl font-medium tracking-tight">
              THE REGISTRATION DEADLINE HAS PASSED
            </h2>
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              Registration closed on {REGISTRATION_DEADLINE.toLocaleString()}. No
              further entries are being accepted — reach out to the organizers if
              you have any questions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <RegisterForm />
      )}
    </main>
  )
}
