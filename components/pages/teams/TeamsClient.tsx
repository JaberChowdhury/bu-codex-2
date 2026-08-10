"use client"

import { motion } from "framer-motion"
import { IconUsers, IconAlertCircle } from "@tabler/icons-react"

interface Team {
  teamName: string
  members: string[]
}

export default function TeamsClient({
  teams,
  error,
}: {
  teams: Team[]
  error?: string
}) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 py-20 backdrop-blur-md">
        <IconAlertCircle size={48} className="mb-4 text-red-400" />
        <p className="text-lg text-red-300">Failed to load teams: {error}</p>
      </div>
    )
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card/50 py-32 backdrop-blur-md">
        <IconUsers size={48} className="mb-4 text-muted-foreground/50" />
        <p className="text-lg text-muted-foreground">No teams have registered yet.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {teams.map((team, index) => (
        <motion.div
          key={index}
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
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground"
          >
            <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10">
              <span className="text-6xl font-black text-foreground mix-blend-overlay">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mb-4 line-clamp-1 pr-12 font-heading text-xl font-bold text-primary">
              {team.teamName}
            </h3>

            <div className="mt-auto space-y-2">
              {team.members.map((member, mIdx) => (
                <div
                  key={mIdx}
                  className="flex items-center space-x-3 text-muted-foreground"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-accent/80"></div>
                  <span className="font-mono text-sm font-medium">
                    {member}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
