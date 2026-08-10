import type { Metadata } from "next"
import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Nunito,
  Plus_Jakarta_Sans,
} from "next/font/google"

import "./globals.css"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { buildThemeScript } from "@/components/theme"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

/* Injected into <head> by next/script before hydration. Runs before first
 * paint so the gated theme tokens apply immediately on load with no flash.
 * The theme routes encode their theme in the URL, so one shared script can
 * pick the right theme for every route. Client-side navigation between themes
 * is handled by ThemeRoot in each theme layout.
 */
const setThemeScript = buildThemeScript()

import NextTopLoader from "nextjs-toploader"
import TelemetryProvider from "@/components/TelemetryProvider"

export const metadata: Metadata = {
  title: "BU CODEX // ROUND 02",
  description:
    "Competitive programming contest by BU CSE. Teams of three. Five hours. Sep 12, 2026.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        fontMono.variable,
        geist.variable,
        nunito.variable,
        jakarta.variable,
        jetbrains.variable
      )}
    >
      <head>
        {typeof window === "undefined" && (
          <script
            id="bu-codex-theme"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: setThemeScript }}
          />
        )}
      </head>
      <body>
        <TelemetryProvider>
          <NextTopLoader
            color="var(--primary)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
          />
          <SiteNav />
          {children}
          <SiteFooter />
        </TelemetryProvider>
      </body>
    </html>
  )
}
