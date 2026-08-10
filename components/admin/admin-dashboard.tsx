"use client"

import * as React from "react"
import html2canvas from "html2canvas-pro"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export function AdminDashboard({ registrations, error }: { registrations: Registration[], error?: string }) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [galleryUploadStatus, setGalleryUploadStatus] = React.useState<"idle" | "uploading" | "success" | "error">("idle")
  const [announceStatus, setAnnounceStatus] = React.useState<"idle" | "posting" | "success" | "error">("idle")

  const [galleryTitle, setGalleryTitle] = React.useState("")
  const [galleryCategory, setGalleryCategory] = React.useState("general")
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState("")
  const [announceTitle, setAnnounceTitle] = React.useState("")
  const [announceCategory, setAnnounceCategory] = React.useState("general")
  const [announceContent, setAnnounceContent] = React.useState("")
  const [editingGalleryId, setEditingGalleryId] = React.useState<string | null>(null)
  const [editingAnnounceId, setEditingAnnounceId] = React.useState<string | null>(null)
  const [galleryItems, setGalleryItems] = React.useState<Record<string, unknown>[]>([])
  const [announcements, setAnnouncements] = React.useState<Record<string, unknown>[]>([])

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  React.useEffect(() => {
    fetch("/api/admin/gallery").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setGalleryItems(data)
    }).catch(console.error)
    
    fetch("/api/admin/announcements").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAnnouncements(data)
    }).catch(console.error)
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
    triggerDownload(`/api/admin/export?format=xlsx&team=${encodeURIComponent(reg.team_code)}`)
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
      const file = (form.elements.namedItem("image-file") as HTMLInputElement).files?.[0]

      if (!galleryTitle || (!file && !editingGalleryId)) {
        throw new Error("Missing title or file")
      }

      let res;
      const formData = new FormData()
      formData.append("title", galleryTitle)
      formData.append("category", galleryCategory)
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
        setGalleryItems(galleryItems.map(i => i.id === editingGalleryId ? newItem : i))
      } else {
        setGalleryItems([newItem, ...galleryItems])
      }
      
      setGalleryUploadStatus("success")
      form.reset()
      setGalleryTitle("")
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
    if (res.ok) setGalleryItems(galleryItems.filter(i => i.id !== id))
  }

  const startEditGallery = (item: Record<string, string | string[]>) => {
    setEditingGalleryId(item.id as string)
    setGalleryTitle(item.title as string)
    setGalleryCategory(item.category as string)
    setTags((item.tags as string[]) || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnnounceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAnnounceStatus("posting")
    
    try {
      let res;
      if (editingAnnounceId) {
        res = await fetch("/api/admin/announcements", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAnnounceId, title: announceTitle, category: announceCategory, content: announceContent })
        })
      } else {
        res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: announceTitle, category: announceCategory, content: announceContent })
        })
      }

      if (!res.ok) throw new Error("Failed to save announcement")
      
      const newItem = await res.json()
      
      if (editingAnnounceId) {
        setAnnouncements(announcements.map(a => a.id === editingAnnounceId ? newItem : a))
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
    const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" })
    if (res.ok) setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const startEditAnnounce = (item: Record<string, string>) => {
    setEditingAnnounceId(item.id)
    setAnnounceTitle(item.title)
    setAnnounceCategory(item.category)
    setAnnounceContent(item.content)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }



  if (error) {
    return (
      <div className="rounded border border-destructive bg-destructive/10 p-4 text-destructive font-mono">
        Error loading registrations: {error}
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* Decorative background element mimicking cyberpunk theme */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">ADMIN DASHBOARD</h1>
          <p className="text-muted-foreground font-mono mt-1 text-sm">SYSTEM MANAGEMENT CONSOLE</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleLogout} variant="outline" disabled={isExporting}>Logout</Button>
        </div>
      </div>
      
      <Tabs defaultValue="registrations" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 max-w-[600px] h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-1 shadow-sm">
          <TabsTrigger value="registrations" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-heading tracking-wider text-xs sm:text-sm transition-all">Registrations</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-heading tracking-wider text-xs sm:text-sm transition-all">Gallery</TabsTrigger>
          <TabsTrigger value="announce" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-heading tracking-wider text-xs sm:text-sm transition-all">Announcements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registrations" className="space-y-4 outline-none">
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={downloadAllPdf} variant="default" className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Button onClick={downloadAllExcel} variant="default" className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export Excel"}
            </Button>
            <Button onClick={exportAsImage} variant="default" className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export Image"}
            </Button>
            <div className="ml-auto">
              <div className="px-4 py-2 rounded-lg bg-card/80 border border-border/50 backdrop-blur-sm shadow-sm">
                <p className="text-sm font-mono text-muted-foreground">TOTAL: <span className="text-foreground font-bold">{registrations.length}</span></p>
              </div>
            </div>
          </div>
          
          <div id="dashboard-container" className="grid gap-8 pb-12 bg-background p-4 sm:p-0 rounded-2xl">
            {registrations.map((reg) => (
              <div 
                key={reg.id} 
                id={`team-card-${reg.team_code}`}
                className="team-card group relative border border-border/50 bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transition-all hover:border-primary/50"
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold font-heading tracking-wide">{reg.team_name}</h2>
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold border border-primary/20">
                        {reg.team_code}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-2 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      {new Date(reg.created_at).toLocaleString()}
                    </p>
                    {reg.department && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">{reg.department}</p>
                    )}
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <Button
                      onClick={() => downloadTeamPdf(reg)}
                      variant="secondary"
                      size="sm"
                      className="bg-secondary/50 hover:bg-secondary border border-border"
                      disabled={isExporting}
                    >
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => downloadTeamExcel(reg)}
                      variant="secondary"
                      size="sm"
                      className="bg-secondary/50 hover:bg-secondary border border-border"
                      disabled={isExporting}
                    >
                      Excel
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 relative z-10">
                  {reg.members.map((member: Member, index: number) => (
                    <div key={index} className="flex flex-col gap-4 p-5 border border-border/40 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {member.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={member.photo} 
                              alt={member.fullName} 
                              className="w-16 h-16 object-cover rounded-full border-2 border-primary/30"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-full border-2 border-border/50">
                              <span className="text-[10px] text-muted-foreground font-mono text-center uppercase">No<br/>Img</span>
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border border-border">
                            <span className="text-[10px] font-bold font-mono text-primary">{index + 1}</span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base leading-tight font-heading truncate">{member.fullName}</p>
                          <p className="font-mono text-xs text-muted-foreground mt-1 tracking-wider">{member.studentId}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-2 pt-4 border-t border-border/30">
                        <div className="flex justify-between items-center text-xs font-mono gap-2">
                          <span className="text-muted-foreground uppercase flex-shrink-0">Email</span>
                          <span className="truncate text-right" title={member.gmail}>{member.gmail}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono gap-2">
                          <span className="text-muted-foreground uppercase flex-shrink-0">Phone</span>
                          <span className="text-right">{member.mobile}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono gap-2">
                          <span className="text-muted-foreground uppercase flex-shrink-0">Dept/Batch</span>
                          <span className="text-right">{member.section}-{member.batch}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono gap-2">
                          <span className="text-muted-foreground uppercase flex-shrink-0">Size</span>
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-right">{member.tshirt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {registrations.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/30">
                <p className="text-muted-foreground font-mono text-lg">SYSTEM OFFLINE: NO TEAMS FOUND</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4 outline-none">
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl relative overflow-hidden max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-2xl font-heading tracking-wide">
                {editingGalleryId ? "Edit Gallery Image" : "Upload to Gallery"}
              </CardTitle>
              <CardDescription className="font-mono text-xs">Add new visual assets to the main gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGallerySubmit} className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <Label htmlFor="gallery-title" className="text-muted-foreground font-mono text-xs uppercase">Image Title</Label>
                  <Input 
                    id="gallery-title" 
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="e.g. Hackathon Winners 2026" 
                    className="bg-background/50 h-10 border-border/50 focus-visible:border-primary" 
                    required 
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gallery-category" className="text-muted-foreground font-mono text-xs uppercase">Category</Label>
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
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gallery-tags" className="text-muted-foreground font-mono text-xs uppercase">Tags (Press Enter to add)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded bg-primary/20 px-2 py-1 font-mono text-xs text-primary">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-primary hover:text-destructive">&times;</button>
                      </span>
                    ))}
                  </div>
                  <Input
                    id="gallery-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="e.g. hackathon"
                    className="bg-background/50 h-10 border-border/50 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="image-file" className="text-muted-foreground font-mono text-xs uppercase">File</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-border/50 border-dashed rounded-xl cursor-pointer bg-background/30 hover:bg-background/50 transition-colors hover:border-primary/50 group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-muted-foreground font-mono"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground/70 font-mono">PNG, JPG, WEBP (MAX. 5MB)</p>
                      </div>
                      <input id="image-file" type="file" className="hidden" accept="image/*" required={!editingGalleryId} />
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={galleryUploadStatus === "uploading"} 
                    className="w-full sm:w-auto shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all h-10 px-8"
                  >
                    {galleryUploadStatus === "uploading" ? "Saving..." : galleryUploadStatus === "success" ? "Saved!" : editingGalleryId ? "Update Image" : "Upload Image"}
                  </Button>
                  {editingGalleryId && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingGalleryId(null)
                      setGalleryTitle("")
                      setTags([])
                    }}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Gallery Items (CRUD Read/Delete) */}
          <div className="mt-8 space-y-4 max-w-2xl">
            <h3 className="font-heading text-lg font-bold">Manage Gallery</h3>
            {galleryItems.map((item) => (
              <div key={item.id as string} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                <div className="flex gap-4 items-center">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url as string} alt={item.title as string} className="w-16 h-16 object-cover rounded-lg border border-border/50" />
                  ) : (
                    <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-lg border border-border/50">
                      <span className="text-[10px] text-muted-foreground font-mono">No Img</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{item.title as string}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground capitalize">{item.category as string}</span>
                      {(item.tags as string[])?.map((tag: string) => (
                        <span key={tag} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditGallery(item as Record<string, string | string[]>)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteGallery(item.id as string)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announce" className="space-y-4 outline-none">
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl relative overflow-hidden max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-bl from-accent/5 to-transparent opacity-50 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-2xl font-heading tracking-wide">
                {editingAnnounceId ? "Edit Announcement" : "Create Announcement"}
              </CardTitle>
              <CardDescription className="font-mono text-xs">Broadcast a new notice to all members</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnnounceSubmit} className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <Label htmlFor="announce-title" className="text-muted-foreground font-mono text-xs uppercase">Title</Label>
                  <Input 
                    id="announce-title" 
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    placeholder="e.g. Urgent: System Maintenance" 
                    className="bg-background/50 h-10 border-border/50 focus-visible:border-primary" 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="announce-type" className="text-muted-foreground font-mono text-xs uppercase">Category</Label>
                  <div className="relative">
                    <select 
                      id="announce-type" 
                      value={announceCategory}
                      onChange={(e) => setAnnounceCategory(e.target.value)}
                      className="flex h-10 w-full appearance-none items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="general">General Updates</option>
                      <option value="event">Upcoming Event</option>
                      <option value="urgent">Urgent Notice</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="announce-content" className="text-muted-foreground font-mono text-xs uppercase">Content</Label>
                  <textarea 
                    id="announce-content" 
                    value={announceContent}
                    onChange={(e) => setAnnounceContent(e.target.value)}
                    rows={6}
                    placeholder="Type your announcement here..." 
                    className="flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    required 
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={announceStatus === "posting"} 
                    className="w-full sm:w-auto shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all h-10 px-8"
                  >
                    {announceStatus === "posting" ? "Broadcasting..." : announceStatus === "success" ? "Broadcast Sent!" : editingAnnounceId ? "Update Notice" : "Broadcast Notice"}
                  </Button>
                  {editingAnnounceId && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingAnnounceId(null)
                      setAnnounceTitle("")
                      setAnnounceContent("")
                    }}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Announcements (CRUD Read/Delete) */}
          <div className="mt-8 space-y-4 max-w-2xl">
            <h3 className="font-heading text-lg font-bold">Manage Announcements</h3>
            {announcements.map((announce) => (
              <div key={announce.id as string} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                <div className="flex-1 mr-4">
                  <h4 className="font-bold">{announce.title as string}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announce.content as string}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground capitalize">{announce.category as string}</span>
                    <span className="font-mono text-xs text-muted-foreground">{new Date(announce.created_at as string).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditAnnounce(announce as Record<string, string>)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteAnnounce(announce.id as string)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
