# BU CODEX // ROUND 02 🏆

![BU Codex Banner](https://raw.githubusercontent.com/jaberchowdhury/bu-codex-2/main/public/og.png) <!-- Update this path when the repository is public -->

A high-performance, full-stack Next.js web application built for the **BU Codex Round 02** competitive programming contest hosted by the Bangladesh University CSE department. It serves as the central hub for team registrations, announcements, contest rules, and an interactive image gallery.

## ✨ Features

- **Dual Theming System**: Includes a retro "Terminal" aesthetic and a premium glassmorphic "Hum" aesthetic, seamlessly integrated across routes.
- **Dynamic Team Registration**: A robust multi-step registration form supporting teams of three, complete with profile picture uploads directly to Supabase Storage.
- **Interactive 3D Gallery**: A stunning, high-performance masonry gallery featuring a WebGL `Three.js` background, smooth categorized filtering, and optimized `next/image` lazy loading.
- **Secure Admin Dashboard**: A comprehensive control panel for organizers to:
  - View and export registered teams as PDF or Excel files.
  - Manage (Create, Update, Delete) the image gallery.
  - Broadcast real-time announcements.
- **Optimized for Next.js 15**: Built with the Next.js App Router, Turbopack, and React 19 standards, ensuring zero flash of unstyled content (FOUC) and strict hydration compatibility.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion (for micro-animations)
- **3D Graphics**: Three.js & React Three Fiber
- **Backend/Database**: Supabase (PostgreSQL & Storage)
- **Exporting Tools**: `html2canvas-pro` (PDF) & `xlsx` (Excel)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [Bun](https://bun.sh/) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bu-codex-2.git
   cd bu-codex-2
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Run the development server:**
   ```bash
   bun run dev
   ```
   Navigate to `http://localhost:3000` to view the application.

## 📁 Project Structure

- `/app` - Next.js App Router pages (divided into `/` for Terminal theme and `/hum` for Premium theme).
- `/components` - Reusable React components (UI, Admin, Gallery, Registration forms).
- `/lib` - Utility functions, database configuration, and watchers.
- `/public` - Static assets, images, and icons.

## 🛡️ Admin Access

The admin dashboard is protected. To access it, navigate to `/admin` and enter the configured `ADMIN_PASSWORD` from your environment variables. Organizers can manage content and export the final participant lists here.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/bu-codex-2/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Designed and engineered for the Programming Community of Bangladesh University (PCBU).*
