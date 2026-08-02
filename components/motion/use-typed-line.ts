"use client"

import * as React from "react"

export function useTypedLine(
  text: string,
  options?: { delay?: number; speed?: number; enabled?: boolean },
) {
  const { delay = 0, speed = 22, enabled = true } = options ?? {}
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let interval: number | undefined

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      const id = window.setTimeout(() => {
        if (!cancelled) setCount(text.length)
      }, 0)
      return () => window.clearTimeout(id)
    }

    let char = 0
    const start = () => {
      interval = window.setInterval(() => {
        if (cancelled) return
        char += 1
        setCount(char)
        if (char >= text.length) {
          window.clearInterval(interval)
        }
      }, speed)
    }

    let timeout: number | undefined
    if (delay > 0) {
      timeout = window.setTimeout(start, delay)
    } else {
      start()
    }

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [text, speed, delay, enabled])

  return { typed: text.slice(0, count), complete: count >= text.length }
}
