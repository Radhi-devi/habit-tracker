import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target, Palette, Smile } from 'lucide-react';

const POPULAR_EMOJIS = [
  '🏋️', '📚', '💻', '💧', '😴', '🧘', '🏃', '🥗',
  '✍️', '🎯', '🍎', '🚴', '🧹', '💊', '🎨', '🧠',
  '☀️', '🚶', '🥑', '🍵', '🎸', '🏊', '🐶', '🔥'
];

const PRESET_COLORS = [
  '#8B5CF6', // Purple
  '#6D28D9', // Deep Violet
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F97316', // Orange
  '#EF4444', // Red
  '#64748B', // Slate
];

const TARGET_PRESETS = [
  '30 mins', '1 hour', '20 pages', '3 Liters', '10,000 steps', 'Before 11 PM'
];

export default function ActivityModal({ isOpen, onClose, onSave, activity = null }) {
  const isEdit = Boolean(activity);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [color, setColor] = useState('#8B5CF6');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setName(activity.name || '');
      setEmoji(activity.emoji || '⭐');
      setColor(activity.color || '#8B5CF6');
      setTarget(activity.target || '');
    } else {
      setName('');
      setEmoji('⭐');
      setColor('#8B5CF6');
      setTarget('');
    }
    setError('');
  }, [activity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an activity name');
      return;
    }
    onSave({
      name: name.trim(),
      emoji: emoji.trim() || '⭐',
      color,
      target: target.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#110e1f] border border-purple-200 dark:border-purple-900/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-900/30 bg-purple-500/5">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-xs"
              style={{ backgroundColor: `${color}25`, color }}
            >
              {emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {isEdit ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              <p className="text-xs text-purple-700/80 dark:text-purple-300/80 font-medium">
                {isEdit ? 'Update your habit details' : 'Create a new habit or daily goal to track'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl border border-dashed border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-xl bg-white dark:bg-[#1a142e] shadow-xs border border-purple-100 dark:border-purple-900/50">
                {emoji || '⭐'}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700/70 dark:text-purple-300/70">Live Preview</span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {name || 'Activity Name'}
                </h4>
                {target && (
                  <span className="inline-flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300 font-medium mt-0.5">
                    <Target className="w-3 h-3 text-purple-500" />
                    Target: {target}
                  </span>
                )}
              </div>
            </div>
            <div
              className="w-4 h-10 rounded-full shadow-xs"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Name input */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Activity Name <span className="text-purple-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Morning Workout, Read 20 Pages, Drink Water"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all"
              autoFocus
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-purple-500" /> Emoji / Icon
              </label>
              <span className="text-xs text-zinc-400">Pick below or type custom</span>
            </div>
            
            <div className="flex gap-2 items-center mb-2.5">
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="w-16 text-center text-xl py-2 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-xs text-zinc-500 font-medium">Selected Emoji</span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 p-2 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl max-h-32 overflow-y-auto">
              {POPULAR_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`p-2 text-xl rounded-lg transition-transform hover:scale-115 flex items-center justify-center cursor-pointer ${
                    emoji === em
                      ? 'bg-purple-500/25 ring-2 ring-purple-600'
                      : 'hover:bg-purple-100/60 dark:hover:bg-purple-900/40'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-500" /> Color Accent
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-zinc-500">{color}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer ${
                    color.toLowerCase() === c.toLowerCase()
                      ? 'scale-115 ring-2 ring-offset-2 ring-purple-600 dark:ring-purple-400'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Daily Target */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-500" /> Daily Target (Optional)
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 45 mins, 20 pages, 3 Liters, Before 11 PM"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-purple-900/40 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all"
            />
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TARGET_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setTarget(p)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
                >
                  +{p}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-100 dark:border-purple-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 shadow-md shadow-purple-600/30 rounded-xl transition-all cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
