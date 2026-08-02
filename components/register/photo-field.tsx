"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type PhotoFieldProps = {
  id: string
  value: string
  onChange: (dataUrl: string) => void
  className?: string
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("read failed"))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("decode failed"))
      img.onload = () => {
        const MAX_W = 200
        const scale = Math.min(1, MAX_W / img.width)
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("canvas unsupported"))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.72))
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

function PhotoField({ id, value, onChange, className }: PhotoFieldProps) {
  const [busy, setBusy] = React.useState(false)

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) return
    setBusy(true)
    try {
      const dataUrl = await resizeImage(file)
      onChange(dataUrl)
    } catch {
      // ignore malformed images
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        photo
        <span className="text-accent"> *</span>
      </Label>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-12 w-12 rounded-md border border-border object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-border font-mono text-xs text-muted-foreground">
            —
          </div>
        )}
        <div className="space-y-1">
          <Label
            htmlFor={id}
            className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-input bg-transparent px-2.5 font-mono text-xs transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {busy ? "reading…" : value ? "replace photo" : "attach photo"}
          </Label>
          <p className="font-mono text-xs text-muted-foreground tnum">
            {value ? "photo: attached" : "photo: none"}
          </p>
        </div>
      </div>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  )
}

export { PhotoField }
