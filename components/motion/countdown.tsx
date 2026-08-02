"use client"

import * as React from "react"

import { useNow } from "@/components/motion/use-now"

export const REG_CLOSE_TARGET = new Date("2026-08-13T17:59:00Z").getTime()

function diff(target: number, now: number) {
  let ms = Math.max(0, target - now)
  const days = Math.floor(ms / 86_400_000)
  ms -= days * 86_400_000
  const hours = Math.floor(ms / 3_600_000)
  ms -= hours * 3_600_000
  const minutes = Math.floor(ms / 60_000)
  ms -= minutes * 60_000
  const seconds = Math.floor(ms / 1_000)
  return { days, hours, minutes, seconds }
}

const pad = (n: number) => String(n).padStart(2, "0")

export function Countdown({
  target = REG_CLOSE_TARGET,
  size = "md",
  className,
}: {
  target?: number
  size?: "md" | "xl"
  className?: string
}) {
  const now = useNow()
  const { days, hours, minutes, seconds } = diff(target, now)
  const live = target - now <= 0

  if (live) {
    return (
      <span className={`font-mono text-sm tnum ${className ?? ""}`}>
        <span className="pulse-dot text-accent">●</span>{" "}
        <span className="text-accent">registration_closed</span>
      </span>
    )
  }

  const units = [
    { value: pad(days), label: "days" },
    { value: pad(hours), label: "hrs" },
    { value: pad(minutes), label: "min" },
    { value: pad(seconds), label: "sec" },
  ]

  if (size === "xl") {
    return (
      <div
        className={`flex flex-wrap items-stretch gap-2 sm:gap-3 ${className ?? ""}`}
      >
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-stretch gap-2 sm:gap-3">
            <div className="flex flex-col items-center rounded-lg border border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
              <span className="tnum font-heading text-4xl font-bold text-foreground sm:text-6xl">
                {unit.value}
              </span>
              <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="hidden self-center font-heading text-3xl text-muted-foreground sm:inline">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <span
      className={`inline-flex items-baseline gap-1 font-heading text-lg font-bold tnum sm:text-xl ${className ?? ""}`}
    >
      <span className="text-accent">{pad(days)}</span>
      <span className="text-muted-foreground">d</span>
      <span className="text-accent">{pad(hours)}</span>
      <span className="text-muted-foreground">h</span>
      <span className="text-accent">{pad(minutes)}</span>
      <span className="text-muted-foreground">m</span>
      <span className="text-accent">{pad(seconds)}</span>
      <span className="text-muted-foreground">s</span>
    </span>
  )
}
