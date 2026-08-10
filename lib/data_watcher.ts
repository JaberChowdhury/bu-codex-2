/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react"

export interface UltimateUserData {
  userId: string // NEW: The persistent fingerprint ID
  storage: {
    localStorage: string[]
    sessionStorage: string[]
    cookies: string
  }
  hardware: {
    cores: number
    memory: number | string
    maxTouchPoints: number
    platform: string
    gpu: { vendor: string; renderer: string } | string
    battery?: { level: number; charging: boolean }
    mediaInputCounts?: { audio: number; video: number }
  }
  software: {
    userAgent: string
    pdfViewer: boolean
    webdriver: boolean
    languages: readonly string[]
    osDetails?: Record<string, string>
  }
  network: {
    effectiveType: string
    downlink: number
    rtt: number
    saveData: boolean
    online: boolean
  }
  display: {
    screenRes: string
    availableRes: string
    viewport: string
    colorDepth: number
    pixelRatio: number
    orientation: string
    hdrSupport: boolean
    darkMode: boolean
  }
  performance: {
    memoryUsage?: { limit: number; total: number; used: number }
    navigationType: string
  }
  context: {
    referrer: string
    url: string
    timezone: string
    locale: string
    date: string
    location?: { lat: number; lng: number; accuracy: number; error?: string }
  }
}

// NEW: Helper function to generate a secure SHA-256 hash
async function generateFingerprintHash(components: string) {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(components)
    // SubtleCrypto is only available in secure contexts (HTTPS or localhost)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } catch {
    // Fallback hashing mechanism if Crypto API is unavailable
    let hash = 0
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

const useUltimateCollector = () => {
  const [userData, setUserData] = useState<UltimateUserData | null>(null)

  const getGPUInfo = () => {
    try {
      const canvas = document.createElement("canvas")
      const gl =
        canvas.getContext("webgl") ||
        (canvas.getContext("experimental-webgl") as any)
      if (!gl) return "Not Supported"
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      return debugInfo
        ? {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          }
        : "Restricted"
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return "Error"
    }
  }

  const collect = useCallback(async () => {
    const nav = navigator as any
    const perf = (performance as any).memory

    // 1. High-Entropy OS & Browser Data
    let osDetails = {}
    if (nav.userAgentData && nav.userAgentData.getHighEntropyValues) {
      try {
        osDetails = await nav.userAgentData.getHighEntropyValues([
          "architecture",
          "model",
          "platformVersion",
          "bitness",
        ])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
    }

    // 2. Battery API
    let batteryData
    if ("getBattery" in nav) {
      try {
        const battery = await nav.getBattery()
        batteryData = {
          level: battery.level * 100,
          charging: battery.charging,
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
    }

    // 3. Media Devices
    const mediaInputCounts = { audio: 0, video: 0 }
    if (nav.mediaDevices && nav.mediaDevices.enumerateDevices) {
      try {
        const devices = await nav.mediaDevices.enumerateDevices()
        mediaInputCounts.audio = devices.filter(
          (d: any) => d.kind === "audioinput"
        ).length
        mediaInputCounts.video = devices.filter(
          (d: any) => d.kind === "videoinput"
        ).length
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
    }

    // 4. Geolocation
    // Removed `navigator.geolocation` to prevent the intrusive browser permission prompt.
    // Rely on server-side IP geolocation (via Vercel headers or external APIs) instead.
    const locationData = {
      error: "Disabled to prevent UI prompt",
      lat: 0,
      lng: 0,
      accuracy: 0,
    }

    // 5. Fetch GPU info once to reuse
    const gpuData = getGPUInfo()

    // 6. Generate the unique fingerprint ID based on immutable device traits
    const fingerprintString = [
      nav.userAgent,
      nav.hardwareConcurrency || 0,
      nav.deviceMemory || "unknown",
      nav.platform,
      window.screen.width,
      window.screen.height,
      window.screen.colorDepth,
      window.devicePixelRatio,
      typeof gpuData === "string"
        ? gpuData
        : `${gpuData.vendor}-${gpuData.renderer}`,
      (nav.languages || []).join(","),
    ].join("|||")

    const fingerprintId = await generateFingerprintHash(fingerprintString)

    // 7. Construct Payload
    const data: UltimateUserData = {
      userId: fingerprintId, // Attach generated ID here
      storage: {
        localStorage: Object.keys(window.localStorage || {}),
        sessionStorage: Object.keys(window.sessionStorage || {}),
        cookies: document.cookie,
      },
      hardware: {
        cores: nav.hardwareConcurrency || 0,
        memory: nav.deviceMemory || "unknown",
        maxTouchPoints: nav.maxTouchPoints || 0,
        platform: nav.platform,
        gpu: gpuData,
        battery: batteryData,
        mediaInputCounts,
      },
      software: {
        userAgent: nav.userAgent,
        pdfViewer: nav.pdfViewerEnabled,
        webdriver: nav.webdriver,
        languages: nav.languages,
        osDetails,
      },
      network: {
        effectiveType: nav.connection?.effectiveType || "unknown",
        downlink: nav.connection?.downlink || 0,
        rtt: nav.connection?.rtt || 0,
        saveData: nav.connection?.saveData || false,
        online: nav.onLine,
      },
      display: {
        screenRes: `${window.screen.width}x${window.screen.height}`,
        availableRes: `${window.screen.availWidth}x${window.screen.availHeight}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type || "unknown",
        hdrSupport: window.matchMedia("(dynamic-range: high)").matches,
        darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
      },
      performance: {
        memoryUsage: perf
          ? {
              limit: Math.round(perf.jsHeapSizeLimit / 1048576),
              total: Math.round(perf.totalJSHeapSize / 1048576),
              used: Math.round(perf.usedJSHeapSize / 1048576),
            }
          : undefined,
        navigationType:
          (performance.getEntriesByType("navigation")[0] as any)?.type ||
          "unknown",
      },
      context: {
        referrer: document.referrer || "direct",
        url: window.location.href,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        date: new Date().toISOString(),
        location: locationData,
      },
    }

    setUserData(data)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    collect()
  }, [collect])

  return { userData, refresh: collect }
}

export default useUltimateCollector
