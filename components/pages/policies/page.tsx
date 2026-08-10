"use client"

import { motion } from "framer-motion"
import {
  IconShieldLock,
  IconCreditCardOff,
  IconPhotoUp,
  IconLockSquare,
} from "@tabler/icons-react"

export default function PoliciesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-emerald-500/30">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-emerald-500/10 mix-blend-screen blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[800px] w-[800px] rounded-full bg-teal-500/10 mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-6 py-24">
        <div className="mb-20 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center space-x-2 rounded-full border border-border bg-primary/5 px-4 py-1.5 backdrop-blur-md"
          >
            <IconShieldLock size={16} className="text-emerald-400" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Legal & Compliance
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-foreground via-foreground to-foreground/40 bg-clip-text pb-2 text-5xl font-black tracking-tight text-transparent md:text-7xl"
          >
            Policies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Clear and transparent guidelines regarding your data and payments.
          </motion.p>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative"
          >
            <div
              data-slot="card"
              className="relative flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-start md:p-10"
            >
              <div className="shrink-0 rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
                <IconCreditCardOff size={32} className="text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-card-foreground">
                  Refund Policy
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  All registration fees and payments made for the contest are
                  strictly non-refundable. Once a payment is processed and the
                  registration is confirmed, no refund requests will be
                  entertained under any circumstances.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative"
          >
            <div
              data-slot="card"
              className="relative flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-start md:p-10"
            >
              <div className="shrink-0 rounded-2xl bg-secondary/10 p-4 ring-1 ring-secondary/20">
                <IconPhotoUp size={32} className="text-secondary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-card-foreground">
                  Media & Photography
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  By participating in the contest, you consent to the capture of
                  your image and likeness. Pictures, videos, and media taken
                  during the event can be used anywhere by the organizers for
                  promotional, documentation, and public relations purposes.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group relative"
          >
            <div
              data-slot="card"
              className="relative flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-start md:p-10"
            >
              <div className="shrink-0 rounded-2xl bg-accent/10 p-4 ring-1 ring-accent/20">
                <IconLockSquare size={32} className="text-accent" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-card-foreground">
                  Data Privacy
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  We respect your privacy. Apart from your basic public profile
                  (Team Name, Members, and Media), all other personal
                  information collected during registration remains strictly
                  private and confidential. We will never share your personal
                  contact details or sensitive data with third parties.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
