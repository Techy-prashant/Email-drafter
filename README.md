# Namdapha Email Drafter ✉️

A premium, visual HTML email design studio crafted for **Namdapha House, IIT Madras**. Design publication-grade, responsive HTML emails with a Canva-like visual interface—no coding required.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)

---

## ✨ Features

- 🎨 **Canva-Style Visual Workshop**: Drag-and-drop, inline editing, and live reactive canvas preview.
- 🔤 **Dynamic Typography Engine**: Over 20+ Google fonts (Playfair, Cinzel, Syne, JetBrains Mono, Outfit, etc.) with real-time size steppers, text transformation, and letter-spacing controls.
- 🛠️ **Floating Quick Toolbar**: Contextual mini-bar appearing right above selected blocks for fast bold, italic, color, alignment, and ordering adjustments.
- 📐 **Granular Box Inspector**: Fine-tune padding, line-height, corner radius, borders, and colors on every block.
- 📧 **Production HTML Compiler**: Compiles responsive, cross-client safe table-based HTML compatible with Gmail, Outlook, Apple Mail, and web clients.
- 👁️ **Dual-Tab HTML Inspector**: Toggle between rendered inbox view (with desktop and mobile viewports) and syntax-highlighted source code with 1-click copy and `.html` download.
- 🏛️ **Official Namdapha House Identity**: Integrated official house emblem with refined curved corners and remote fallback delivery.
- 📊 **Residential Management Suite**:
  - **Dashboard Overview**: Term stats, recent broadcasts, and active tasks.
  - **Interactive Schedule Calendar**: Day-by-day hostel timeline and agenda.
  - **Hostel Task Board**: Priority tracker with status tags and assignments.
  - **Template Library**: Curated hostel announcements, GBMs, cultural festivals, and sports updates.
  - **Sent Archive**: Full record of past dispatched communications.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/Techy-prashant/Email-drafter.git
cd Email-drafter
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## 📂 Project Architecture

```
src/
├── app/                  # Next.js App Router (layout, page, globals.css)
├── components/
│   ├── campaign/         # Campaign composer and audience picker
│   ├── canvas/           # Canvas Studio (EmailCanvas, Inspector, HTML Modal, Toolbar)
│   ├── common/           # Shared UI primitives (Modal, NamdaphaLogo)
│   ├── home/             # Dashboard overview and calendar widgets
│   ├── layout/           # App navigation (Sidebar, Header, MobileNav)
│   ├── sent/             # Sent emails log and detail view
│   ├── tasks/            # Hostel task manager and status boards
│   └── templates/        # Reusable template browser
├── data/                 # Sample residential datasets and templates
└── types/                # TypeScript type definitions and block models
```

---

## 🛡️ License

MIT License • Developed with ❤️ for Namdapha House, IIT Madras.
