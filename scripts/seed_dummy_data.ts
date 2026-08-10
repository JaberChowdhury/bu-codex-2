import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log("🌱 Starting dummy data seeding...")

  // --- 1. SEED TEAMS (POST /api/register simulation) ---
  console.log("📦 Seeding Team Registrations...")
  const dummyTeams = [
    {
      team_name: "Code Crusaders",
      team_code: "CRU001",
      department: "Department of Computer Science and Engineering (CSE)",
      members: [
        {
          fullName: "Tanvir Ahmed",
          studentId: "20241001",
          gmail: "tanvir.code@gmail.com",
          mobile: "01711223344",
          section: "A",
          batch: "52",
          tshirt: "L",
          photo:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        },
        {
          fullName: "Faria Rahman",
          studentId: "20241002",
          gmail: "faria.dev@outlook.com",
          mobile: "01811223355",
          section: "A",
          batch: "52",
          tshirt: "M",
          photo:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        },
        {
          fullName: "Saad Hasan",
          studentId: "20241003",
          gmail: "saad.bu@yahoo.com",
          mobile: "01911223366",
          section: "B",
          batch: "52",
          tshirt: "XL",
          photo:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
    {
      team_name: "Algorithm Architects",
      team_code: "ARC002",
      department: "Department of Electrical and Electronic Engineering (EEE)",
      members: [
        {
          fullName: "Mahmudul Haque",
          studentId: "20232010",
          gmail: "mahmud.eee@gmail.com",
          mobile: "01511223377",
          section: "A",
          batch: "50",
          tshirt: "M",
          photo:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
        },
        {
          fullName: "Nusrat Jahan",
          studentId: "20232011",
          gmail: "nusrat.eee@gmail.com",
          mobile: "01611223388",
          section: "A",
          batch: "50",
          tshirt: "S",
          photo:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        },
        {
          fullName: "Abrar Shakil",
          studentId: "20232012",
          gmail: "abrar.shakil@gmail.com",
          mobile: "01755667788",
          section: "A",
          batch: "50",
          tshirt: "L",
          photo:
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
    {
      team_name: "Cyber Knights",
      team_code: "KNI003",
      department: "Department of Computer Science and Engineering (CSE)",
      members: [
        {
          fullName: "Rafiqul Islam",
          studentId: "20253001",
          gmail: "rafiq.knight@gmail.com",
          mobile: "01311223399",
          section: "C",
          batch: "54",
          tshirt: "XXL",
          photo:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        },
        {
          fullName: "Sumiya Akter",
          studentId: "20253002",
          gmail: "sumiya.cse@bu.ac.bd",
          mobile: "01411223300",
          section: "C",
          batch: "54",
          tshirt: "M",
          photo:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        },
        {
          fullName: "Imran Hossain",
          studentId: "20253003",
          gmail: "imran.hossain@gmail.com",
          mobile: "01899887766",
          section: "C",
          batch: "54",
          tshirt: "L",
          photo:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
  ]

  for (const team of dummyTeams) {
    const { error } = await supabase
      .from("registrations")
      .insert([team])
      .select()
    if (error) {
      console.error(
        `⚠️ Failed to insert team ${team.team_name}:`,
        error.message
      )
    } else {
      console.log(`✅ Team registered: ${team.team_name} (${team.team_code})`)
    }
  }

  // --- 2. SEED ANNOUNCEMENTS (POST /api/admin/announcements simulation) ---
  console.log("📢 Seeding Announcements...")
  const dummyAnnouncements = [
    {
      title: "Prelims Contest Platform Details Announced!",
      category: "urgent",
      content:
        "The preliminary round of BU Codex 2026 will take place on VJudge on October 2nd, starting at 3:00 PM BST. Ensure your team leader creates a VJudge account beforehand.",
      created_at: new Date().toISOString(),
    },
    {
      title: "Registration Deadline Extended to September 25th",
      category: "general",
      content:
        "Due to high demand from multiple departments, registration slots have been opened up to 20 teams! Final deadline is September 25, 2026.",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      title: "Onsite Final Schedule & Venue Rules",
      category: "event",
      content:
        "The Onsite Final will be held at the Main Auditorium of Bangladesh University, Dhaka. Free snacks, t-shirts, and lunch boxes will be provided to all registered finalists.",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  for (const announce of dummyAnnouncements) {
    const { error } = await supabase
      .from("announcements")
      .insert([announce])
      .select()
    if (error) {
      console.error(
        `⚠️ Failed to insert announcement "${announce.title}":`,
        error.message
      )
    } else {
      console.log(`✅ Announcement added: "${announce.title}"`)
    }
  }

  // --- 3. SEED GALLERY IMAGES (POST /api/admin/gallery simulation) ---
  console.log("🖼️ Seeding Gallery Images...")
  const dummyGallery = [
    {
      title: "BU Codex 2025 Opening Ceremony",
      category: "event",
      date: "2025-10-12",
      tags: ["ceremony", "bu", "hackathon"],
      image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Champions Trophy Celebration - Round 1",
      category: "round-1",
      date: "2026-08-01",
      tags: ["round-1", "winners", "trophy"],
      image_url:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Onsite Final Round Problem Solving",
      category: "round-2",
      date: "2026-08-05",
      tags: ["round-2", "coding", "onsite"],
      image_url:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Best Problem Solver Award",
      category: "award",
      date: "2026-08-08",
      tags: ["award", "champions", "prizes"],
      image_url:
        "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Informatics Club Organizers & Volunteers",
      category: "general",
      date: "2026-08-10",
      tags: ["team", "organizers", "volunteers"],
      image_url:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    },
  ]

  for (const item of dummyGallery) {
    const { error } = await supabase.from("gallery").insert([item]).select()
    if (error) {
      console.error(
        `⚠️ Failed to insert gallery image "${item.title}":`,
        error.message
      )
    } else {
      console.log(`✅ Gallery item added: "${item.title}" [${item.category}]`)
    }
  }

  console.log("\n🎉 Seeding complete! All dummy data uploaded successfully.")
}

seed().catch(console.error)
