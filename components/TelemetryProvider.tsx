"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import useUltimateCollector from "@/lib/data_watcher"

function TelemetryLogic() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 1. Call the hook at the TOP LEVEL
  const payload = useUltimateCollector()

  useEffect(() => {
    const sendData = async () => {
      // 2. Only send if the hook has actually gathered the data
      if (!payload || !payload.userData) return

      try {
        await fetch("/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } catch (error) {
        console.error("Telemetry failed:", error)
      }
    }

    sendData()
    // 3. This fires whenever the route OR the gathered data changes
  }, [pathname, searchParams, payload])

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
