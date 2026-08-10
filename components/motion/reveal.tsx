"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function Reveal({
  children,
  className,
  asChild,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  delay?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      el.classList.add("is-visible")
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible")
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string
    }>
    return React.cloneElement(child, {
      className: cn("reveal", child.props.className),
    })
  }

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  )
}
