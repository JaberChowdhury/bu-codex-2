"use client"

import * as React from "react"

/**
 * Returns the current epoch time, or `null` until the component is mounted.
 * Returning `null` during SSR/hydration avoids hydration mismatches for
 * anything that renders a live timestamp (the server's `Date.now()` will
 * always differ from the client's by the time hydration runs).
 */
export function useNow(interval = 1000) {
  const store = React.useRef({ now: null as number | null }).current

  const getSnapshot = React.useCallback(() => store.now, [store])

  const subscribe = React.useCallback(
    (callback: () => void) => {
      store.now = Date.now()
      callback()
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return () => {}
      const id = window.setInterval(() => {
        store.now = Date.now()
        callback()
      }, interval)
      return () => window.clearInterval(id)
    },
    [interval, store]
  )

  return React.useSyncExternalStore(subscribe, getSnapshot, () => null)
}
