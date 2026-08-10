import { EVENT_DETAILS } from "@/lib/constants"

const stats = [
  { value: EVENT_DETAILS.TEAM_SLOTS.toString(), label: "TEAM_SLOTS" },
  { value: EVENT_DETAILS.ENTRY_FEE_AMOUNT, label: "ENTRY_FEE" },
  { value: EVENT_DETAILS.DURATION_TEXT, label: "DURATION" },
  {
    value: EVENT_DETAILS.PROBLEMS_COUNT.toString().padStart(2, "0"),
    label: "PROBLEMS",
  },
  { value: EVENT_DETAILS.REGISTRATION_CLOSES, label: "REG_CLOSES" },
]

export function Stats() {
  return (
    <div className="border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:grid-cols-5 sm:py-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="tnum font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
