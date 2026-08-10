import { SectionHeading } from "@/components/home/section-heading"
import { EVENT_DETAILS } from "@/lib/constants"

const placements = [
  { rank: "01", name: "GOLD", detail: "medal + certificate" },
  { rank: "02", name: "SILVER", detail: "medal + certificate" },
  { rank: "03", name: "BRONZE", detail: "medal + certificate" },
]

export function Prizes() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="prizes · rewards">
          <h2 className="tnum mt-3 font-mono text-sm text-accent sm:text-base">
            prize_pool: {"{"} {EVENT_DETAILS.PRIZE_POOL_TEXT} {"}"}
          </h2>
        </SectionHeading>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {placements.map((placement) => (
            <div
              key={placement.rank}
              className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 transition-colors duration-300 hover:bg-muted/30"
            >
              <span className="tnum font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover:text-accent">
                {placement.rank}
              </span>
              <span className="tnum font-heading text-xl font-bold sm:text-2xl">
                {placement.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {placement.detail}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-5 font-mono text-xs text-muted-foreground">
          <span className="text-accent">every onsite finalist:</span>{" "}
          {EVENT_DETAILS.FINALIST_PRIZES}
        </p>
      </div>
    </section>
  )
}
