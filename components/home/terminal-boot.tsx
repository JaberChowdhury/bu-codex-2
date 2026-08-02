"use client"

import * as React from "react"

import { useTypedLine } from "@/components/motion/use-typed-line"

const LINES = [
  "> bu codex --run round_02",
  "[ OK ] problemset.load ........ 07",
  "[ OK ] slots.allocate .......... 020",
  "[ OK ] judge.spinup ............ toph.co",
]

function BootLine({
  text,
  enabled,
  onComplete,
}: {
  text: string
  enabled: boolean
  onComplete: () => void
}) {
  const { typed, complete } = useTypedLine(text, {
    enabled,
    delay: 60,
    speed: 16,
  })
  const doneRef = React.useRef(false)

  React.useEffect(() => {
    if (complete && !doneRef.current) {
      doneRef.current = true
      onComplete()
    }
  }, [complete, onComplete])

  return (
    <p className="whitespace-pre font-mono text-xs text-muted-foreground sm:text-sm">
      <span className={complete ? "text-foreground" : ""}>{typed}</span>
      {!complete && <span className="terminal-caret" />}
    </p>
  )
}

export function TerminalBoot({
  onDone,
}: {
  onDone?: () => void
}) {
  const [visible, setVisible] = React.useState(1)
  const doneRef = React.useRef(false)

  const handleComplete = React.useCallback(() => {
    setVisible((v) => Math.min(v + 1, LINES.length))
  }, [])

  React.useEffect(() => {
    if (visible >= LINES.length && !doneRef.current) {
      doneRef.current = true
      const id = window.setTimeout(() => onDone?.(), 350)
      return () => window.clearTimeout(id)
    }
  }, [visible, onDone])

  return (
    <div className="space-y-1.5">
      {LINES.slice(0, visible).map((line, i) => (
        <BootLine
          key={line}
          text={line}
          enabled={i === visible - 1}
          onComplete={handleComplete}
        />
      ))}
    </div>
  )
}
