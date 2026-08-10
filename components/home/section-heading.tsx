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
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}
