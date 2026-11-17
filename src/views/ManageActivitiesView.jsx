import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Pencil, 
  Trash2, 
  Target, 
  Sparkles,
  GripVertical,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import ActivityModal from '../components/ActivityModal';
import ConfirmModal from '../components/ConfirmModal';

export default function ManageActivitiesView() {
  const { 
    activities, 
    logs, 
    addActivity, 
    updateActivity, 
    deleteActivity, 
    moveActivity 
  } = useHabits();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);

  // Compute all-time stats for each activity
  const getActivityStats = (activityId) => {
    let completed = 0;
    let missed = 0;
    Object.values(logs).forEach((dayLogs) => {
      if (!dayLogs) return;
      if (dayLogs[activityId] === 'completed') completed++;
      else if (dayLogs[activityId] === 'missed') missed++;
    });
    const total = completed + missed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, missed, total, rate };
  };

  const handleEditSave = (data) => {
    if (editingActivity) {
      updateActivity(editingActivity.id, data);
      setEditingActivity(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingActivity) {
      deleteActivity(deletingActivity.id);
      setDeletingActivity(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header with Title & Add Button */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Manage Activities
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Add new habits, customize colors and emojis, reorder their display, or edit targets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Activity</span>
        </button>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No Activities Configured
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
            Get started by adding your first daily habit or routine!
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const stats = getActivityStats(activity.id);
            const isFirst = index === 0;
            const isLast = index === activities.length - 1;

            return (
              <div
                key={activity.id}
                className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left Accent color bar */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-1.5"
                  style={{ backgroundColor: activity.color || '#3B82F6' }}
                />

                {/* Left section: Reorder controls + Info */}
                <div className="flex items-center gap-3 sm:gap-4 pl-1">
                  
                  {/* Up / Down Reorder buttons */}
                  <div className="flex flex-col gap-1 items-center shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveActivity(activity.id, -1)}
                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                        isFirst
                          ? 'border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                          : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 active:scale-95'
                      }`}
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveActivity(activity.id, 1)}
                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                        isLast
                          ? 'border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                          : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 active:scale-95'
                      }`}
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Emoji Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs border border-zinc-100 dark:border-zinc-800"
                    style={{ backgroundColor: `${activity.color || '#3B82F6'}18` }}
                  >
                    {activity.emoji || '⭐'}
                  </div>

                  {/* Name, Target & Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {activity.name}
                      </h4>
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: activity.color || '#3B82F6' }}
                        title={`Color: ${activity.color}`}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {activity.target && (
                        <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                          <Target className="w-3.5 h-3.5 text-zinc-400" />
                          Target: {activity.target}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {stats.completed} completions ({stats.rate}%)
                      </span>
                    </div>
                  </div>

                </div>

                {/* Right section: Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingActivity(activity)}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Pencil className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingActivity(activity)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <ActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addActivity}
      />

      {/* Edit Modal */}
      <ActivityModal
        isOpen={Boolean(editingActivity)}
        onClose={() => setEditingActivity(null)}
        onSave={handleEditSave}
        activity={editingActivity}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingActivity)}
        onClose={() => setDeletingActivity(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        message={`Are you sure you want to delete "${deletingActivity?.name}"? You will lose its display in daily tracking.`}
        confirmText="Delete Activity"
        confirmVariant="danger"
      />

    </div>
  );
}
