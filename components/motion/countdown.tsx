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
  if (now === null) return null

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
        className={`grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-2xl ${className ?? ""}`}
      >
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-3 sm:p-5 shadow-sm transition-colors hover:bg-card/60"
          >
            <span className="tnum font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
              {unit.value}
            </span>
            <span className="mt-1 sm:mt-2 font-mono text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {unit.label}
            </span>
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
