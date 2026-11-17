import { SAMPLE_ACTIVITIES, generateSampleLogs } from './seedData.js';

const ACTIVITIES_KEY = 'habit_tracker_activities_v1';
const LOGS_KEY = 'habit_tracker_logs_v1';
const THEME_KEY = 'habit_tracker_theme_v1';

export function loadActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      saveActivities(SAMPLE_ACTIVITIES);
      return SAMPLE_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_ACTIVITIES;
  } catch (err) {
    console.error('Error loading activities from localStorage:', err);
    return SAMPLE_ACTIVITIES;
  }
}

export function saveActivities(activities) {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error('Error saving activities to localStorage:', err);
  }
}

export function loadLogs(activities = SAMPLE_ACTIVITIES) {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      const initialLogs = generateSampleLogs(activities);
      saveLogs(initialLogs);
      return initialLogs;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    const initialLogs = generateSampleLogs(activities);
    saveLogs(initialLogs);
    return initialLogs;
  } catch (err) {
    console.error('Error loading logs from localStorage:', err);
    return generateSampleLogs(activities);
  }
}

export function saveLogs(logs) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs to localStorage:', err);
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to system preference or dark for modern vibe
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Error saving theme to localStorage:', err);
  }
}

/**
 * Downloads a string content as a file in browser
 */
function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data as JSON file
 */
export function exportDataAsJson(activities, logs) {
  const exportPayload = {
    app: 'HabitTracker',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    activities,
    logs,
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(jsonStr, `habit-tracker-backup-${dateStr}.json`, 'application/json');
}

/**
 * Export data as CSV file
 */
export function exportDataAsCsv(activities, logs) {
  const activityMap = new Map(activities.map((a) => [a.id, a]));
  const rows = [
    ['Date', 'Activity Name', 'Emoji', 'Status', 'Daily Target']
  ];

  const sortedDates = Object.keys(logs).sort();

  sortedDates.forEach((dateKey) => {
    const dayLogs = logs[dateKey] || {};
    activities.forEach((activity) => {
      const status = dayLogs[activity.id] || 'pending';
      rows.push([
        dateKey,
        `"${(activity.name || '').replace(/"/g, '""')}"`,
        `"${activity.emoji || ''}"`,
        status,
        `"${(activity.target || '').replace(/"/g, '""')}"`,
      ]);
    });
  });

  const csvContent = rows.map((e) => e.join(',')).join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(csvContent, `habit-tracker-export-${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Validates and parses imported JSON string
 */
export function parseImportJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON format');
    }

    if (!Array.isArray(parsed.activities)) {
      throw new Error('Missing or invalid "activities" list in backup file');
    }

    if (!parsed.logs || typeof parsed.logs !== 'object') {
      throw new Error('Missing or invalid "logs" records in backup file');
    }

    return {
      activities: parsed.activities,
      logs: parsed.logs,
    };
  } catch (err) {
    throw new Error(err.message || 'Failed to parse JSON backup file');
  }
}

/**
 * Reset all data in localStorage
 */
export function clearAllStorage(reseed = false) {
  try {
    localStorage.removeItem(ACTIVITIES_KEY);
    localStorage.removeItem(LOGS_KEY);
    if (reseed) {
      saveActivities(SAMPLE_ACTIVITIES);
      const sampleLogs = generateSampleLogs(SAMPLE_ACTIVITIES);
      saveLogs(sampleLogs);
      return { activities: SAMPLE_ACTIVITIES, logs: sampleLogs };
    }
    return { activities: [], logs: {} };
  } catch (err) {
    console.error('Error clearing storage:', err);
    return { activities: [], logs: {} };
  }
}
