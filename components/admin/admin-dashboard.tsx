"use client"

import * as React from "react"
import html2canvas from "html2canvas-pro"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  IconList,
  IconGridDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react"

type Member = {
  fullName: string
  studentId: string
  gmail: string
  mobile: string
  section: string
  batch: string
  tshirt: string
  photo?: string
}

type Registration = {
  id: string
  team_name: string
  team_code: string
  created_at: string
  department?: string
  members: Member[]
}

type GalleryItemType = {
  id: string
  title: string
  category: string
  image_url: string
  date?: string
  tags?: string[]
}

type AnnouncementType = {
  id: string
  title: string
  content: string
  category: string
  created_at: string
}

export function AdminDashboard({
  registrations,
  error,
}: {
  registrations: Registration[]
  error?: string
}) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [galleryUploadStatus, setGalleryUploadStatus] = React.useState<
    "idle" | "uploading" | "success" | "error"
  >("idle")
  const [announceStatus, setAnnounceStatus] = React.useState<
    "idle" | "posting" | "success" | "error"
  >("idle")

  const [galleryTitle, setGalleryTitle] = React.useState("")
  const [galleryCategory, setGalleryCategory] = React.useState("general")
  const [galleryDate, setGalleryDate] = React.useState("")
  const [galleryPreview, setGalleryPreview] = React.useState<string | null>(
    null
  )
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState("")
  const [galleryFilter, setGalleryFilter] = React.useState("all")
  const [galleryViewMode, setGalleryViewMode] = React.useState<"list" | "grid">(
    "grid"
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image exceeds 1MB limit")
        e.target.value = ""
        setGalleryPreview(null)
        return
      }
      setGalleryPreview(URL.createObjectURL(file))
    } else {
      setGalleryPreview(null)
    }
  }
  const [announceTitle, setAnnounceTitle] = React.useState("")
  const [announceCategory, setAnnounceCategory] = React.useState("general")
  const [announceContent, setAnnounceContent] = React.useState("")
  const [editingGalleryId, setEditingGalleryId] = React.useState<string | null>(
    null
  )
  const [editingAnnounceId, setEditingAnnounceId] = React.useState<
    string | null
  >(null)

  const [galleryItems, setGalleryItems] = React.useState<GalleryItemType[]>([])
  const [announcements, setAnnouncements] = React.useState<AnnouncementType[]>(
    []
  )

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  React.useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGalleryItems(data)
      })
      .catch(console.error)

    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAnnouncements(data)
      })
      .catch(console.error)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.reload()
  }

  const triggerDownload = (url: string) => {
    const link = document.createElement("a")
    link.href = url
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const downloadAllPdf = () => {
    setIsExporting(true)
    triggerDownload("/api/admin/pdf")
    window.setTimeout(() => setIsExporting(false), 500)
  }

  const downloadTeamPdf = (reg: Registration) => {
    setIsExporting(true)
    triggerDownload(`/api/admin/pdf?team=${encodeURIComponent(reg.team_code)}`)
    window.setTimeout(() => setIsExporting(false), 500)
  }

  const downloadAllExcel = () => {
    setIsExporting(true)
    triggerDownload("/api/admin/export?format=xlsx")
    window.setTimeout(() => setIsExporting(false), 500)
  }

  const downloadTeamExcel = (reg: Registration) => {
    setIsExporting(true)
    triggerDownload(
      `/api/admin/export?format=xlsx&team=${encodeURIComponent(reg.team_code)}`
    )
    window.setTimeout(() => setIsExporting(false), 500)
  }

  const exportAsImage = async () => {
    setIsExporting(true)
    const container = document.getElementById("dashboard-container")
    if (!container) {
      setIsExporting(false)
      return
    }
    const imgs = Array.from(container.querySelectorAll("img"))
    const swaps = imgs.map((img) => {
      const orig = img.src
      img.dataset.orig = orig
      ;(img as HTMLImageElement).crossOrigin = "anonymous"
      img.src = `/api/admin/image-proxy?url=${encodeURIComponent(orig)}`
      return new Promise<void>((resolve) => {
        if (img.complete) resolve()
        else {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }
      })
    })
    await Promise.all(swaps)
    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#000000",
        logging: false,
      })
      const link = document.createElement("a")
      link.download = "bu-codex-registrations.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err) {
      console.error("Image Export Error:", err)
      alert("An error occurred while generating the image. Please try again.")
    } finally {
      imgs.forEach((img) => {
        img.src = img.dataset.orig ?? img.src
      })
      setIsExporting(false)
    }
  }

  const handleGallerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setGalleryUploadStatus("uploading")

    try {
      const form = e.currentTarget
      const file = (form.elements.namedItem("image-file") as HTMLInputElement)
        .files?.[0]

      if (!galleryTitle || (!file && !editingGalleryId)) {
        throw new Error("Missing title or file")
      }

      let res
      const formData = new FormData()
      formData.append("title", galleryTitle)
      formData.append("category", galleryCategory)
      if (galleryDate) formData.append("date", galleryDate)
      formData.append("tags", JSON.stringify(tags))
      if (file) formData.append("file", file)

      if (editingGalleryId) {
        // Update mode
        formData.append("id", editingGalleryId)
        res = await fetch("/api/admin/gallery", {
          method: "PUT",
          body: formData,
        })
      } else {
        // Create mode
        res = await fetch("/api/admin/gallery", {
          method: "POST",
          body: formData,
        })
      }

      if (!res.ok) throw new Error("Upload failed")

      const newItem = await res.json()
      if (editingGalleryId) {
        setGalleryItems(
          galleryItems.map((i) => (i.id === editingGalleryId ? newItem : i))
        )
      } else {
        setGalleryItems([newItem, ...galleryItems])
      }

      setGalleryUploadStatus("success")
      form.reset()
      setGalleryTitle("")
      setGalleryDate("")
      setGalleryPreview(null)
      setEditingGalleryId(null)
      setTags([])
      setTagInput("")
      setTimeout(() => setGalleryUploadStatus("idle"), 3000)
    } catch (err) {
      console.error(err)
      setGalleryUploadStatus("error")
      setTimeout(() => setGalleryUploadStatus("idle"), 3000)
    }
  }

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this image?")) return
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" })
    if (res.ok) setGalleryItems(galleryItems.filter((i) => i.id !== id))
  }

  const startEditGallery = (item: GalleryItemType) => {
    setEditingGalleryId(item.id as string)
    setGalleryTitle(item.title as string)
    setGalleryCategory(item.category as string)
    setGalleryDate((item.date as string) || "")
    setGalleryPreview((item.image_url as string) || null)
    setTags((item.tags as string[]) || [])
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAnnounceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAnnounceStatus("posting")

    try {
      let res
      if (editingAnnounceId) {
        res = await fetch("/api/admin/announcements", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingAnnounceId,
            title: announceTitle,
            category: announceCategory,
            content: announceContent,
          }),
        })
      } else {
        res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: announceTitle,
            category: announceCategory,
            content: announceContent,
          }),
        })
      }

      if (!res.ok) throw new Error("Failed to save announcement")

      const newItem = await res.json()

      if (editingAnnounceId) {
        setAnnouncements(
          announcements.map((a) => (a.id === editingAnnounceId ? newItem : a))
        )
      } else {
        setAnnouncements([newItem, ...announcements])
      }

      setAnnounceStatus("success")
      setAnnounceTitle("")
      setAnnounceContent("")
      setEditingAnnounceId(null)
      setTimeout(() => setAnnounceStatus("idle"), 3000)
    } catch (err) {
      console.error(err)
      setAnnounceStatus("error")
      setTimeout(() => setAnnounceStatus("idle"), 3000)
    }
  }

  const handleDeleteAnnounce = async (id: string) => {
    if (!confirm("Delete this announcement?")) return
    const res = await fetch(`/api/admin/announcements?id=${id}`, {
      method: "DELETE",
    })
    if (res.ok) setAnnouncements(announcements.filter((a) => a.id !== id))
  }

  const startEditAnnounce = (item: AnnouncementType) => {
    setEditingAnnounceId(item.id)
    setAnnounceTitle(item.title)
    setAnnounceCategory(item.category)
    setAnnounceContent(item.content)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="rounded border border-destructive bg-destructive/10 p-4 font-mono text-destructive">
        Error loading registrations: {error}
      </div>
    )
  }

  return (
    <div className="relative container mx-auto max-w-6xl space-y-8 overflow-x-hidden px-4 py-12 sm:px-6">
      {/* Decorative background element mimicking cyberpunk theme */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text font-heading text-3xl font-bold text-transparent">
            ADMIN DASHBOARD
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            SYSTEM MANAGEMENT CONSOLE
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={isExporting}
          >
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="registrations" className="w-full">
        <TabsList className="mb-8 grid h-12 w-full max-w-[600px] grid-cols-3 rounded-xl border border-border/50 bg-card/50 p-1 shadow-sm backdrop-blur-sm">
          <TabsTrigger
            value="registrations"
            className="rounded-lg font-heading text-xs tracking-wider transition-all data-[state=active]:bg-primary/20 data-[state=active]:text-primary sm:text-sm"
          >
            Registrations
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="rounded-lg font-heading text-xs tracking-wider transition-all data-[state=active]:bg-primary/20 data-[state=active]:text-primary sm:text-sm"
          >
            Gallery
          </TabsTrigger>
          <TabsTrigger
            value="announce"
            className="rounded-lg font-heading text-xs tracking-wider transition-all data-[state=active]:bg-primary/20 data-[state=active]:text-primary sm:text-sm"
          >
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="space-y-4 outline-none">
          <div className="mb-6 flex flex-wrap gap-4">
            <Button
              onClick={downloadAllPdf}
              variant="default"
              className="shadow-[0_0_15px_rgba(var(--primary),0.5)]"
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Button
              onClick={downloadAllExcel}
              variant="default"
              className="shadow-[0_0_15px_rgba(var(--primary),0.5)]"
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export Excel"}
            </Button>
            <Button
              onClick={exportAsImage}
              variant="default"
              className="shadow-[0_0_15px_rgba(var(--primary),0.5)]"
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export Image"}
            </Button>
            <div className="ml-auto">
              <div className="rounded-lg border border-border/50 bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <p className="font-mono text-sm text-muted-foreground">
                  TOTAL:{" "}
                  <span className="font-bold text-foreground">
                    {registrations.length}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            id="dashboard-container"
            className="grid gap-8 rounded-2xl bg-background p-4 pb-12 sm:p-0"
          >
            {registrations.map((reg) => (
              <div
                key={reg.id}
                id={`team-card-${reg.team_code}`}
                className="team-card group relative rounded-2xl border border-border/50 bg-card/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:border-primary/50"
              >
                {/* Subtle glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-heading text-2xl font-bold tracking-wide">
                        {reg.team_name}
                      </h2>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-xs font-bold text-primary">
                        {reg.team_code}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                      {new Date(reg.created_at).toLocaleString()}
                    </p>
                    {reg.department && (
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {reg.department}
                      </p>
                    )}
                  </div>
                  <div className="relative z-10 flex gap-2">
                    <Button
                      onClick={() => downloadTeamPdf(reg)}
                      variant="secondary"
                      size="sm"
                      className="border border-border bg-secondary/50 hover:bg-secondary"
                      disabled={isExporting}
                    >
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => downloadTeamExcel(reg)}
                      variant="secondary"
                      size="sm"
                      className="border border-border bg-secondary/50 hover:bg-secondary"
                      disabled={isExporting}
                    >
                      Excel
                    </Button>
                  </div>
                </div>

                <div className="relative z-10 grid gap-4 sm:grid-cols-3">
                  {reg.members.map((member: Member, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 rounded-xl border border-border/40 bg-background/50 p-5 transition-colors hover:bg-background/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {member.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={member.photo}
                              alt={member.fullName}
                              className="h-16 w-16 rounded-full border-2 border-primary/30 object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border/50 bg-muted">
                              <span className="text-center font-mono text-[10px] text-muted-foreground uppercase">
                                No
                                <br />
                                Img
                              </span>
                            </div>
                          )}
                          <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background">
                            <span className="font-mono text-[10px] font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-heading text-base leading-tight font-bold">
                            {member.fullName}
                          </p>
                          <p className="mt-1 font-mono text-xs tracking-wider text-muted-foreground">
                            {member.studentId}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 space-y-2 border-t border-border/30 pt-4">
                        <div className="flex items-center justify-between gap-2 font-mono text-xs">
                          <span className="flex-shrink-0 text-muted-foreground uppercase">
                            Email
                          </span>
                          <span
                            className="truncate text-right"
                            title={member.gmail}
                          >
                            {member.gmail}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 font-mono text-xs">
                          <span className="flex-shrink-0 text-muted-foreground uppercase">
                            Phone
                          </span>
                          <span className="text-right">{member.mobile}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 font-mono text-xs">
                          <span className="flex-shrink-0 text-muted-foreground uppercase">
                            Dept/Batch
                          </span>
                          <span className="text-right">
                            {member.section}-{member.batch}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 font-mono text-xs">
                          <span className="flex-shrink-0 text-muted-foreground uppercase">
                            Size
                          </span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-right font-bold text-primary">
                            {member.tshirt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {registrations.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-border/50 bg-card/30 p-12 text-center">
                <p className="font-mono text-lg text-muted-foreground">
                  SYSTEM OFFLINE: NO TEAMS FOUND
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6 outline-none">
          <Card className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-lg backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            <CardHeader>
              <CardTitle className="font-heading text-2xl tracking-wide">
                {editingGalleryId ? "Edit Gallery Image" : "Upload to Gallery"}
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Add new visual assets to the main gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleGallerySubmit}
                className="relative z-10 space-y-6"
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="gallery-title"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Image Title
                  </Label>
                  <Input
                    id="gallery-title"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="e.g. Hackathon Winners 2026"
                    className="h-10 border-border/50 bg-background/50 focus-visible:border-primary"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="gallery-category"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Category
                  </Label>
                  <div className="relative mb-3">
                    <select
                      id="gallery-category"
                      value={galleryCategory}
                      onChange={(e) => setGalleryCategory(e.target.value)}
                      className="flex h-10 w-full appearance-none items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="event">Event</option>
                      <option value="award">Awards</option>
                      <option value="round-1">Round-1</option>
                      <option value="round-2">Round-2</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="gallery-date"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Date (Optional)
                  </Label>
                  <Input
                    id="gallery-date"
                    type="date"
                    value={galleryDate}
                    onChange={(e) => setGalleryDate(e.target.value)}
                    className="h-10 border-border/50 bg-background/50 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="gallery-tags"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Tags (Press Enter to add)
                  </Label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded bg-primary/20 px-2 py-1 font-mono text-xs text-primary"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-primary hover:text-destructive"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    id="gallery-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. hackathon"
                    className="h-10 border-border/50 bg-background/50 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="image-file"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    File
                  </Label>
                  <div className="flex w-full items-center gap-4">
                    <label
                      htmlFor="image-file"
                      className="group flex h-48 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-background/30 transition-colors hover:border-primary/50 hover:bg-background/50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="mb-4 h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 font-mono text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="font-mono text-xs text-muted-foreground/70">
                          PNG, JPG, WEBP (MAX. 1MB)
                        </p>
                      </div>
                      <input
                        id="image-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        required={!editingGalleryId}
                        onChange={handleFileChange}
                      />
                    </label>
                    {galleryPreview && (
                      <div className="h-48 w-48 flex-shrink-0 overflow-hidden rounded-xl border border-border/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={galleryPreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={galleryUploadStatus === "uploading"}
                    className="h-10 w-full px-8 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all sm:w-auto"
                  >
                    {galleryUploadStatus === "uploading"
                      ? "Saving..."
                      : galleryUploadStatus === "success"
                        ? "Saved!"
                        : editingGalleryId
                          ? "Update Image"
                          : "Upload Image"}
                  </Button>
                  {editingGalleryId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingGalleryId(null)
                        setGalleryTitle("")
                        setTags([])
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Gallery Items (CRUD Read/Delete) */}
          <div className="mt-12 w-full space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm sm:flex-row sm:items-center">
              <h3 className="font-heading text-lg font-bold">Manage Gallery</h3>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "general",
                    "event",
                    "award",
                    "round-1",
                    "round-2",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setGalleryFilter(cat)}
                      className={`rounded-full px-3 py-1.5 font-mono text-xs font-bold capitalize transition-all ${
                        galleryFilter === cat
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border/50 bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex rounded-lg border border-border/50 bg-background p-1">
                  <button
                    onClick={() => setGalleryViewMode("list")}
                    className={`rounded-md p-1.5 transition-colors ${galleryViewMode === "list" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <IconList size={18} />
                  </button>
                  <button
                    onClick={() => setGalleryViewMode("grid")}
                    className={`rounded-md p-1.5 transition-colors ${galleryViewMode === "grid" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <IconGridDots size={18} />
                  </button>
                </div>
              </div>
            </div>

            {galleryViewMode === "grid" ? (
              <motion.div
                layout
                className="min-h-[400px] columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4"
              >
                <AnimatePresence>
                  {galleryItems
                    .filter(
                      (item) =>
                        galleryFilter === "all" ||
                        item.category === galleryFilter
                    )
                    .map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 200,
                        }}
                        key={item.id as string}
                        className="group relative break-inside-avoid overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
                      >
                        <div className="relative w-full overflow-hidden bg-muted">
                          {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image_url as string}
                              alt={item.title as string}
                              className="h-auto min-h-[150px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-40 w-full items-center justify-center">
                              <span className="font-mono text-[10px] text-muted-foreground">
                                No Img
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => startEditGallery(item)}
                              className="rounded-full shadow-lg"
                            >
                              <IconEdit size={16} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                handleDeleteGallery(item.id as string)
                              }
                              className="rounded-full shadow-lg"
                            >
                              <IconTrash size={16} />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="mb-2 text-sm leading-tight font-bold">
                            {item.title as string}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary capitalize">
                              {item.category as string}
                            </span>
                            {item.date && (
                              <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
                                {item.date as string}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div layout className="min-h-[400px] space-y-3">
                <AnimatePresence>
                  {galleryItems
                    .filter(
                      (item) =>
                        galleryFilter === "all" ||
                        item.category === galleryFilter
                    )
                    .map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 200,
                        }}
                        key={item.id as string}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card"
                      >
                        <div className="flex items-center gap-4">
                          {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image_url as string}
                              alt={item.title as string}
                              className="h-16 w-16 rounded-lg border border-border/50 object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border/50 bg-muted">
                              <span className="font-mono text-[10px] text-muted-foreground">
                                No Img
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold">
                              {item.title as string}
                            </h4>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground capitalize">
                                {item.category as string}
                              </span>
                              {(item.tags as string[])?.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {item.date && (
                                <span className="rounded border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-xs text-emerald-400">
                                  {item.date as string}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditGallery(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteGallery(item.id as string)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="announce" className="space-y-4 outline-none">
          <Card className="relative max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-lg backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-accent/5 to-transparent opacity-50" />
            <CardHeader>
              <CardTitle className="font-heading text-2xl tracking-wide">
                {editingAnnounceId
                  ? "Edit Announcement"
                  : "Create Announcement"}
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Broadcast a new notice to all members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleAnnounceSubmit}
                className="relative z-10 space-y-6"
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="announce-title"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Title
                  </Label>
                  <Input
                    id="announce-title"
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    placeholder="e.g. Urgent: System Maintenance"
                    className="h-10 border-border/50 bg-background/50 focus-visible:border-primary"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="announce-type"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Category
                  </Label>
                  <div className="relative">
                    <select
                      id="announce-type"
                      value={announceCategory}
                      onChange={(e) => setAnnounceCategory(e.target.value)}
                      className="flex h-10 w-full appearance-none items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="general">General Updates</option>
                      <option value="event">Upcoming Event</option>
                      <option value="urgent">Urgent Notice</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="announce-content"
                    className="font-mono text-xs text-muted-foreground uppercase"
                  >
                    Content
                  </Label>
                  <textarea
                    id="announce-content"
                    value={announceContent}
                    onChange={(e) => setAnnounceContent(e.target.value)}
                    rows={6}
                    placeholder="Type your announcement here..."
                    className="flex w-full resize-y rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={announceStatus === "posting"}
                    className="h-10 w-full px-8 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all sm:w-auto"
                  >
                    {announceStatus === "posting"
                      ? "Broadcasting..."
                      : announceStatus === "success"
                        ? "Broadcast Sent!"
                        : editingAnnounceId
                          ? "Update Notice"
                          : "Broadcast Notice"}
                  </Button>
                  {editingAnnounceId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingAnnounceId(null)
                        setAnnounceTitle("")
                        setAnnounceContent("")
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Announcements (CRUD Read/Delete) */}
          <div className="mt-8 max-w-2xl space-y-4">
            <h3 className="font-heading text-lg font-bold">
              Manage Announcements
            </h3>
            {announcements.map((announce) => (
              <div
                key={announce.id as string}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
              >
                <div className="mr-4 flex-1">
                  <h4 className="font-bold">{announce.title as string}</h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {announce.content as string}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground capitalize">
                      {announce.category as string}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(
                        announce.created_at as string
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditAnnounce(announce)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAnnounce(announce.id as string)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
