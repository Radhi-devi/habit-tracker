// Utility functions for dates, streak calculations, and formatting

/**
 * Returns a date object in local YYYY-MM-DD string format
 */
export function toDateKey(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD to a local Date object (avoiding timezone offset issues)
 */
export function parseDateKey(dateKey) {
  if (!dateKey) return new Date();
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Returns today's date key YYYY-MM-DD
 */
export function getTodayKey() {
  return toDateKey(new Date());
}

/**
 * Shifts dateKey by n days (positive or negative)
 */
export function shiftDateKey(dateKey, days) {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

/**
 * Format dateKey for display: "Today, Nov 17" or "Tuesday, Nov 17, 2026"
 */
export function formatDisplayDate(dateKey, options = {}) {
  const d = parseDateKey(dateKey);
  const todayKey = getTodayKey();
  const yesterdayKey = shiftDateKey(todayKey, -1);
  const tomorrowKey = shiftDateKey(todayKey, 1);

  if (options.relative) {
    if (dateKey === todayKey) return 'Today';
    if (dateKey === yesterdayKey) return 'Yesterday';
    if (dateKey === tomorrowKey) return 'Tomorrow';
  }

  const defaultOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return d.toLocaleDateString(undefined, defaultOptions);
}

/**
 * Returns month names
 */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Returns all date keys in a given month (year, month: 0-indexed)
 */
export function getDatesInMonth(year, month) {
  const dates = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    dates.push(toDateKey(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

/**
 * Calculates daily completion metrics for a single date
 */
export function getDailyMetrics(dateKey, activities, logs) {
  const dayLogs = logs[dateKey] || {};
  const total = activities.length;
  if (total === 0) {
    return { total: 0, completed: 0, missed: 0, pending: 0, percentage: 0 };
  }

  let completed = 0;
  let missed = 0;

  activities.forEach((act) => {
    const status = dayLogs[act.id];
    if (status === 'completed') completed++;
    else if (status === 'missed') missed++;
  });

  const pending = total - (completed + missed);
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, missed, pending, percentage };
}

/**
 * Calculates overall current streak and best streak across all logged days
 * A qualifying day is one with completion percentage >= 50% (or at least 1 completed habit if total < 2)
 */
export function calculateStreaks(activities, logs) {
  if (!activities || activities.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Get all dates that have at least one log entry
  const recordedDates = Object.keys(logs).filter((dateKey) => {
    const dayLogs = logs[dateKey];
    return dayLogs && Object.keys(dayLogs).length > 0;
  });

  if (recordedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Check if a date qualifies
  const isQualifyingDay = (dateKey) => {
    const { percentage, completed } = getDailyMetrics(dateKey, activities, logs);
    return percentage >= 50 || completed >= 1;
  };

  // Find sorted unique dates
  const sortedDates = [...new Set(recordedDates)].sort();

  // Calculate best streak across all continuous blocks
  let bestStreak = 0;
  let currentBlock = 0;

  if (sortedDates.length > 0) {
    let checkDate = parseDateKey(sortedDates[0]);
    const lastDate = parseDateKey(sortedDates[sortedDates.length - 1]);

    while (checkDate <= lastDate) {
      const key = toDateKey(checkDate);
      if (isQualifyingDay(key)) {
        currentBlock++;
        if (currentBlock > bestStreak) bestStreak = currentBlock;
      } else {
        currentBlock = 0;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
  }

  // Calculate current streak ending today or yesterday
  const todayKey = getTodayKey();
  const yesterdayKey = shiftDateKey(todayKey, -1);

  let currentStreak = 0;
  let cursorKey = todayKey;

  // If today has activity and qualifies, start from today
  // Otherwise if today has no activity yet (or not qualifying), start checking from yesterday
  if (isQualifyingDay(todayKey)) {
    cursorKey = todayKey;
  } else {
    // Check if today is just pending (nothing logged yet today)
    const todayLogs = logs[todayKey];
    const todayHasLogged = todayLogs && Object.keys(todayLogs).length > 0;
    if (!todayHasLogged && isQualifyingDay(yesterdayKey)) {
      cursorKey = yesterdayKey;
    } else {
      cursorKey = null;
    }
  }

  if (cursorKey) {
    let testKey = cursorKey;
    while (isQualifyingDay(testKey)) {
      currentStreak++;
      testKey = shiftDateKey(testKey, -1);
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}

/**
 * Returns performance evaluation label and style
 */
export function getPerformanceRating(percentage) {
  if (percentage >= 90) {
    return {
      label: 'Excellent',
      badge: '🌟 Excellent',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      description: 'Exceptional consistency! You are crushing your daily goals.',
    };
  }
  if (percentage >= 70) {
    return {
      label: 'Good',
      badge: '💪 Good',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      description: 'Solid momentum! Keep up this great pace.',
    };
  }
  if (percentage >= 50) {
    return {
      label: 'Average',
      badge: '⚖️ Average',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      description: 'Making progress! Aim to turn those missed habits into wins.',
    };
  }
  return {
    label: 'Needs Improvement',
    badge: '🌱 Needs Improvement',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    description: 'Every journey starts small. Focus on completing 1-2 key habits today.',
  };
}
