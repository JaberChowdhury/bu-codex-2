"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { LiveClock } from "@/components/motion/live-clock"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { THEME_ROOT, themeFromPathname } from "@/components/theme"
import { cn } from "@/lib/utils"

function SiteNav() {
  const pathname = usePathname()
  const theme = themeFromPathname(pathname)
  const base = THEME_ROOT[theme]
  const [open, setOpen] = useState(false)
  const [hoverMore, setHoverMore] = useState(false)

  const mainFlags = [
    { label: "--home", href: `${base}/` },
    { label: "--gallery", href: `${base}/gallery` },
    { label: "--register", href: `${base}/register` },
  ]

  const dropdownFlags = [
    { label: "--teams", href: `${base}/teams` },
    { label: "--organisers", href: `${base}/organisers` },
    { label: "--rules", href: `${base}/rules` },
    { label: "--policies", href: `${base}/policies` },
    { label: "--leaderboard", href: `${base}/leaderboard` },
    { label: "--notices", href: `${base}/notices` },
  ]

  const allFlags = [...mainFlags, ...dropdownFlags]

  const isActive = (href: string) => {
    if (href === `${base}/`) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isDropdownActive = dropdownFlags.some((flag) => isActive(flag.href))

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <div className="flex min-w-0 items-center font-mono text-xs leading-relaxed sm:text-sm">
          <span className="mr-1 shrink-0 text-muted-foreground">
            <span className="hidden sm:inline">bu@codex:~$</span>
            <span className="sm:hidden">$</span>
          </span>
          <span className="mr-1 shrink-0 text-foreground">bu</span>
          <span className="hidden items-center space-x-1 md:flex">
            {mainFlags.map((flag) => (
              <Link
                key={flag.href}
                href={flag.href}
                className={cn(
                  "rounded px-1 transition-colors",
                  isActive(flag.href)
                    ? "bg-muted text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {flag.label}
              </Link>
            ))}

            <span
              className="relative inline-flex"
              onMouseEnter={() => setHoverMore(true)}
              onMouseLeave={() => setHoverMore(false)}
            >
              <span
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded px-1 transition-colors",
                  isDropdownActive
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                --more <span className="text-[10px]">▼</span>
              </span>
              <AnimatePresence>
                {hoverMore && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 z-50 mt-1 flex min-w-[140px] flex-col rounded-lg border border-border bg-card p-1.5 shadow-xl"
                  >
                    {dropdownFlags.map((flag) => (
                      <Link
                        key={flag.href}
                        href={flag.href}
                        className={cn(
                          "w-full rounded px-2 py-1.5 text-left text-xs transition-colors",
                          isActive(flag.href)
                            ? "bg-muted text-accent"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {flag.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </span>
          <span className="terminal-caret ml-1 shrink-0" aria-hidden="true" />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LiveClock className="hidden shrink-0 md:inline" />
          <ThemeSwitcher theme={theme} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="menu"
            className="flex h-8 w-8 items-center justify-center rounded border border-border font-mono text-xs text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {open ? "x" : "≡"}
          </button>
        </div>
      </div>
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border px-4 py-2 md:hidden"
        >
          <div className="flex flex-col gap-1 font-mono text-xs">
            {allFlags.map((flag) => (
              <Link
                key={flag.href}
                href={flag.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded px-2 py-2 transition-colors",
                  isActive(flag.href)
                    ? "bg-muted text-accent"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                )}
              >
                {flag.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export { SiteNav }
