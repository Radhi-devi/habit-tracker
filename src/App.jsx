import React from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import TodayView from './views/TodayView';
import DashboardView from './views/DashboardView';
import MonthlyReportView from './views/MonthlyReportView';
import ManageActivitiesView from './views/ManageActivitiesView';
import { ShieldCheck, WifiOff } from 'lucide-react';

function TrackerContent() {
  const { activeTab } = useHabits();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'today' && <TodayView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'monthly' && <MonthlyReportView />}
        {activeTab === 'activities' && <ManageActivitiesView />}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-4 px-4 text-center text-xs text-zinc-400 dark:text-zinc-500 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline & Private
            </span>
            <span>•</span>
            <span>Stored in your browser's localStorage</span>
          </div>
          <div>
            <span>Habit & Activity Tracker • React + Vite + Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Nav */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <HabitProvider>
      <TrackerContent />
    </HabitProvider>
  );
}
