"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type PhotoFieldProps = {
  id: string
  value: File | null
  onChange: (file: File | null) => void
  error?: string
  className?: string
}

function PhotoField({ id, value, onChange, error, className }: PhotoFieldProps) {
  const [preview, setPreview] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(value)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!file.type.startsWith("image/")) return
    onChange(file)
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
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
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
            {value ? "replace photo" : "attach photo"}
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
      {error ? (
        <p role="alert" className="font-mono text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { PhotoField }
