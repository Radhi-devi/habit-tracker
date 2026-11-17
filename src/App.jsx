import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider, useHabits } from './context/HabitContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import TodayView from './views/TodayView';
import DashboardView from './views/DashboardView';
import MonthlyReportView from './views/MonthlyReportView';
import ManageActivitiesView from './views/ManageActivitiesView';
import { ShieldCheck, Sparkles, Cloud } from 'lucide-react';
import { useAuth } from './context/AuthContext';

function TrackerContent() {
  const { activeTab } = useHabits();
  const { isCloudEnabled, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#0b0914] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-purple-500 selection:text-white">
      {/* Background ambient purple glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-500/10 dark:bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

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
      <footer className="border-t border-purple-100 dark:border-purple-950/60 py-4 px-4 text-center text-xs text-zinc-400 dark:text-zinc-500 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
              <Sparkles className="w-3.5 h-3.5" /> HabitFlow Purple Edition
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {isCloudEnabled ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5" /> Cloud Sync Active
                </span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Account: {currentUser?.name || 'Local'}
                </span>
              )}
            </span>
          </div>
          <div>
            <span>Cross-Browser Ready • React + Vite + Tailwind CSS</span>
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
    <AuthProvider>
      <HabitProvider>
        <TrackerContent />
      </HabitProvider>
    </AuthProvider>
  );
}
