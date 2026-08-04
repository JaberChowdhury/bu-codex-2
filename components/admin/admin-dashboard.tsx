"use client"

import * as React from "react"
import html2canvas from "html2canvas-pro"
import { Button } from "@/components/ui/button"

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
          <p className="text-muted-foreground font-mono mt-1 text-sm">TOTAL REGISTRATIONS: {registrations.length}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={downloadAllPdf} variant="default" className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button onClick={downloadAllExcel} variant="default" className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>
          <Button onClick={exportAsImage} variant="default" className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export Image"}
          </Button>
          <Button onClick={handleLogout} variant="outline" disabled={isExporting}>Logout</Button>
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
    </div>
  )
}
