import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
      className={cn("dark antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
