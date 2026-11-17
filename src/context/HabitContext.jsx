import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  loadActivities,
  saveActivities,
  loadLogs,
  saveLogs,
  loadTheme,
  saveTheme,
  clearAllStorage,
  exportDataAsJson,
  exportDataAsCsv,
} from '../utils/storage.js';
import { getTodayKey, getDailyMetrics, calculateStreaks } from '../utils/dateUtils.js';
import { triggerCelebration } from '../utils/confetti.js';
import { useAuth } from './AuthContext';
import { initFirebaseService, doc, setDoc, getDoc, onSnapshot } from '../utils/firebase.js';

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.id : 'guest';

  // Theme state
  const [theme, setThemeState] = useState(() => loadTheme());

  // Apply theme class to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Activities state per user
  const [activities, setActivities] = useState(() => {
    const loaded = loadActivities(userId);
    return [...loaded].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  });

  // Logs state per user
  const [logs, setLogs] = useState(() => loadLogs(activities, userId));

  // Selected date for daily tracking
  const [selectedDate, setSelectedDate] = useState(() => getTodayKey());

  // Active navigation tab: 'today' | 'dashboard' | 'monthly' | 'activities'
  const [activeTab, setActiveTab] = useState('today');

  // Reload activities and logs when userId changes
  useEffect(() => {
    const userActs = loadActivities(userId);
    const sorted = [...userActs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setActivities(sorted);
    setLogs(loadLogs(sorted, userId));

    // If Firebase cloud user, subscribe to Firestore document
    const service = initFirebaseService();
    if (service.isReady && service.db && currentUser?.isCloud) {
      try {
        const userDocRef = doc(service.db, 'users', userId);
        const unsub = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.activities && Array.isArray(data.activities)) {
              setActivities(data.activities);
              saveActivities(data.activities, userId);
            }
            if (data.logs && typeof data.logs === 'object') {
              setLogs(data.logs);
              saveLogs(data.logs, userId);
            }
          }
        });
        return () => unsub();
      } catch (err) {
        console.error('Firestore sync error:', err);
      }
    }
  }, [userId]);

  // Sync to Cloud Firestore if connected
  const syncToCloud = async (newActivities, newLogs) => {
    const service = initFirebaseService();
    if (service.isReady && service.db && currentUser?.isCloud) {
      try {
        const userDocRef = doc(service.db, 'users', userId);
        await setDoc(userDocRef, {
          activities: newActivities,
          logs: newLogs,
          updatedAt: new Date().toISOString(),
          email: currentUser.email,
          name: currentUser.name,
        }, { merge: true });
      } catch (err) {
        console.error('Failed to sync to Firestore:', err);
      }
    }
  };

  // Keep localStorage and Cloud updated when activities change
  const updateActivitiesState = (newActivities) => {
    const sorted = [...newActivities].map((act, idx) => ({
      ...act,
      order: idx,
    }));
    setActivities(sorted);
    saveActivities(sorted, userId);
    syncToCloud(sorted, logs);
  };

  // Keep localStorage and Cloud updated when logs change
  const updateLogsState = (newLogs) => {
    setLogs(newLogs);
    saveLogs(newLogs, userId);
    syncToCloud(activities, newLogs);
  };

  // Toggle or switch an activity's status for the selected date
  const toggleActivityStatus = (activityId, desiredStatus, targetDate = selectedDate) => {
    setLogs((prevLogs) => {
      const dateLogs = { ...(prevLogs[targetDate] || {}) };
      const currentStatus = dateLogs[activityId];

      if (currentStatus === desiredStatus) {
        // Tapping again clears the selection back to pending
        delete dateLogs[activityId];
      } else {
        // Switch to the desired status ('completed' or 'missed')
        dateLogs[activityId] = desiredStatus;
      }

      const nextLogs = {
        ...prevLogs,
        [targetDate]: dateLogs,
      };

      // Check if all activities are completed today for celebration
      if (desiredStatus === 'completed' && currentStatus !== 'completed') {
        const metrics = getDailyMetrics(targetDate, activities, nextLogs);
        if (metrics.total > 0 && metrics.completed === metrics.total) {
          triggerCelebration();
        }
      }

      saveLogs(nextLogs, userId);
      syncToCloud(activities, nextLogs);
      return nextLogs;
    });
  };

  // Add new activity
  const addActivity = ({ name, emoji = '⭐', color = '#8B5CF6', target = '' }) => {
    const newId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newActivity = {
      id: newId,
      name: name.trim(),
      emoji: emoji.trim() || '⭐',
      color: color || '#8B5CF6',
      target: target.trim(),
      order: activities.length,
      createdAt: new Date().toISOString(),
    };

    const nextActivities = [...activities, newActivity];
    updateActivitiesState(nextActivities);
    return newActivity;
  };

  // Edit an existing activity
  const updateActivity = (id, fields) => {
    const nextActivities = activities.map((act) => {
      if (act.id === id) {
        return {
          ...act,
          ...fields,
          name: fields.name !== undefined ? fields.name.trim() : act.name,
          emoji: fields.emoji !== undefined ? fields.emoji.trim() : act.emoji,
          target: fields.target !== undefined ? fields.target.trim() : act.target,
        };
      }
      return act;
    });
    updateActivitiesState(nextActivities);
  };

  // Delete an activity
  const deleteActivity = (id) => {
    const filtered = activities.filter((act) => act.id !== id);
    updateActivitiesState(filtered);
  };

  // Move activity up or down
  const moveActivity = (id, direction) => {
    const index = activities.findIndex((a) => a.id === id);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= activities.length) return;

    const reordered = [...activities];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    updateActivitiesState(reordered);
  };

  // Reset all data for current user
  const resetAllData = (withSeed = true) => {
    const { activities: newActs, logs: newLogs } = clearAllStorage(userId, withSeed);
    setActivities(newActs);
    setLogs(newLogs);
    setSelectedDate(getTodayKey());
    syncToCloud(newActs, newLogs);
  };

  // Import backup
  const importBackup = ({ activities: importedActs, logs: importedLogs }) => {
    const sorted = [...importedActs].map((act, idx) => ({
      ...act,
      order: act.order ?? idx,
    }));
    updateActivitiesState(sorted);
    updateLogsState(importedLogs);
  };

  // Export helpers
  const handleExportJson = () => exportDataAsJson(activities, logs, currentUser);
  const handleExportCsv = () => exportDataAsCsv(activities, logs);

  // Computed metrics for currently selected date
  const selectedDateMetrics = useMemo(() => {
    return getDailyMetrics(selectedDate, activities, logs);
  }, [selectedDate, activities, logs]);

  // Overall streaks
  const streakMetrics = useMemo(() => {
    return calculateStreaks(activities, logs);
  }, [activities, logs]);

  return (
    <HabitContext.Provider
      value={{
        activities,
        logs,
        selectedDate,
        setSelectedDate,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        toggleActivityStatus,
        addActivity,
        updateActivity,
        deleteActivity,
        moveActivity,
        resetAllData,
        importBackup,
        exportJson: handleExportJson,
        exportCsv: handleExportCsv,
        selectedDateMetrics,
        streakMetrics,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
