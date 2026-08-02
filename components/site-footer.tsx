import Link from "next/link"

import { LiveClock } from "@/components/motion/live-clock"

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="break-all font-heading text-2xl leading-tight tracking-tight uppercase sm:text-3xl">
          BU_CODEX//ROUND_02
        </p>
        <p className="mt-2 break-all font-mono text-xs leading-tight tracking-wide text-muted-foreground uppercase">
          Department of CSE · Bangladesh University, Dhaka · Bangladesh
        </p>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 font-mono text-xs tracking-wide uppercase">
          <Link href="/" className="text-muted-foreground hover:text-accent">
            Home
          </Link>
          <Link href="/gallery" className="text-muted-foreground hover:text-accent">
            Gallery
          </Link>
          <Link href="/register" className="text-muted-foreground hover:text-accent">
            Register
          </Link>
          <span className="text-muted-foreground">judge on toph.co</span>
          <span className="text-muted-foreground">teams of three</span>
          <span className="text-muted-foreground">open to any BU department</span>
        </div>
        <p className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
          <span>© 2026 BU CSE CLUB — COMPETE. SOLVE. SIGNAL.</span>
          <LiveClock />
        </p>
      </div>
    </footer>
  )
}

export { SiteFooter }
