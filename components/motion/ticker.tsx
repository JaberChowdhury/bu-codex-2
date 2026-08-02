"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const ITEMS = [
  "registration opens aug 02",
  "registration closes aug 13",
  "prelims online on toph · sep 08",
  "onsite final · sep 12",
  "teams of three",
  "open to any BU department",
  "20 team slots",
  "entry fee: 400tk per team",
  "no cash prizes — medals + certificates",
  "snacks + food at start and midpoint",
  "5 hours. 7 problems. 3 minds.",
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
