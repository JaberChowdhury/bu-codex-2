import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zajfcezhuwgsrztiyydk.supabase.co",
      },
    ],
  },
}

export default nextConfig
