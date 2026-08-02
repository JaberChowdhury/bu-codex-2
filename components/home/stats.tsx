const stats = [
  { value: "20", label: "TEAM_SLOTS" },
  { value: "400tk", label: "ENTRY_FEE" },
  { value: "5h 00m", label: "DURATION" },
  { value: "07", label: "PROBLEMS" },
  { value: "AUG 13", label: "REG_CLOSES" },
]

export function Stats() {
  return (
    <div className="border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:grid-cols-5 sm:py-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-heading text-2xl font-bold text-foreground tnum sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
