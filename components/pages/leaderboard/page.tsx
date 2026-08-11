"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  IconTrophy,
  IconCalendarEvent,
  IconClock,
  IconLoader2,
} from "@tabler/icons-react"

type ProblemInfo = { name: string; solved: number; total: number }
type Result = { p: string; status: string; time?: string; tries?: number }
type LeaderboardRow = {
  rank: number
  team: string
  solved: number
  penalty: number
  results: Result[]
}

export default function LeaderboardPage() {
  const [problems, setProblems] = useState<ProblemInfo[]>([])
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.problems)) {
          const formatted = data.problems.map((p: string | ProblemInfo) =>
            typeof p === "string" ? { name: p, solved: 0, total: 0 } : p
          )
          setProblems(formatted)
        }
        setLeaderboardData(data.leaderboardData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch leaderboard data", err)
        setLoading(false)
      })
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-[#f59e0b]/30">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[#f59e0b]/10 mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-2 rounded-full border border-border bg-primary/5 px-4 py-1.5 backdrop-blur-md"
          >
            <IconTrophy size={16} className="text-[#fbbf24]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Hall of Fame
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text pb-2 text-5xl font-black tracking-tight text-transparent md:text-7xl"
          >
            Previous Standings
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground"
          >
            <div className="flex items-center space-x-2 rounded-xl bg-primary/5 px-4 py-2">
              <IconTrophy size={18} className="text-[#fbbf24]" />
              <span>BU CodeX Round - 01</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl bg-primary/5 px-4 py-2">
              <IconCalendarEvent size={18} className="text-[#60a5fa]" />
              <span>August 02, 2025</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl bg-primary/5 px-4 py-2">
              <IconClock size={18} className="text-[#34d399]" />
              <span>11:00 BST - 15:00 BST</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full pb-8"
        >
          <div
            data-slot="card"
            className="relative min-h-[400px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-primary/10 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                      <th className="w-20 p-6 text-center font-medium">Rank</th>
                      <th className="p-6 font-medium">Team</th>
                      <th className="w-24 p-6 text-center font-medium">
                        Solved
                      </th>
                      <th className="w-24 p-6 text-center font-medium">
                        Penalty
                      </th>
                      {problems.map((prob) => (
                        <th
                          key={prob.name}
                          className="w-20 p-4 text-center font-medium"
                        >
                          <div>{prob.name}</div>
                          <div className="font-mono text-[10px] font-normal text-muted-foreground/70">
                            {prob.solved}/{prob.total}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-card-foreground">
                    {leaderboardData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-primary/5"
                      >
                        <td className="p-6 text-center">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                              row.rank === 1
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                                : row.rank === 2
                                  ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/40"
                                  : row.rank === 3
                                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/40"
                                    : "text-muted-foreground"
                            }`}
                          >
                            {row.rank}
                          </span>
                        </td>
                        <td className="p-6 font-heading text-lg font-bold">
                          {row.team}
                        </td>
                        <td className="p-6 text-center font-mono font-bold text-[#047857] dark:text-[#34d399]">
                          {row.solved}
                        </td>
                        <td className="p-6 text-center font-mono text-muted-foreground">
                          {row.penalty}
                        </td>
                        {row.results.map((res, i) => (
                          <td key={i} className="p-2 text-center">
                            <div
                              className={`mx-auto flex h-14 w-16 flex-col items-center justify-center space-y-0.5 rounded-xl border font-mono text-xs ${
                                res.status === "solved"
                                  ? "border-[#10b981]/20 bg-[#10b981]/10 text-[#047857] dark:text-[#34d399]"
                                  : res.status === "failed"
                                    ? "border-[#f43f5e]/20 bg-[#f43f5e]/10 text-[#be123c] dark:text-[#fb7185]"
                                    : "border-border bg-muted/30 text-muted-foreground"
                              }`}
                            >
                              {res.status === "solved" && (
                                <>
                                  <span className="text-[11px] leading-none font-bold">
                                    {res.time}
                                  </span>
                                  {res.tries && res.tries > 1 ? (
                                    <span className="text-[10px] leading-none font-semibold opacity-75">
                                      (-{res.tries - 1})
                                    </span>
                                  ) : null}
                                </>
                              )}
                              {res.status === "failed" && (
                                <span className="text-[11px] font-bold">
                                  (-{res.tries})
                                </span>
                              )}
                              {res.status === "none" && (
                                <span className="opacity-40">-</span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
