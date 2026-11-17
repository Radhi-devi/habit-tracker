#  HabitFlow — Habit & Activity Tracker (Purple Edition)

A clean, modern, responsive Habit & Activity Tracker web application built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**. Fully functional offline with local account isolation and cross-browser cloud synchronization using **Google Firebase**.

---

## 🎨 Purple Edition & Authentication Highlights

- **Vibrant Purple Theme**: Elegant royal purple, violet, and indigo color scheme with ambient glows, styled dark/light mode, and purple chart accents.
- **Proper Authentication**:
  - **Account System**: Sign Up, Sign In, Switch Profiles, and Avatars.
  - **User Isolation**: Each user account gets their own isolated habits, logs, targets, and streaks.
  - **Cross-Browser Cloud Sync**: Built-in Firebase integration that connects all your browsers (Chrome, Edge, Safari, phone, tablet, and Vercel/Netlify live deployments) in real time under your single login!
  - **One-Click Instant Demo**: Instant test account for fast demonstration.

---

## 🚀 Quick Start

### 1. Navigate to the project directory
```bash
cd "C:\Users\radhi\.gemini\antigravity\scratch\habit-tracker"
```

### 2. Install dependencies (if needed)
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 4. Build for production & preview
```bash
npm run build
npm run preview -- --port 5173
```

---

## 🔄 How to Push Updates to GitHub

Run these commands in your PowerShell / Command Prompt terminal:

```powershell
cd "C:\Users\radhi\.gemini\antigravity\scratch\habit-tracker"

# 1. Stage all changes
git add .

# 2. Commit with a message
git commit -m "feat: purple UI theme overhaul and authentication system"

# 3. Push to GitHub
git push origin main
```

---

## 🎯 Core Features

### 1. Daily Tracking (Home Screen)
- Date navigation with left/right arrows, date picker, and instant "Jump to Today".
- Two big buttons per activity: ✅ **Complete (Tick)** and ❌ **Missed (Cross)**.
- Live progress bar with real-time percentage:
  $$\text{Daily \%} = \frac{\text{completed activities}}{\text{total activities}} \times 100$$
- Confetti fireworks on 100% completion!

### 2. Overall Dashboard (Graphs)
- 5 KPI cards: Total Completed, Total Missed, Success Rate, Current Streak, Best Streak.
- Completed vs Not Completed all-time bar graph.
- Daily completion percentage chart (Area/Line or Bar) for the selected month.
- Habit performance breakdown highlighting strongest vs weakest habits.

### 3. Monthly Performance
- Monthly report metrics: Average daily completion, best/worst day, best/weakest activity, and month-over-month comparison against the preceding month.
- Performance rating badge: 🌟 **Excellent** (90%+), 💪 **Good** (70-89%), ⚖️ **Average** (50-69%), 🌱 **Needs Improvement** (< 50%).
- Calendar Heatmap colored by completion rate (interactive: click any day to edit).
- Weekly breakdown bar chart (Weeks 1 to 5).

### 4. Manage Activities
- Add, edit, delete, and reorder activities with Up/Down buttons.
- Emoji picker with 24 popular presets + custom emoji input.
- Theme color picker and daily target suggestions.

### 5. Data & Sync
- **Local & Cloud Storage**: Works offline and optionally connects to Firebase for cross-browser sync.
- **Export & Import**: Download JSON backup or CSV spreadsheet; restore from JSON anytime.
- **Reset**: Safe reset popup for sample data or clean slate.
