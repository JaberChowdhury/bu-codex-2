"use client"

import * as React from "react"

import type { Theme } from "@/components/theme"

/**
 * Applies the theme for the current route group onto <html>.
 * The pre-hydration inline script in each theme layout covers the initial
 * paint; this effect covers client-side navigation between theme routes.
 * All theme CSS is gated under html[data-theme], so even though loaded
 * stylesheets persist across navigation, only the active theme's rules apply.
 */
function ThemeRoot({ theme }: { theme: Theme }) {
  React.useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.toggle("dark", theme === "terminal")
  }, [theme])

  return null
}

export { ThemeRoot }
