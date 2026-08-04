import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { LoginForm } from "@/components/admin/login-form"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ADMIN // BU CODEX",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get("admin_auth")?.value

  if (auth !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <LoginForm />
      </main>
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-8 pt-20">
      <AdminDashboard registrations={data || []} error={error?.message} />
    </main>
  )
}
