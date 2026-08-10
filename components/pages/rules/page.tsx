"use client"

import { motion } from "framer-motion"
import {
  IconScale,
  IconGavel,
  IconAlertTriangle,
  IconBook,
  IconDeviceDesktopAnalytics,
  IconClock,
  IconMessagesOff,
  IconDeviceWatchOff,
  IconPizza,
} from "@tabler/icons-react"
import React from "react"

const rulesData = [
  {
    icon: IconDeviceDesktopAnalytics,
    title: "Submission of Solutions",
    description:
      "Submitted solutions are called runs. Only source code is allowed. The contest strictly uses VJudge. Accessing other websites is strictly prohibited.",
  },
  {
    icon: IconMessagesOff,
    title: "Communication Rules",
    description:
      "Communication is restricted to team members and designated personnel only. No outside help or internet communication is permitted.",
  },
  {
    icon: IconClock,
    title: "Contest Duration",
    description:
      "The contest will last for exactly 3-4 hours. Late contestants may be barred from entering the arena.",
  },
  {
    icon: IconAlertTriangle,
    title: "Disqualification & Penalties",
    description:
      "Tampering with equipment, unauthorized modifications, distracting behavior, and accessing restricted sites will lead to immediate disqualification.",
  },
  {
    icon: IconBook,
    title: "Reference Documents",
    description:
      "Teams may bring printed reference materials (up to 25 pages with specific headers). No magnification is allowed. Documents must be submitted for inspection before the contest.",
  },
  {
    icon: IconDeviceWatchOff,
    title: "Prohibited Items",
    description:
      "No electronic devices (calculators, smartwatches, phones) or personal peripherals (keyboards, mice) are allowed.",
  },
  {
    icon: IconGavel,
    title: "Judge's Authority & Arena Rules",
    description:
      "There will be 8-12 problems. Teams can only touch workstations after the contest begins. All judge decisions are final.",
  },
  {
    icon: IconPizza,
    title: "Food & Environment",
    description:
      "Teams may bring dry food. Respect the arena rules and maintain a competitive yet disciplined environment.",
  },
]

export default function RulesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-rose-500/30">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-rose-500/10 mix-blend-screen blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-orange-500/10 mix-blend-screen blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-6 py-24">
        <div className="mb-20 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-2 rounded-full border border-border bg-primary/5 px-4 py-1.5 backdrop-blur-md"
          >
            <IconScale size={16} className="text-rose-400" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Official Guidelines
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-foreground via-foreground to-foreground/40 bg-clip-text pb-2 text-5xl font-black tracking-tight text-transparent md:text-7xl"
          >
            Contest Rules
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Please read and adhere to all the rules below. Violation of these
            rules may result in strict penalties or immediate disqualification.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {rulesData.map((rule, idx) => {
            const Icon = rule.icon
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="group relative"
              >
                <div
                  data-slot="card"
                  className="relative flex h-full flex-col items-start space-y-4 rounded-2xl border border-border bg-card p-8"
                >
                  <div className="rounded-2xl bg-primary/10 p-3 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-card-foreground">
                    {rule.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {rule.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </main>
  )
}
