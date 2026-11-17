import React, { useState } from 'react';
import { 
  CheckCircle2, 
  BarChart3, 
  Calendar, 
  ListOrdered, 
  Sun, 
  Moon, 
  DownloadCloud, 
  RotateCcw,
  Flame,
  Plus
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import BackupModal from './BackupModal';
import ResetConfirmModal from './ResetConfirmModal';
import ActivityModal from './ActivityModal';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    streakMetrics,
    exportJson,
    exportCsv,
    importBackup,
    resetAllData,
    addActivity
  } = useHabits();

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const navLinks = [
    { id: 'today', label: 'Daily Tracking', icon: CheckCircle2 },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'monthly', label: 'Monthly Report', icon: Calendar },
    { id: 'activities', label: 'Manage Activities', icon: ListOrdered },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('today')}
                className="flex items-center gap-2.5 group focus:outline-hidden text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                      Habit<span className="text-blue-600 dark:text-blue-400">Flow</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hidden sm:inline-block">
                      Tracker
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
                    Build consistency every day
                  </p>
                </div>
              </button>

              {/* Streak Badge in Navbar */}
              {streakMetrics.currentStreak > 0 && (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold animate-in fade-in">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>{streakMetrics.currentStreak} Day Streak</span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/60 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions: Add Habit, Theme Toggle, Backup, Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 active:scale-95 transition-all"
                title="Add new activity"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Activity</span>
              </button>

              <button
                onClick={() => setIsBackupOpen(true)}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Backup / Export / Import"
              >
                <DownloadCloud className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsResetOpen(true)}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Reset or Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-700 hover:-rotate-12 transition-transform" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Modals */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
        onImport={importBackup}
      />

      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onReset={resetAllData}
      />

      <ActivityModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={addActivity}
      />
    </>
  );
}
