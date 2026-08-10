// Registration deadline (UTC). The register page disables itself once this moment is reached.
export const REGISTRATION_DEADLINE_ISO = "2026-09-25T17:59:00Z"

export const EVENT_DETAILS = {
  // Dates & Deadlines
  REGISTRATION_OPENS: "AUG 02",
  REGISTRATION_CLOSES: "SEP 25",
  REG_CLOSE_TARGET_ISO: REGISTRATION_DEADLINE_ISO,
  PRELIMS_DATE: "OCT 02",
  ONSITE_FINAL_DATE: "OCT 03",
  AWARDS_DATE: "OCT 03 · evening",
  YEAR: "2026",
  MONTH_DAY: "Oct 03",

  // Logistics
  TEAM_SLOTS: 20,
  TEAM_SIZE: 3,
  ENTRY_FEE_AMOUNT: "400tk",
  ENTRY_FEE_TEXT: "400tk per team",
  DURATION_TEXT: "5h 00m",
  DURATION_HOURS: 5,
  PROBLEMS_COUNT: 11,

  // Locations / Platforms
  PRELIMS_LOCATION: "Online, on vjudge",
  ONSITE_LOCATION: "Bangladesh University, Dhaka",
  PLATFORM: "vjudge",
  PLATFORM_TEXT: "Online, on vjudge",

  // Prizes
  PRIZE_POOL_TEXT: "cash: 0, medals: yes, certificates: yes",
  SHORT_PRIZES_TEXT: "no cash prizes — medals + certificates",
  LONG_PRIZES_TEXT: "No cash prizes — medals, certificates, t-shirts",
  FINALIST_PRIZES: "t-shirt + goodies",

  // Misc
  SNACKS_INFO: "snacks + food at start and midpoint",
}

// T-shirt sizes offered at registration. Edit this list to add/remove sizes
// after the management team decision — it drives the form, validation and PDF exports.
export const TSHIRTS = ["XS", "S", "M", "L", "XL", "XXL"] as const
export type TShirtSize = (typeof TSHIRTS)[number]

// Departments offered at registration, grouped by faculty. Edit this list to
// add/remove departments — it drives the form dropdown and API validation.
export const FACULTIES = [
  {
    name: "Faculty of Business Administration & Economics",
    departments: [
      "Department of Business Administration",
      "Department of Economics",
    ],
  },
  {
    name: "Faculty of Science, Engineering and Technology",
    departments: [
      "Department of Computer Science and Engineering (CSE)",
      "Department of Architecture",
      "Department of Electrical and Electronic Engineering (EEE)",
      "Department of Mathematics",
      "Department of Pharmacy",
    ],
  },
  {
    name: "Faculty of Arts, Social Science & Law",
    departments: [
      "Department of English",
      "Department of Law",
      "Department of Sociology",
    ],
  },
] as const

export const DEPARTMENTS = FACULTIES.flatMap(
  (faculty) => faculty.departments
) as readonly string[]

export const DEFAULT_DEPARTMENT =
  "Department of Computer Science and Engineering (CSE)"
