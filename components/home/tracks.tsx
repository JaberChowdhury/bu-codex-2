import {
  IconBinaryTree2,
  IconCodeDots,
  IconHash,
  IconPyramid,
  IconStack2,
  IconTimeline,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { SectionHeading } from "@/components/home/section-heading"

const tracks = [
  {
    index: "01",
    title: "Data Structures & Algorithms",
    note: "core",
    Icon: IconStack2,
  },
  {
    index: "02",
    title: "Graph Theory & Trees",
    note: "core",
    Icon: IconBinaryTree2,
  },
  {
    index: "03",
    title: "Dynamic Programming",
    note: "heavy",
    Icon: IconPyramid,
  },
  {
    index: "04",
    title: "Number Theory",
    note: "medium",
    Icon: IconHash,
  },
  {
    index: "05",
    title: "Greedy & Ad-hoc",
    note: "mixed",
    Icon: IconCodeDots,
  },
  {
    index: "06",
    title: "Implementation-heavy Simulation",
    note: "patience required",
    Icon: IconTimeline,
  },
]

export function Tracks() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="tracks · problem_set">
          <h2 className="mt-3 font-heading text-2xl font-bold tnum sm:text-3xl">
            PROBLEM TRACKS
          </h2>
        </SectionHeading>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <Card
              key={track.index}
              size="sm"
              className="group transition-all duration-300 hover:-translate-y-1 hover:border-accent/70 hover:bg-card/80"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent tnum">
                    {track.index}
                  </span>
                  <track.Icon
                    className="size-5 text-muted-foreground transition-all duration-300 group-hover:text-accent group-hover:scale-110"
                    stroke={1.5}
                  />
                </div>
                <CardTitle>{track.title}</CardTitle>
                <CardDescription className="font-mono text-xs uppercase tracking-widest">
                  {track.note}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-8 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          <p>languages: c++17 / c++20 / java / python3</p>
          <p className="mt-1">
            judge: toph.co · icpc-style scoring · open to any BU department
          </p>
        </div>
      </div>
    </section>
  )
}
