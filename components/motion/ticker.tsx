"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { EVENT_DETAILS } from "@/lib/constants"

const ITEMS = [
  `registration opens ${EVENT_DETAILS.REGISTRATION_OPENS.toLowerCase()}`,
  `registration closes ${EVENT_DETAILS.REGISTRATION_CLOSES.toLowerCase()}`,
  `prelims ${EVENT_DETAILS.PLATFORM_TEXT.toLowerCase()} · ${EVENT_DETAILS.PRELIMS_DATE.toLowerCase()}`,
  `onsite final · ${EVENT_DETAILS.ONSITE_FINAL_DATE.toLowerCase()}`,
  `teams of ${EVENT_DETAILS.TEAM_SIZE}`,
  "open to any BU department",
  `${EVENT_DETAILS.TEAM_SLOTS} team slots`,
  `entry fee: ${EVENT_DETAILS.ENTRY_FEE_TEXT}`,
  EVENT_DETAILS.SHORT_PRIZES_TEXT,
  EVENT_DETAILS.SNACKS_INFO,
  `${EVENT_DETAILS.DURATION_HOURS} hours. ${EVENT_DETAILS.PROBLEMS_COUNT} problems. ${EVENT_DETAILS.TEAM_SIZE} minds.`,
]

export function Ticker({ className }: { className?: string }) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-border bg-muted/40 py-2",
        className,
      )}
      aria-label="Contest highlights"
    >
      {!reduced && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      )}
      {!reduced && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      )}
      <div className="ticker-track font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1}>
            {ITEMS.map((item, i) => (
              <span key={`${copy}-${i}`} className="mx-6 inline-flex items-center">
                <span className="text-accent">✦</span>
                <span className="ml-3">{item}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
