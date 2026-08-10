"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  IconBellRinging,
  IconCalendarStats,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react"

type Notice = {
  id: string
  category: string
  created_at: string
  title: string
  content: string
}

export default function NoticesPage() {
  const [notices, setNotices] = React.useState<Notice[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedNotice, setSelectedNotice] = React.useState<Notice | null>(
    null
  )

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

  // Close modal on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedNotice(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
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
                className="group relative cursor-pointer"
                onClick={() => setSelectedNotice(notice)}
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

                      {/* line-clamp-3 ensures it stays compact in the list view */}
                      <p className="line-clamp-3 overflow-hidden leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
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

      {/* Animated Full Description Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotice(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-bold tracking-widest text-primary uppercase">
                    {selectedNotice.category}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <IconCalendarStats size={14} />
                    {new Date(selectedNotice.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="rounded-full border border-border bg-background/50 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <IconX size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 overflow-y-auto p-6 sm:p-10">
                <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {selectedNotice.title}
                </h2>

                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                  <p className="leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">
                    {selectedNotice.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
