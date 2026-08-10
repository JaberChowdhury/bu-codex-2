import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL_Telemetry ||
  "https://sdgcubvqhjysbzzoxuka.supabase.co"
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_Telemetry ||
  "sb_publishable_4kKfCUojSHWUd01KwM3LDQ_3Wsb0l-D"
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const userData = payload?.userData

    if (!userData) {
      return NextResponse.json({ error: "No user data found" }, { status: 400 })
    }

    // =========================================================================
    // 🛑 GLOBAL LOCALHOST CHECK (EASY DEBUGGING)
    // Comment out this ENTIRE BLOCK to test and push data locally!
    // =========================================================================
    const host = request.headers.get("host") || ""
    const origin = request.headers.get("origin") || ""
    const payloadUrl = userData.context?.url || ""

    const isLocalhost =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      origin.includes("localhost") ||
      payloadUrl.includes("localhost") ||
      payloadUrl.includes("127.0.0.1")

    if (isLocalhost) {
      console.log("Telemetry skipped: Localhost environment detected.")
      return NextResponse.json({ success: true, note: "Skipped on localhost" })
    }
    // =========================================================================

    // Safely extract GPU info
    const isGpuObject =
      typeof userData.hardware?.gpu === "object" &&
      userData.hardware?.gpu !== null

    // Push EVERY SINGLE FIELD into its own column
    const { error } = await supabase.from("Telemetry").insert([
      {
        // --- USER TRACKING ---
        user_id: userData.userId ?? null,

        // --- CONTEXT ---
        page_url: userData.context?.url,
        referrer: userData.context?.referrer,
        timezone: userData.context?.timezone,
        locale: userData.context?.locale,
        timestamp: userData.context?.date,
        location_lat: userData.context?.location?.lat ?? null,
        location_lng: userData.context?.location?.lng ?? null,
        location_accuracy: userData.context?.location?.accuracy ?? null,
        location_error: userData.context?.location?.error ?? null,

        // --- STORAGE ---
        local_storage: userData.storage?.localStorage ?? [],
        session_storage: userData.storage?.sessionStorage ?? [],
        cookies: userData.storage?.cookies ?? "",

        // --- HARDWARE ---
        cores: userData.hardware?.cores ?? 0,
        memory: String(userData.hardware?.memory ?? "unknown"),
        max_touch_points: userData.hardware?.maxTouchPoints ?? 0,
        platform: userData.hardware?.platform ?? "unknown",
        gpu_vendor: isGpuObject
          ? userData.hardware.gpu.vendor
          : String(userData.hardware?.gpu),
        gpu_renderer: isGpuObject ? userData.hardware.gpu.renderer : null,
        battery_level: userData.hardware?.battery?.level ?? null,
        battery_charging: userData.hardware?.battery?.charging ?? null,
        media_audio_inputs: userData.hardware?.mediaInputCounts?.audio ?? 0,
        media_video_inputs: userData.hardware?.mediaInputCounts?.video ?? 0,

        // --- SOFTWARE ---
        user_agent: userData.software?.userAgent ?? "",
        pdf_viewer: userData.software?.pdfViewer ?? false,
        webdriver: userData.software?.webdriver ?? false,
        languages: userData.software?.languages ?? [],
        os_details: userData.software?.osDetails ?? {},

        // --- NETWORK ---
        network_effective_type: userData.network?.effectiveType ?? "unknown",
        network_downlink: userData.network?.downlink ?? 0,
        network_rtt: userData.network?.rtt ?? 0,
        network_save_data: userData.network?.saveData ?? false,
        network_online: userData.network?.online ?? false,

        // --- DISPLAY ---
        screen_res: userData.display?.screenRes ?? "",
        available_res: userData.display?.availableRes ?? "",
        viewport: userData.display?.viewport ?? "",
        color_depth: userData.display?.colorDepth ?? 0,
        pixel_ratio: userData.display?.pixelRatio ?? 0,
        orientation: userData.display?.orientation ?? "",
        hdr_support: userData.display?.hdrSupport ?? false,
        dark_mode: userData.display?.darkMode ?? false,

        // --- PERFORMANCE ---
        perf_memory_limit: userData.performance?.memoryUsage?.limit ?? null,
        perf_memory_total: userData.performance?.memoryUsage?.total ?? null,
        perf_memory_used: userData.performance?.memoryUsage?.used ?? null,
        navigation_type: userData.performance?.navigationType ?? "unknown",
      },
    ])

    if (error) {
      console.error("Supabase Insert Error:", error.message)
      return NextResponse.json(
        { error: "Failed to save to database" },
        { status: 500 }
      )
    }

    console.log("✅ Telemetry successfully pushed to Supabase!")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Telemetry Endpoint Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
