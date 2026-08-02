"use client"

import * as React from "react"

export function useNow(interval = 1000) {
  const [now, setNow] = React.useState<number>(() => Date.now())

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return now
}
