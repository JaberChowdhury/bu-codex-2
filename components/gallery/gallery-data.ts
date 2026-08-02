import {
  IconBug,
  IconCamera,
  IconCircleCheck,
  IconClipboardList,
  IconDoorEnter,
  IconHourglass,
  IconMedal,
  IconMicrophone,
  IconTrophy,
  type TablerIcon,
} from "@tabler/icons-react"

export type GalleryCategory = "ceremony" | "contest" | "awards"

export type GalleryEntry = {
  index: number
  title: string
  description: string
  category: GalleryCategory
  icon: TablerIcon
}

export type GalleryCategoryKey = "all" | GalleryCategory

export const galleryCategories: { key: GalleryCategoryKey; label: string }[] = [
  { key: "all", label: "all (9)" },
  { key: "ceremony", label: "ceremony (3)" },
  { key: "contest", label: "contest (3)" },
  { key: "awards", label: "awards (3)" },
]

export const galleryEntries: GalleryEntry[] = [
  {
    index: 1,
    title: "Inauguration",
    description: "The contest floor opens.",
    category: "ceremony",
    icon: IconDoorEnter,
  },
  {
    index: 2,
    title: "Keynote Address",
    description: "A few words before the clock starts.",
    category: "ceremony",
    icon: IconMicrophone,
  },
  {
    index: 3,
    title: "Team Intel Briefing",
    description: "The judges lay out the rules.",
    category: "ceremony",
    icon: IconClipboardList,
  },
  {
    index: 4,
    title: "The First Submit",
    description: "The first green checkmark lands.",
    category: "contest",
    icon: IconCircleCheck,
  },
  {
    index: 5,
    title: "Debugging in the Dark",
    description: "Five hours in, the tension peaks.",
    category: "contest",
    icon: IconBug,
  },
  {
    index: 6,
    title: "Last Five Minutes",
    description: "Final submissions roll in.",
    category: "contest",
    icon: IconHourglass,
  },
  {
    index: 7,
    title: "Podium",
    description: "Gold, silver, bronze.",
    category: "awards",
    icon: IconTrophy,
  },
  {
    index: 8,
    title: "The Medal Moment",
    description: "Handing out medals and certificates.",
    category: "awards",
    icon: IconMedal,
  },
  {
    index: 9,
    title: "Group Photo",
    description: "All 20 slots, one frame.",
    category: "awards",
    icon: IconCamera,
  },
]
