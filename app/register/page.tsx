import type { Metadata } from "next"

import { RegisterForm } from "@/components/register/register-form"

export const metadata: Metadata = {
  title: "REGISTER // ROUND_02",
  description:
    "BU CODEX Round 02 registration. Teams of three. One registration. Slots: 20.",
}

export default function RegisterPage() {
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
          Teams of three. One registration. 20 slots. Entry fee: 400tk per team.
        </p>
      </header>
      <RegisterForm />
    </main>
  )
}
