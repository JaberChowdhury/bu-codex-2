"use client"

import * as React from "react"

import { useNow } from "@/components/motion/use-now"

export function LiveClock({
  showDate = true,
  className,
}: {
  showDate?: boolean
  className?: string
}) {
  const now = useNow()
  if (now === null) return null

  const d = new Date(now)
  const time = d.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const timezone = "BTT+06:00"

  return (
    <span
      className={`tnum font-mono text-xs tracking-widest text-muted-foreground ${className ?? ""}`}
    >
      [{showDate ? `${date} · ` : ""}
      {time} {timezone}]
    </span>
  )
}
