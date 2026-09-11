"use client"

import { useEffect, useRef, Suspense } from "react"
import useUltimateCollector from "@/lib/data_watcher"

function TelemetryLogic() {
  const { userData } = useUltimateCollector()
  const hasSent = useRef(false)

  useEffect(() => {
    if (!userData || hasSent.current) return

    const sendData = async () => {
      try {
        await fetch("/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userData }),
        })
        hasSent.current = true
      } catch (error) {
        console.error("Telemetry failed:", error)
      }
    }

    sendData()
  }, [userData])

  return null
}
export default function TelemetryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={null}>
        <TelemetryLogic />
      </Suspense>
      {children}
    </>
  )
}
