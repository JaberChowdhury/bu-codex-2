"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { SectionHeading } from "@/components/home/section-heading"
import { EVENT_DETAILS } from "@/lib/constants"

const faqs = [
  {
    question: "Who can participate?",
    answer: `Any student of Bangladesh University (BU), from any department. Teams of exactly ${EVENT_DETAILS.TEAM_SIZE}.`,
  },
  {
    question: "I don't have a team yet.",
    answer:
      "Solo joiners can be matched through the BU CODEX community channel.",
  },
  {
    question: "Is the onsite final mandatory?",
    answer: `Yes. Qualify online, show up on ${EVENT_DETAILS.MONTH_DAY}.`,
  },
  {
    question: "What should I bring?",
    answer: "Student ID and a valid photo ID.",
  },
  {
    question: "Is there an entry fee?",
    answer: `Yes — ${EVENT_DETAILS.ENTRY_FEE_TEXT}, paid once at registration. Covers the contest kit, refreshments, and venue costs.`,
  },
  {
    question: "How is the contest scored?",
    answer: `ICPC-style on ${EVENT_DETAILS.PLATFORM}. Correct submissions are ranked by problems solved, then total penalty time.`,
  },
]

export function Faq() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading label="faq · queries">
          <h2 className="tnum mt-3 font-heading text-2xl font-bold sm:text-3xl">
            FAQ
          </h2>
        </SectionHeading>
        <Accordion className="mt-10 max-w-3xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="font-heading">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
