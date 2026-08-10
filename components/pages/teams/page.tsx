import { createClient } from "@supabase/supabase-js"
import { IconTrophy } from "@tabler/icons-react"
import TeamsClient from "./TeamsClient"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export const revalidate = 60 // Revalidate every minute

export default async function TeamsPage() {
  const { data: teams, error } = await supabase
    .from("registrations")
    .select("team_name, members")
    .order("created_at", { ascending: true })

  const formattedTeams =
    teams?.map((team) => ({
      teamName: team.team_name,
      members:
        (team.members as { fullName: string }[])?.map((m) => m.fullName) || [],
    })) || []

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent opacity-50 blur-3xl" />
        <div className="absolute -right-1/2 -bottom-1/2 h-full w-full rounded-full bg-gradient-to-tl from-blue-500/10 via-cyan-500/10 to-transparent opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 space-y-4 text-center">
          <div className="mb-4 inline-flex items-center justify-center space-x-2 rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 backdrop-blur-md">
            <IconTrophy size={16} className="text-primary" />
            <span className="text-sm font-medium tracking-wide text-foreground/80 uppercase font-mono">
              Contestants
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text pb-2 text-5xl font-bold tracking-tight text-transparent md:text-6xl font-heading">
            Registered Teams
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-mono">
            Meet the brilliant minds competing in this year&apos;s BU CodeX.
            Here are the successfully registered teams and their members.
          </p>
        </div>

        <TeamsClient teams={formattedTeams} error={error?.message} />
      </div>
    </main>
  )
}
