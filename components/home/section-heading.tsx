import type { ReactNode } from "react"

export function SectionHeading({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}
