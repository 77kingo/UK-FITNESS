# UK FITNESS - Gym Web Application

UK FITNESS is a premium, high-energy gym web application built to offer state-of-the-art landing visuals, interactive timetable filters, role-gated member reservation profiles, and class inventory systems.

---

## ⚡ Technology Stack Rationale

*   **Frontend**: React with Vite and TypeScript (strict typing, high speed compilation).
*   **State Management**: Zustand (lightweight store managing user session, bookings sync, and mock backups).
*   **Styling**: Tailwind CSS with custom theme config (dark mode default with neon volt accent `#ccff00`).
*   **Database & Auth**: Supabase (PostgreSQL engine + Row Level Security + GoTrue Auth framework).
*   **Animations**: Framer Motion for smooth transitions and loading states.
*   **Hosting**: Vercel.

---

## 🚀 Local Run Instructions

### 1. Clone & Set Up Directory
Navigate to the directory:
```bash
cd uk-fitness
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Config (`.env`)
Create a `.env` file in the project root:
```env
# Optional: Supabase integrations. If left empty, the application runs automatically in MOCK mode.
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Note: If no Supabase URL is found, the system switches to offline mock mode automatically, loading dummy profiles, classes, and persisting reservations locally in `localStorage` for sandbox evaluation).*

### 4. Boot Development Server
```bash
npm run dev
```
Open the output link (defaults to `http://localhost:3000`) in your browser.

---

## 📦 Production Compilation

To compile a minified production build bundle:
```bash
npm run build
```
This builds static assets ready for deployment under the `/dist` directory.

---

## 🛡️ Supabase Database Initial Setup

If connecting to a live Supabase project:
1. Go to your **Supabase Project Settings > SQL Editor**.
2. Copy the contents of the database schema file located in [init_schema.sql](file:///C:/Users/saura/.gemini/antigravity/scratch/uk-fitness/supabase/migrations/20260714000000_init_schema.sql).
3. Execute the script to create the `profiles`, `memberships`, `class_types`, `schedule_slots`, and `bookings` tables with Row Level Security (RLS) policies and automatic profile triggers.

---

## ☁️ Vercel Deployment Instructions

### 1. Vercel Command Line Interface (CLI) Deployment
Install the Vercel CLI globally if you haven't:
```bash
npm install -g vercel
```

Run the deploy sequence:
```bash
vercel
```
Follow the wizard questions to link your account. Set the project root to current directory.

### 2. Environment Variables Configuration
Set the variables in Vercel settings (Project Dashboard > Settings > Environment Variables):
*   `VITE_SUPABASE_URL` = Your Supabase API Url.
*   `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Public key.

Re-trigger the deploy:
```bash
vercel --prod
```

---

## 🔑 Demo Shortcuts
For easy preview, we have provided instant login bypass triggers in the Sign-In modal:
*   **Member Shortcut**: Logs in as `member@ukfitness.co.uk` with role `member`. Allows class bookings and profile hub management.
*   **Admin Shortcut**: Logs in as `admin@ukfitness.co.uk` with role `admin`. Opens the **Admin Dashboard** allowing class generation and slot scheduling.
