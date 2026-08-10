"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AmbientCanvas } from "./three-bg"

import Image from "next/image"
import { cn } from "@/lib/utils"

type GalleryItem = {
  id: string
  title: string
  category: string
  tags: string[]
  image_url: string
  created_at: string
  date?: string
}

export function GalleryGrid() {
  const [items, setItems] = React.useState<GalleryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<string>("all")
  const [selectedImage, setSelectedImage] = React.useState<GalleryItem | null>(
    null
  )

  React.useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/admin/gallery")
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (err) {
        console.error("Failed to fetch gallery", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Close lightbox on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const categories = React.useMemo(() => {
    const unique = new Set(items.map((i) => i.category.toLowerCase()))
    return ["all", ...Array.from(unique)]
  }, [items])

  const visible = React.useMemo(() => {
    if (filter === "all") return items
    return items.filter(
      (item) => item.category.toLowerCase() === filter.toLowerCase()
    )
  }, [items, filter])

  return (
    <>
      <AmbientCanvas />
      <div className="relative z-10 flex flex-col gap-12">
        <div className="flex w-full items-center justify-center">
          <div className="relative flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-black/20 p-2 shadow-2xl backdrop-blur-xl">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full px-5 py-2.5 font-mono text-xs font-semibold tracking-widest uppercase transition-colors duration-300",
                  filter === category
                    ? "text-primary-foreground drop-shadow-md"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {filter === category && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="mb-6 aspect-[4/3] animate-pulse rounded-2xl border border-border/50 bg-card/30"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/20 backdrop-blur-sm">
            <p className="font-mono text-muted-foreground">
              No frames indexed yet.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:gap-8 space-y-6 xl:space-y-8"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/90 p-4 backdrop-blur-xl md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-full max-w-7xl cursor-default overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <LightboxImage item={selectedImage} />

                {/* Image Info Overlay */}
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md border border-primary/30 bg-primary/20 px-2 py-1 font-mono text-xs tracking-widest text-primary uppercase backdrop-blur-md">
                        {selectedImage.category}
                      </span>
                      <span className="font-mono text-xs text-white/70">
                        {selectedImage.date 
                          ? selectedImage.date 
                          : new Date(selectedImage.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white md:text-4xl">
                      {selectedImage.title}
                    </h2>
                    {selectedImage.tags && selectedImage.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-white/10 bg-white/10 px-2 py-1 font-mono text-[0.65rem] text-white/80 uppercase backdrop-blur-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem
  onClick: () => void
}) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onClick={onClick}
      className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-xl backdrop-blur-sm transition-[box-shadow,border-color] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 break-inside-avoid w-full"
    >
      <div className="relative w-full overflow-hidden bg-muted/20">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-card/80">
            <svg
              className="h-8 w-8 animate-spin text-primary/50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={item.title}
          className={cn(
            "w-full h-auto min-h-[150px] object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]",
            loaded ? "blur-0 opacity-100" : "opacity-0 blur-md"
          )}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex translate-y-4 flex-col gap-3 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-30">
        <div className="flex items-center justify-between">
          <p className="rounded-md border border-primary/40 bg-primary/20 px-2 py-1 font-mono text-[0.65rem] tracking-widest text-primary-foreground uppercase backdrop-blur-md shadow-sm">
            {item.category}
          </p>
          <p className="tnum rounded-md bg-black/60 px-2 py-1 font-mono text-[0.65rem] text-white/90 backdrop-blur-md border border-white/10">
            {item.date ? item.date : new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-heading text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {item.title}
          </h3>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-white/20 bg-black/40 px-1.5 py-0.5 font-mono text-[0.6rem] text-white/80 uppercase backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function LightboxImage({ item }: { item: GalleryItem }) {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex min-h-[40vh] animate-pulse items-center justify-center bg-black/50 backdrop-blur-sm">
          <svg
            className="h-10 w-10 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      <Image
        src={item.image_url}
        alt={item.title}
        width={1920}
        height={1080}
        className={cn(
          "max-h-[85vh] w-auto object-contain transition-all duration-700",
          loaded ? "blur-0 opacity-100" : "opacity-0 blur-xl"
        )}
        quality={90}
        priority
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}
