"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  IconBellRinging,
  IconCalendarStats,
  IconArrowRight,
} from "@tabler/icons-react"

export default function NoticesPage() {
  const [notices, setNotices] = React.useState<{
    id: string
    category: string
    created_at: string
    title: string
    content: string
  }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/admin/announcements")
        if (res.ok) {
          const data = await res.json()
          setNotices(data)
        }
      } catch (err) {
        console.error("Failed to fetch notices", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-purple-500/30">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-6 py-24">
        <div className="mb-20 space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center space-x-2 rounded-full border border-border bg-primary/5 px-4 py-1.5 backdrop-blur-md"
          >
            <IconBellRinging size={16} className="text-purple-400" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Updates & Announcements
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-foreground via-foreground to-foreground/40 bg-clip-text pb-2 text-5xl font-black tracking-tight text-transparent md:text-7xl"
          >
            Notice Board
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Stay up to date with the latest news, schedules, and important
            announcements for BU CodeX.
          </motion.p>
        </div>

        {loading ? (
          <div className="animate-pulse text-center text-muted-foreground">
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-border/50 bg-card/30 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <IconBellRinging className="h-8 w-8 text-primary opacity-80" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">No New Announcements</h2>
            <p className="text-muted-foreground">
              All quiet on the network. Check back soon for upcoming contest
              details, team brackets, and important updates!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="space-y-6"
          >
            {notices.map((notice) => (
              <motion.div
                key={notice.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="group relative"
              >
                <div
                  data-slot="card"
                  className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 md:p-8"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="rounded-md border border-border px-2.5 py-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                          {notice.category}
                        </span>
                        <div className="flex items-center space-x-1.5 text-sm text-muted-foreground">
                          <IconCalendarStats size={14} />
                          <span>
                            {new Date(notice.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                        {notice.title}
                      </h2>

                      <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                        {notice.content}
                      </p>
                    </div>

                    <div className="hidden shrink-0 items-center justify-center md:flex">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                        <IconArrowRight
                          size={20}
                          className="text-primary transition-colors group-hover:text-primary-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
