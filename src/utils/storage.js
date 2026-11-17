import { SAMPLE_ACTIVITIES, generateSampleLogs } from './seedData.js';

const getActivitiesKey = (userId = 'default') => `habit_tracker_activities_v2_${userId}`;
const getLogsKey = (userId = 'default') => `habit_tracker_logs_v2_${userId}`;
const THEME_KEY = 'habit_tracker_theme_v2';

export function loadActivities(userId = 'default') {
  try {
    const raw = localStorage.getItem(getActivitiesKey(userId));
    if (!raw) {
      // Legacy fallback check
      const legacyRaw = localStorage.getItem('habit_tracker_activities_v1');
      if (legacyRaw) {
        const parsedLegacy = JSON.parse(legacyRaw);
        saveActivities(parsedLegacy, userId);
        return parsedLegacy;
      }
      saveActivities(SAMPLE_ACTIVITIES, userId);
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

export function saveActivities(activities, userId = 'default') {
  try {
    localStorage.setItem(getActivitiesKey(userId), JSON.stringify(activities));
  } catch (err) {
    console.error('Error saving activities to localStorage:', err);
  }
}

export function loadLogs(activities = SAMPLE_ACTIVITIES, userId = 'default') {
  try {
    const raw = localStorage.getItem(getLogsKey(userId));
    if (!raw) {
      // Legacy fallback check
      const legacyRaw = localStorage.getItem('habit_tracker_logs_v1');
      if (legacyRaw) {
        const parsedLegacy = JSON.parse(legacyRaw);
        saveLogs(parsedLegacy, userId);
        return parsedLegacy;
      }
      const initialLogs = generateSampleLogs(activities);
      saveLogs(initialLogs, userId);
      return initialLogs;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    const initialLogs = generateSampleLogs(activities);
    saveLogs(initialLogs, userId);
    return initialLogs;
  } catch (err) {
    console.error('Error loading logs from localStorage:', err);
    return generateSampleLogs(activities);
  }
}

export function saveLogs(logs, userId = 'default') {
  try {
    localStorage.setItem(getLogsKey(userId), JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs to localStorage:', err);
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
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
export function exportDataAsJson(activities, logs, user = null) {
  const exportPayload = {
    app: 'HabitFlow',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    user: user ? { name: user.name, email: user.email } : null,
    activities,
    logs,
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(jsonStr, `habitflow-backup-${dateStr}.json`, 'application/json');
}

/**
 * Export data as CSV file
 */
export function exportDataAsCsv(activities, logs) {
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
  downloadFile(csvContent, `habitflow-export-${dateStr}.csv`, 'text/csv;charset=utf-8;');
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
 * Reset all data for a specific user
 */
export function clearAllStorage(userId = 'default', reseed = false) {
  try {
    localStorage.removeItem(getActivitiesKey(userId));
    localStorage.removeItem(getLogsKey(userId));
    if (reseed) {
      saveActivities(SAMPLE_ACTIVITIES, userId);
      const sampleLogs = generateSampleLogs(SAMPLE_ACTIVITIES);
      saveLogs(sampleLogs, userId);
      return { activities: SAMPLE_ACTIVITIES, logs: sampleLogs };
    }
    return { activities: [], logs: {} };
  } catch (err) {
    console.error('Error clearing storage:', err);
    return { activities: [], logs: {} };
  }
}
