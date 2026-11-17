import React from 'react';
import { RotateCcw, Trash2, X, Sparkles } from 'lucide-react';

export default function ResetConfirmModal({ isOpen, onClose, onReset }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Reset Tracker Data
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose how you want to reset your local data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Option 1: Reset to default sample habits and demo data */}
          <button
            onClick={() => {
              onReset(true);
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 hover:border-blue-500 dark:hover:border-blue-500/60 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Reset to 5 Sample Habits
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Restores 5 sample activities and 35 days of history for instant chart visualization.
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Clean wipe */}
          <button
            onClick={() => {
              onReset(false);
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 hover:border-rose-500 dark:hover:border-rose-500/60 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  Wipe Everything Clean
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Deletes all habits and daily logs. Starts with a completely empty tracker.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
