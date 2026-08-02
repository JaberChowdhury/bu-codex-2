"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LiveClock } from "@/components/motion/live-clock"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { THEME_ROOT, themeFromPathname } from "@/components/theme"
import { cn } from "@/lib/utils"

function SiteNav() {
  const pathname = usePathname()
  const theme = themeFromPathname(pathname)
  const base = THEME_ROOT[theme]

  const flags = [
    { label: "--home", href: `${base}/` },
    { label: "--gallery", href: `${base}/gallery` },
    { label: "--register", href: `${base}/register` },
  ]

  const isActive = (href: string) => {
    if (href === `${base}/`) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <p className="min-w-0 truncate font-mono text-xs leading-relaxed sm:text-sm">
          <span className="text-muted-foreground">
            <span className="hidden sm:inline">bu@codex:~$</span>
            <span className="sm:hidden">$</span>{" "}
          </span>
          <span className="text-foreground">bu</span>{" "}
          {flags.map((flag) => (
            <span key={flag.href}>
              <Link
                href={flag.href}
                className={cn(
                  "rounded px-1 transition-colors",
                  isActive(flag.href)
                    ? "bg-muted text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {flag.label}
              </Link>{" "}
            </span>
          ))}
          <span className="terminal-caret" aria-hidden="true" />
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <ThemeSwitcher theme={theme} />
          <LiveClock className="hidden shrink-0 md:inline" />
        </div>
      </div>
    </nav>
  )
}

export { SiteNav }
