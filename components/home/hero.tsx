"use client"

import Link from "next/link"
import { IconArrowRight, IconTerminal2 } from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { TerminalBoot } from "@/components/home/terminal-boot"
import { Countdown } from "@/components/motion/countdown"
import { THEME_ROOT, themeFromPathname } from "@/components/theme"
import { EVENT_DETAILS } from "@/lib/constants"

export function Hero() {
  const pathname = usePathname()
  const base = THEME_ROOT[themeFromPathname(pathname)]
  const registerHref = `${base}/register`

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
      <div className="min-h-[7rem]">
        <TerminalBoot />
      </div>

      <div className="rise">
        <div className="max-w-3xl">
          <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span className="pulse-dot text-accent">●</span>
            <span className="text-accent">system_status: READY</span>
            <span aria-hidden="true" className="text-border">
              {"//"}
            </span>
            <span aria-hidden="true">t-minus to reg close</span>
          </p>

          <h1 className="tnum mt-6 font-heading text-4xl font-bold break-words sm:text-6xl lg:text-7xl">
            {String(EVENT_DETAILS.PROBLEMS_COUNT).padStart(2, "0")} PROBLEMS.{" "}
            {EVENT_DETAILS.DURATION_HOURS} HOURS. {EVENT_DETAILS.TEAM_SIZE}{" "}
            MINDS.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A competitive programming contest by the BU CSE club. Round 02 lands
            {EVENT_DETAILS.MONTH_DAY}, {EVENT_DETAILS.YEAR}. Prelims online on{" "}
            {EVENT_DETAILS.PLATFORM}. Final onsite.{" "}
            {EVENT_DETAILS.LONG_PRIZES_TEXT}, and a{" "}
            {EVENT_DETAILS.DURATION_HOURS}-hour adrenaline spike. Open to any
            department of Bangladesh University (BU).
          </p>

          <div className="mt-10 flex flex-col gap-3">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              registration_closes_in ·{" "}
              {EVENT_DETAILS.REGISTRATION_CLOSES.toLowerCase()},{" "}
              {EVENT_DETAILS.YEAR} · {EVENT_DETAILS.TEAM_SLOTS} slots · entry{" "}
              {EVENT_DETAILS.ENTRY_FEE_AMOUNT}/team
            </span>
            <Countdown size="xl" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={registerHref} />}
            >
              <IconTerminal2 data-icon="inline-start" />
              register --now
              <IconArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="#faq" />}
            >
              <IconArrowRight data-icon="inline-start" />
              read --faq
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
