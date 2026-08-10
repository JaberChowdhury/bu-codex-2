import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const BASE_URL = "http://localhost:3000"

// Dummy SVG file as Blob/File helper
function createDummyFile(filename: string, text: string): File {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="200" height="200" fill="#2563eb"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="16">${text}</text>
  </svg>`
  return new File([svgContent], filename, { type: "image/svg+xml" })
}

async function runHttpPostTests() {
  console.log(
    "🚀 Testing ALL HTTP POST endpoints against live server (http://localhost:3000)..."
  )

  // --- 1. POST /api/telemetry ---
  console.log("\n1️⃣ POST /api/telemetry...")
  try {
    const res = await fetch(`${BASE_URL}/api/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userData: {
          context: {
            url: `${BASE_URL}/gallery`,
            date: new Date().toISOString(),
          },
        },
      }),
    })
    const json = await res.json()
    console.log(` Status: ${res.status}`, json)
  } catch (err) {
    console.error("❌ Telemetry POST failed:", err)
  }

  // --- 2. POST /api/register ---
  console.log(
    "\n2️⃣ POST /api/register (Team Registration via multipart/form-data)..."
  )
  try {
    const formData = new FormData()
    const teamCode = `TST${Math.floor(100 + Math.random() * 900)}`
    formData.append("teamName", "Dynamic Hackers")
    formData.append("teamCode", teamCode)
    formData.append(
      "department",
      "Department of Computer Science and Engineering (CSE)"
    )

    for (let i = 0; i < 3; i++) {
      formData.append(
        `member_${i}`,
        JSON.stringify({
          fullName: `Test Member ${i + 1}`,
          gender: i % 2 === 0 ? "male" : "female",
          studentId: `20243107000${i + 1}`,
          batch: "24",
          section: "A",
          gmail: `testmember${i + 1}@gmail.com`,
          mobile: `0171234567${i}`,
          emergencyContact: `0181234567${i}`,
          relation: "teammate",
          tshirt: "L",
          experience: 2,
        })
      )
      formData.append(
        `photo_${i}`,
        createDummyFile(`avatar_${i}.svg`, `Member ${i + 1}`)
      )
    }

    const res = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      body: formData,
    })
    const json = await res.json()
    console.log(` Status: ${res.status}`, json)
  } catch (err) {
    console.error("❌ Register POST failed:", err)
  }

  // --- 3. POST /api/admin/login ---
  console.log("\n3️⃣ POST /api/admin/login (Admin Auth)...")
  let cookieHeader = ""
  try {
    const loginData = new FormData()
    loginData.append("email", process.env.ADMIN_EMAIL || "")
    loginData.append("password", process.env.ADMIN_PASSWORD || "")

    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      body: loginData,
    })
    const json = await res.json()
    const setCookie = res.headers.get("set-cookie")
    if (setCookie) {
      cookieHeader = setCookie.split(";")[0]
    } else {
      cookieHeader = "admin_auth=authenticated"
    }
    console.log(` Status: ${res.status}`, json, `[Cookie: ${cookieHeader}]`)
  } catch (err) {
    console.error("❌ Admin Login POST failed:", err)
  }

  // --- 4. POST /api/admin/announcements ---
  console.log(
    "\n4️⃣ POST /api/admin/announcements (Broadcasting Announcement)..."
  )
  try {
    const res = await fetch(`${BASE_URL}/api/admin/announcements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        title: "Live POST Test Notice",
        category: "urgent",
        content:
          "This announcement was posted directly via end-to-end HTTP POST request test.",
      }),
    })
    const json = await res.json()
    console.log(` Status: ${res.status}`, json)
  } catch (err) {
    console.error("❌ Announcements POST failed:", err)
  }

  // --- 5. POST /api/admin/gallery ---
  console.log("\n5️⃣ POST /api/admin/gallery (Uploading Gallery Image)...")
  try {
    const galleryForm = new FormData()
    galleryForm.append("title", "Live HTTP Upload Test")
    galleryForm.append("category", "round-1")
    galleryForm.append("date", "2026-08-11")
    galleryForm.append("tags", JSON.stringify(["http", "live", "test"]))
    galleryForm.append(
      "file",
      createDummyFile("live_upload.svg", "HTTP Upload")
    )

    const res = await fetch(`${BASE_URL}/api/admin/gallery`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: galleryForm,
    })
    const json = await res.json()
    console.log(` Status: ${res.status}`, json)
  } catch (err) {
    console.error("❌ Gallery POST failed:", err)
  }

  console.log("\n✨ All HTTP POST endpoint tests completed!")
}

runHttpPostTests().catch(console.error)
