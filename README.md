# 🌟 HabitFlow — Habit & Activity Tracker

A clean, modern, responsive Habit & Activity Tracker web application built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**. Fully functional offline with zero backend dependencies, persisting all habit configurations and check-in logs directly in your browser's `localStorage`.

---

## 🚀 Quick Start

### 1. Navigate to the project directory
```bash
cd "C:\Users\radhi\.gemini\antigravity\scratch\habit-tracker"
```

### 2. Install dependencies (if not already installed)
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
npm run preview -- --port 4173
```
Open [http://localhost:4173](http://localhost:4173).

### 5. Run automated tests
```bash
node test-runner.js
```

---

## 🎯 Key Features

### 1. Manage Activities
- **Custom Habits**: Add any habit or daily goal (e.g., *Gym / Workout*, *Reading*, *Coding*, *Water 3L*, *Sleep by 11 PM*).
- **Customizable Details**:
  - Name (required)
  - Emoji / Icon picker with 24 popular presets + custom emoji input
  - Theme color swatches + custom hex color picker
  - Daily Target helper presets (e.g. *30 mins*, *20 pages*, *3 Liters*, *10,000 steps*)
- **Organize**: Reorder habits using **Up / Down** arrows, edit existing habits, or delete with safe confirmation modals.

### 2. Daily Tracking (Home Screen)
- **Date Navigation**:
  - Left / Right arrows to move back and forth between days.
  - Native date picker modal for jumping to any past date.
  - Instant "Jump to Today" shortcut.
- **Two Big Action Buttons**:
  - ✅ **Complete (Tick)**: Marks habit as completed.
  - ❌ **Missed (Cross)**: Marks habit as not completed.
  - **Toggleable**: Default state is *pending* (neither selected). Tapping an active button unselects it, and you can switch choices at any time.
- **Live Today's Progress Bar**:
  $$\text{Daily \%} = \frac{\text{completed activities}}{\text{total activities}} \times 100$$
  - Real-time percentage badge and animated progress bar that transitions from amber to blue to emerald.
  - Confetti burst animation when you hit 100% completion!

### 3. Overall Dashboard (Graphs)
- **5 Summary KPI Cards**:
  1. **Total Completed** (all-time check-ins)
  2. **Total Missed** (all-time missed)
  3. **Overall Success Rate** ($\%$)
  4. **Current Streak** (consecutive qualifying days)
  5. **Best Streak** (all-time streak record)
- **Overall Bar Graph**:
  - Recharts stacked/grouped bar chart showing Completed vs Not Completed per activity across all time.
- **Daily Percentage Chart**:
  - Line / Area or Bar chart showing completion rate day-by-day for the selected month, with target reference line.
- **Habit-Wise Performance**:
  - Percentage progress bars highlighting your **Strongest Habit** and **Habit Needing Focus**.

### 4. Monthly Performance
- **Month Selector**: `< Previous Month` `[ Month Year ]` `Next Month >` + "Current Month" button.
- **Performance Rating**:
  - 🌟 **Excellent** (90%+)
  - 💪 **Good** (70% - 89%)
  - ⚖️ **Average** (50% - 69%)
  - 🌱 **Needs Improvement** (< 50%)
- **Month-over-Month (MoM) Comparison**: Displays percentage difference compared against the preceding month (e.g. $+12\%$ vs October).
- **Best Day & Worst Day**: Identifies peak and lowest days in the month.
- **Calendar Heatmap**:
  - Interactive monthly calendar grid colored by completion rate (Red < 25%, Orange 25-49%, Yellow 50-74%, Light Green 75-99%, Vibrant Green 100%).
  - Click any day cell to immediately open and edit habits for that specific date!
- **Weekly Breakdown Chart**:
  - Bar chart analyzing average completion rates for Week 1 (Days 1-7), Week 2 (Days 8-14), Week 3 (Days 15-21), Week 4 (Days 22-28), and Week 5 (Days 29-31).

### 5. Extras & Data Management
- **Offline & Private**: Stored locally in your browser with zero tracking.
- **Backup & Restore**:
  - Export full backup as `.json` file.
  - Export spreadsheet table as `.csv` file.
  - Import and restore JSON backup via file picker or raw paste.
- **Reset All Data**: Safe confirmation popup offering **Reset to 5 Sample Habits** or **Wipe Everything Clean**.
- **Dark & Light Mode**: Smooth theme toggle persisted across sessions.
- **Seeded Sample Data**: Comes pre-populated with 5 realistic activities and 35 days of historical data so charts and trends are visible immediately.

---

## 📁 Project Structure

```
habit-tracker/
├── index.html                   # HTML entry point with Plus Jakarta Sans & meta tags
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration with @tailwindcss/vite
├── test-runner.js               # Automated unit & integration test suite (29 tests)
├── src/
│   ├── main.jsx                 # React root render
│   ├── App.jsx                  # Main application layout & active tab routing
│   ├── index.css                # Tailwind CSS v4 styling & dark theme variants
│   ├── context/
│   │   └── HabitContext.jsx     # Central state management (activities, logs, theme)
│   ├── components/
│   │   ├── Navbar.jsx           # Top header with logo, navigation, theme & backup
│   │   ├── BottomNav.jsx        # Mobile thumb navigation
│   │   ├── ActivityModal.jsx    # Add / Edit activity modal with color & emoji picker
│   │   ├── BackupModal.jsx      # Export JSON/CSV and Import JSON
│   │   ├── ConfirmModal.jsx     # Safe generic deletion confirmation
│   │   └── ResetConfirmModal.jsx# Reset confirmation dialog
│   ├── views/
│   │   ├── TodayView.jsx        # Daily Tracking view (date nav, live %, big tick/cross)
│   │   ├── DashboardView.jsx    # All-time dashboard, streaks, Recharts bar & line
│   │   ├── MonthlyReportView.jsx# Heatmap, MoM comparison, performance rating, weekly bar
│   │   └── ManageActivitiesView.jsx # List, reorder, edit, delete habits
│   └── utils/
│       ├── dateUtils.js         # Date formatting, streaks, daily metrics calculation
│       ├── seedData.js          # 5 initial activities & 35 days of sample logs
│       ├── storage.js           # LocalStorage load/save, CSV/JSON exporters
│       └── confetti.js          # Canvas confetti celebration trigger
```
