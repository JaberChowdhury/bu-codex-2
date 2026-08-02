"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LiveClock } from "@/components/motion/live-clock"
import { cn } from "@/lib/utils"

const flags = [
  { label: "--home", href: "/" },
  { label: "--gallery", href: "/gallery" },
  { label: "--register", href: "/register" },
]

function SiteNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <p className="truncate font-mono text-xs leading-relaxed sm:text-sm">
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
        <LiveClock className="hidden shrink-0 md:inline" />
      </div>
    </nav>
  )
}

export { SiteNav }
