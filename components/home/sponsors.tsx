import { SectionHeading } from "@/components/home/section-heading"

export function Sponsors() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="partners · support">
          <h2 className="tnum mt-3 font-heading text-2xl font-bold sm:text-3xl">
            SPONSORS // BACKERS
          </h2>
        </SectionHeading>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Powering the next generation of problem solvers.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Platinum
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Gold
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Silver
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/40 p-8 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-card/60 hover:text-accent hover:shadow-[0_0_20px_rgba(var(--accent),0.1)]">
            <span className="font-heading text-sm font-bold tracking-widest uppercase">
              Bronze
            </span>
            <div className="h-px w-8 bg-border"></div>
            <span className="font-mono text-xs">TBA</span>
          </div>
        </div>
      </div>
    </section>
  )
}
