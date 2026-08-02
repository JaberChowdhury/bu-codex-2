import { Faq } from "@/components/home/faq"
import { Fuel } from "@/components/home/fuel"
import { Hero } from "@/components/home/hero"
import { Prizes } from "@/components/home/prizes"
import { Stats } from "@/components/home/stats"
import { Timeline } from "@/components/home/timeline"
import { Tracks } from "@/components/home/tracks"
import { Reveal } from "@/components/motion/reveal"
import { Ticker } from "@/components/motion/ticker"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Stats />
      <Reveal>
        <Timeline />
      </Reveal>
      <Reveal>
        <Tracks />
      </Reveal>
      <Reveal>
        <Prizes />
      </Reveal>
      <Reveal>
        <Fuel />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
    </>
  )
}
