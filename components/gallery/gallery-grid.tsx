"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  galleryCategories,
  galleryEntries,
  type GalleryCategoryKey,
  type GalleryEntry,
} from "./gallery-data"

export function GalleryGrid() {
  const [filter, setFilter] = React.useState<GalleryCategoryKey>("all")

  const visible =
    filter === "all"
      ? galleryEntries
      : galleryEntries.filter((entry) => entry.category === filter)

  return (
    <div className="flex flex-col gap-8">
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter((value ?? "all") as GalleryCategoryKey)}
      >
        <TabsList>
          {galleryCategories.map((category) => (
            <TabsTrigger
              key={category.key}
              value={category.key}
              className="font-mono text-xs"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((entry) => (
          <GalleryCard key={entry.index} entry={entry} />
        ))}
      </div>
    </div>
  )
}

function GalleryCard({ entry }: { entry: GalleryEntry }) {
  const Icon = entry.icon

  return (
    <Card className="group border transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-card/80">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="tnum font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover:text-accent">
            {String(entry.index).padStart(2, "0")}/
            {String(galleryEntries.length).padStart(2, "0")}
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {entry.category}
          </p>
        </div>

        <Icon
          className="size-9 text-accent transition-transform duration-300 group-hover:scale-110"
          stroke={1.5}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-1">
          <CardTitle className="font-heading">{entry.title}</CardTitle>
          <CardDescription>{entry.description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}
