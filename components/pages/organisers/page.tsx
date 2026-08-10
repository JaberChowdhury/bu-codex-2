"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  IconCode,
  IconTerminal2,
  IconShield,
  IconCpu,
} from "@tabler/icons-react"
import { AmbientCanvas } from "@/components/gallery/three-bg"

const organizers = [
  {
    name: "Anas",
    role: "Lead Organizer & Support",
    icon: <IconShield className="text-primary" />,
    whatsapp: "+880 1518-971500",
  },
  {
    name: "Sourov",
    role: "Co-Organizer & Support",
    icon: <IconCode className="text-accent" />,
    whatsapp: "+880 1607-025114",
  },
  {
    name: "John Doe",
    role: "Technical Lead",
    icon: <IconTerminal2 className="text-primary" />,
    whatsapp: "Contact via Email",
  },
  {
    name: "Jane Smith",
    role: "Event Coordinator",
    icon: <IconCpu className="text-accent" />,
    whatsapp: "Contact via Email",
  },
]

export default function OrganisersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-primary/30">
      <AmbientCanvas />

      <div className="relative z-10 container mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center justify-center space-x-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="font-mono text-sm font-medium tracking-wide text-primary uppercase">
              Behind the Scenes
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text pb-2 font-heading text-5xl font-bold tracking-tight text-transparent md:text-6xl"
          >
            Organising Committee
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl font-mono text-lg text-muted-foreground"
          >
            Meet the dedicated team responsible for bringing BU CodeX to life.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {organizers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col items-center rounded-2xl border border-border/50 bg-card/30 p-8 text-center backdrop-blur-md transition-all hover:-translate-y-2 hover:border-primary/50 hover:bg-card/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border/50 bg-background/50 text-3xl shadow-inner transition-transform group-hover:scale-110">
                {member.icon}
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                {member.name}
              </h3>
              <p className="mb-4 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                {member.role}
              </p>
              <div className="mt-auto rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                {member.whatsapp}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
