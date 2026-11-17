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
  Plus,
  User,
  LogOut,
  LogIn,
  Cloud,
  ChevronDown
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import BackupModal from './BackupModal';
import ResetConfirmModal from './ResetConfirmModal';
import ActivityModal from './ActivityModal';
import AuthModal from './AuthModal';
import CloudSyncModal from './CloudSyncModal';

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

  const { 
    currentUser, 
    isAuthenticated, 
    logout, 
    isCloudEnabled,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCloudModalOpen,
    setIsCloudModalOpen,
  } = useAuth();

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { id: 'today', label: 'Daily Tracking', icon: CheckCircle2 },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'monthly', label: 'Monthly Report', icon: Calendar },
    { id: 'activities', label: 'Manage Activities', icon: ListOrdered },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0c0a17]/85 backdrop-blur-md border-b border-purple-100 dark:border-purple-950/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('today')}
                className="flex items-center gap-2.5 group focus:outline-hidden text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                      Habit<span className="text-purple-600 dark:text-purple-400">Flow</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25 hidden sm:inline-block">
                      Purple Edition
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-0.5 hidden sm:block">
                    Elevate your daily habits
                  </p>
                </div>
              </button>

              {/* Streak Badge */}
              {streakMetrics.currentStreak > 0 && (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold animate-in fade-in">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>{streakMetrics.currentStreak} Day Streak</span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-purple-50/60 dark:bg-purple-950/30 p-1 rounded-xl border border-purple-200/50 dark:border-purple-900/40">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white dark:bg-purple-900/70 text-purple-700 dark:text-purple-200 shadow-xs shadow-purple-900/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions: Add Habit, User Profile, Theme, Backup, Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs shadow-purple-600/30 active:scale-95 transition-all"
                title="Add new activity"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Activity</span>
              </button>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-xl border border-purple-200/70 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                  title="Account & Sync"
                >
                  <span className="text-base">{currentUser?.avatar || '👤'}</span>
                  <span className="hidden lg:inline-block max-w-[90px] truncate">
                    {currentUser?.name || 'Sign In'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#110e1f] border border-purple-200 dark:border-purple-900/50 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="p-2 border-b border-purple-100 dark:border-purple-900/30 mb-1">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                        <span>{currentUser?.name || 'Guest User'}</span>
                        {isCloudEnabled && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                            Cloud Live
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {currentUser?.email || 'Local Storage Profile'}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5 text-purple-500" />
                      <span>{isAuthenticated ? 'Switch Account' : 'Sign In / Register'}</span>
                    </button>

                    <button
                      onClick={() => setIsCloudModalOpen(true)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 flex items-center gap-2"
                    >
                      <Cloud className="w-3.5 h-3.5 text-violet-500" />
                      <span>Cross-Browser Sync</span>
                    </button>

                    {isAuthenticated && (
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 mt-1 border-t border-purple-100 dark:border-purple-900/30 pt-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Backup & Reset buttons */}
              <button
                onClick={() => setIsBackupOpen(true)}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                title="Backup / Export / Import"
              >
                <DownloadCloud className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsResetOpen(true)}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                title="Reset or Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-purple-700 hover:-rotate-12 transition-transform" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />

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
