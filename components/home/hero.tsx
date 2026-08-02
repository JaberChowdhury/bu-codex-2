"use client"

import Link from "next/link"
import { IconArrowRight, IconTerminal2 } from "@tabler/icons-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { TerminalBoot } from "@/components/home/terminal-boot"
import { Countdown } from "@/components/motion/countdown"

export function Hero() {
  const [booted, setBooted] = React.useState(false)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20">
      <div className="max-w-3xl">
        <div className="min-h-[7rem]">
          <TerminalBoot onDone={() => setBooted(true)} />
        </div>

        <div className={booted ? "rise" : "hidden"}>
          <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="pulse-dot text-accent">●</span>
            <span className="text-accent">system_status: READY</span>
            <span aria-hidden="true" className="text-border">
              {"//"}
            </span>
            <span aria-hidden="true">t-minus to reg close</span>
          </p>

          <h1 className="mt-6 break-words font-heading text-4xl font-bold tnum sm:text-6xl lg:text-7xl">
            07 PROBLEMS. 5 HOURS. 3 MINDS.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A competitive programming contest by the BU CSE club. Round 02 lands
            Sept 12, 2026. Prelims online on Toph. Final onsite. No cash prizes —
            medals, certificates, t-shirts, and a five-hour adrenaline spike.
            Open to any department of Bangladesh University (BU).
          </p>

          <div className="mt-10 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              registration_closes_in · aug 13, 2026 · 20 slots · entry 400tk/team
            </span>
            <Countdown size="xl" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="/register" />}>
              <IconTerminal2 data-icon="inline-start" />
              register --now
              <IconArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#faq" />}>
              <IconArrowRight data-icon="inline-start" />
              read --faq
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
