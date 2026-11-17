import React from 'react';
import { RotateCcw, Trash2, X, Sparkles } from 'lucide-react';

export default function ResetConfirmModal({ isOpen, onClose, onReset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#110e1f] border border-purple-200 dark:border-purple-900/50 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                Reset Tracker Data
              </h3>
              <p className="text-xs text-purple-700/80 dark:text-purple-300/80 font-medium">
                Choose how you want to reset your account data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <button
            onClick={() => {
              onReset(true);
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl border border-purple-200/80 dark:border-purple-900/60 hover:border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Reset to 5 Sample Habits
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Restores 5 sample activities and 35 days of history for instant chart visualization.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onReset(false);
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-100/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  Wipe Everything Clean
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Deletes all habits and daily logs for this account. Starts fresh.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-purple-100 dark:border-purple-900/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
