"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionHeading } from "@/components/home/section-heading"
import { Button } from "@/components/ui/button"

export function Sponsors() {
  const [activeModal, setActiveModal] = React.useState<
    "sponsor" | "volunteer" | null
  >(null)

  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [activeModal])

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="partners · support">
          <h2 className="tnum mt-3 font-heading text-2xl font-bold uppercase sm:text-3xl">
            Sponsors // Backers
          </h2>
        </SectionHeading>
        <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
          Powering the next generation of problem solvers.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Platinum
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Gold
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Silver
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Bronze
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {/* Sponsor Invitation */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/10">
            <h3 className="mb-4 font-heading text-xl font-bold text-foreground">
              Invitation as Sponsor/Partner
            </h3>
            <p className="mb-6 font-mono text-sm text-muted-foreground">
              Interested in partnering with us? Support the next generation of
              tech talent and gain visibility among top students.
            </p>
            <Button
              onClick={() => setActiveModal("sponsor")}
              variant="default"
              className="shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            >
              Let&apos;s Talk
            </Button>
          </div>

          {/* Volunteer Invitation */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10">
            <h3 className="mb-4 font-heading text-xl font-bold text-foreground">
              Become a Volunteer
            </h3>
            <p className="mb-6 font-mono text-sm text-muted-foreground">
              Want to be part of the organizing team? Join us as a volunteer and
              help make BU CodeX a huge success!
            </p>
            <Button
              onClick={() => setActiveModal("volunteer")}
              variant="outline"
              className="border-accent/50 text-accent hover:bg-accent/10"
            >
              Join the Team
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setActiveModal(null)}
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl"
              >
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  ✕
                </button>

                <h3 className="mb-2 font-heading text-2xl font-bold text-foreground">
                  {activeModal === "sponsor"
                    ? "Partner with Us"
                    : "Join as Volunteer"}
                </h3>
                <p className="mb-8 font-mono text-sm text-muted-foreground">
                  {activeModal === "sponsor"
                    ? "Reach out to our organizing committee on WhatsApp to discuss sponsorship tiers and benefits."
                    : "Send us a message on WhatsApp to learn more about volunteer roles and responsibilities."}
                </p>

                <div className="space-y-4 font-mono text-sm">
                  <a
                    href="https://wa.me/8801518971500"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    <span>
                      <strong className="text-foreground">Anas</strong>
                      <br />
                      <span className="text-muted-foreground">
                        Lead Organizer
                      </span>
                    </span>
                    <span className="font-bold whitespace-nowrap text-primary">
                      +880 1518-971500
                    </span>
                  </a>

                  <a
                    href="https://wa.me/8801607025114"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-4 transition-colors hover:border-accent/50 hover:bg-accent/10"
                  >
                    <span>
                      <strong className="text-foreground">Sourov</strong>
                      <br />
                      <span className="text-muted-foreground">
                        Co-Organizer
                      </span>
                    </span>
                    <span className="font-bold whitespace-nowrap text-accent">
                      +880 1607-025114
                    </span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
