import { SectionHeading } from "@/components/home/section-heading"
import { EVENT_DETAILS } from "@/lib/constants"

const events = [
  {
    index: "01",
    date: EVENT_DETAILS.REGISTRATION_OPENS,
    label: "Registration opens",
    detail: `Open to any BU department, teams of ${EVENT_DETAILS.TEAM_SIZE}`,
  },
  {
    index: "02",
    date: EVENT_DETAILS.REGISTRATION_CLOSES,
    label: "Registration closes",
    detail: `${EVENT_DETAILS.TEAM_SLOTS} slots`,
  },
  {
    index: "03",
    date: EVENT_DETAILS.PRELIMS_DATE,
    label: "Prelims",
    detail: EVENT_DETAILS.PRELIMS_LOCATION,
  },
  {
    index: "04",
    date: EVENT_DETAILS.ONSITE_FINAL_DATE,
    label: "Onsite final",
    detail: EVENT_DETAILS.ONSITE_LOCATION,
  },
  {
    index: "05",
    date: EVENT_DETAILS.AWARDS_DATE,
    label: "Awards ceremony",
    detail: "Medals, certificates, t-shirts",
  },
]

export function Timeline() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="timeline · round_02">
          <h2 className="mt-3 font-heading text-2xl font-bold tnum sm:text-3xl">
            SCHEDULE // ROUND_02
          </h2>
        </SectionHeading>
        <ol className="mt-10 border-l border-border">
          {events.map((event) => (
            <li
              key={event.index}
              className="group relative border-b border-border/40 py-6 pl-8 last:border-b-0 sm:pl-10"
            >
              <span
                aria-hidden="true"
                className="absolute top-7 -left-4 bg-background px-1 font-mono text-xs text-muted-foreground tnum transition-colors duration-300 group-hover:text-accent sm:-left-5"
              >
                {event.index}
              </span>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="shrink-0 font-mono text-xs text-accent tnum">
                  {event.date}
                </span>
                <h3 className="font-heading text-base font-bold">{event.label}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
