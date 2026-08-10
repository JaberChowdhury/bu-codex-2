"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LiveClock } from "@/components/motion/live-clock"
import { THEME_ROOT, themeFromPathname } from "@/components/theme"

function SiteFooter() {
  const pathname = usePathname()
  const base = THEME_ROOT[themeFromPathname(pathname)]

  return (
    <footer className="relative mt-24 border-t border-border/40 bg-card/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="bg-gradient-to-r from-primary to-accent bg-clip-text font-heading text-3xl leading-tight font-bold tracking-tight break-all text-transparent uppercase sm:text-4xl">
              BU_CODEX
              <br />
              ROUND_02
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed tracking-wide break-all text-muted-foreground uppercase">
              Department of CSE <br /> Bangladesh University, Dhaka <br />{" "}
              Bangladesh
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-bold tracking-widest text-foreground uppercase">
              Links
            </h3>
            <div className="flex flex-col gap-3 font-mono text-xs tracking-wide uppercase">
              <Link
                href={`${base}/`}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                Home
              </Link>
              <Link
                href={`${base}/gallery`}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                Gallery
              </Link>
              <Link
                href={`${base}/register`}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                Register
              </Link>
              <span className="text-muted-foreground/50">judge on vjudge</span>
              <span className="text-muted-foreground/50">teams of three</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-bold tracking-widest text-foreground uppercase">
              Contact Support
            </h3>
            <div className="flex flex-col gap-3 font-mono text-xs tracking-wide">
              <a
                href="https://wa.me/8801518971500"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="text-primary"> WhatsApp:</span> +880
                1518-971500 (Anas)
              </a>
              <a
                href="https://wa.me/8801607025114"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="text-primary"> WhatsApp:</span> +880
                1607-025114 (Sourov)
              </a>
              <a
                href="https://m.facebook.com/ProgrammingCommunityBangladeshUniversity/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
              >
                <span className="border-b border-accent/30 pb-0.5">
                  Facebook Page
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © 2026 BU CSE CLUB — COMPETE. SOLVE. SIGNAL.
          </p>
          <div className="rounded-full border border-border/40 bg-background/50 px-4 py-1.5 backdrop-blur-md">
            <LiveClock />
          </div>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
