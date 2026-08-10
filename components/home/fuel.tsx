import { SectionHeading } from "@/components/home/section-heading"

const stops = [
  { at: "start", note: "snack drop" },
  { at: "02:30h", note: "refuel" },
  { at: "finish", note: "award + chow" },
]

export function Fuel() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="fuel · logistics">
          <h2 className="tnum mt-3 font-mono text-sm text-accent sm:text-base">
            fuel: snacks + simple food
          </h2>
        </SectionHeading>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Snacks and simple food served at the start of the contest and again at
          the midpoint. Five hours is a marathon — stay fueled.
        </p>
        <dl className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-3">
          {stops.map((stop) => (
            <div
              key={stop.at}
              className="group border border-border bg-card px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/70"
            >
              <dt className="tnum flex items-center gap-2 font-mono text-xs text-accent">
                <span className="pulse-dot">●</span>
                {stop.at}
              </dt>
              <dd className="mt-1 font-mono text-sm text-muted-foreground">
                {stop.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
