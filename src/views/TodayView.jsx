import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Plus, 
  Flame, 
  Target, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { 
  shiftDateKey, 
  getTodayKey, 
  formatDisplayDate, 
  getDailyMetrics 
} from '../utils/dateUtils.js';
import ActivityModal from '../components/ActivityModal';

export default function TodayView() {
  const { 
    activities, 
    logs, 
    selectedDate, 
    setSelectedDate, 
    toggleActivityStatus,
    addActivity,
    streakMetrics,
  } = useHabits();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const todayKey = getTodayKey();
  const isViewingToday = selectedDate === todayKey;

  // Day's metrics
  const dayLogs = logs[selectedDate] || {};
  const metrics = getDailyMetrics(selectedDate, activities, logs);

  const handlePrevDay = () => {
    setSelectedDate(shiftDateKey(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(shiftDateKey(selectedDate, 1));
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  const jumpToToday = () => {
    setSelectedDate(todayKey);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Date Header & Navigator */}
      <div className="bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Day Navigation */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePrevDay}
              className="p-2.5 rounded-xl border border-purple-200/70 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center sm:text-left px-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {formatDisplayDate(selectedDate, { relative: true })}
                </h2>
                {isViewingToday && (
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                    Live Today
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                {formatDisplayDate(selectedDate)}
              </p>
            </div>

            <button
              onClick={handleNextDay}
              className="p-2.5 rounded-xl border border-purple-200/70 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Date Picker & Today Shortcut */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {!isViewingToday && (
              <button
                onClick={jumpToToday}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jump to Today</span>
              </button>
            )}

            {/* Native date input styled as button */}
            <div className="relative">
              <label 
                htmlFor="date-picker-input" 
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-200/70 dark:border-purple-900/50 bg-white dark:bg-[#110e1f] text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer transition-all active:scale-95"
              >
                <CalendarIcon className="w-4 h-4 text-purple-500" />
                <span>Pick Date</span>
              </label>
              <input
                id="date-picker-input"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Progress & Live Percentage Bar */}
      <div className="bg-gradient-to-br from-white via-purple-50/20 to-purple-100/30 dark:from-[#110e1f] dark:via-[#110e1f] dark:to-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800/60 dark:text-purple-300/60">
                {isViewingToday ? "Today's Progress" : "Day Progress"}
              </span>
              {metrics.percentage === 100 && metrics.total > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-bounce">
                  <Sparkles className="w-3 h-3" /> Perfect Day!
                </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white font-sans">
                {metrics.percentage}%
              </span>
              <span className="text-xs sm:text-sm font-semibold text-purple-700/80 dark:text-purple-300/80">
                ({metrics.completed} of {metrics.total} completed)
              </span>
            </div>
          </div>

          {/* Quick status counters */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {metrics.completed} Done
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                {metrics.missed} Missed
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {metrics.pending} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar with smooth purple gradient fill */}
        <div className="mt-5 w-full bg-purple-100/60 dark:bg-purple-950/50 h-3.5 rounded-full overflow-hidden p-0.5 border border-purple-200/40 dark:border-purple-900/30">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              metrics.percentage >= 100
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-400 shadow-md shadow-purple-500/40'
                : metrics.percentage >= 60
                ? 'bg-gradient-to-r from-purple-600 to-violet-500'
                : metrics.percentage > 0
                ? 'bg-gradient-to-r from-amber-500 to-purple-500'
                : 'bg-transparent'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, metrics.percentage))}%` }}
          />
        </div>
      </div>

      {/* Activity List Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-purple-800/70 dark:text-purple-300/70">
            Activities ({activities.length})
          </h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No Activities Yet
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
              Add your habits or daily targets (like Workout, Reading, Coding, Hydration) to start tracking!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs shadow-purple-600/30 transition-all active:scale-95"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activities.map((activity) => {
              const status = dayLogs[activity.id];
              const isCompleted = status === 'completed';
              const isMissed = status === 'missed';

              return (
                <div
                  key={activity.id}
                  className={`group relative overflow-hidden bg-white dark:bg-[#110e1f] border transition-all duration-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
                      : isMissed
                      ? 'border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10 shadow-xs'
                      : 'border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-800'
                  }`}
                >
                  {/* Left accent color bar */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-1.5"
                    style={{ backgroundColor: activity.color || '#8B5CF6' }}
                  />

                  {/* Activity Info */}
                  <div className="flex items-center gap-3.5 pl-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs border border-purple-100 dark:border-purple-900/30 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${activity.color || '#8B5CF6'}18`,
                      }}
                    >
                      {activity.emoji || '⭐'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {activity.name}
                        </h4>
                        {isCompleted && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                        {isMissed && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                            Missed
                          </span>
                        )}
                      </div>

                      {activity.target ? (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5 font-medium">
                          <Target className="w-3.5 h-3.5 text-purple-400" />
                          Target: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{activity.target}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                          Daily Habit
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Two BIG Action Buttons: Tick & Cross */}
                  <div className="flex items-center gap-3 self-end sm:self-center w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => toggleActivityStatus(activity.id, 'completed')}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-[#110e1f]'
                          : 'bg-zinc-100 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-950/30 text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border border-zinc-200 dark:border-zinc-700'
                      }`}
                      title={isCompleted ? 'Click to uncheck (set back to pending)' : 'Mark as Completed'}
                    >
                      <Check className={`w-5 h-5 ${isCompleted ? 'stroke-[3]' : 'stroke-2'}`} />
                      <span>{isCompleted ? 'Done' : 'Complete'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleActivityStatus(activity.id, 'missed')}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 cursor-pointer ${
                        isMissed
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-[#110e1f]'
                          : 'bg-zinc-100 hover:bg-rose-50 dark:bg-zinc-800 dark:hover:bg-rose-950/30 text-zinc-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 border border-zinc-200 dark:border-zinc-700'
                      }`}
                      title={isMissed ? 'Click to uncheck (set back to pending)' : 'Mark as Not Completed'}
                    >
                      <X className={`w-5 h-5 ${isMissed ? 'stroke-[3]' : 'stroke-2'}`} />
                      <span>{isMissed ? 'Missed' : 'Not Done'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      <ActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addActivity}
      />
    </div>
  );
}
