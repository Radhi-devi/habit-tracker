import { toDateKey, shiftDateKey, getTodayKey } from './dateUtils.js';

export const SAMPLE_ACTIVITIES = [
  {
    id: 'act_gym_1',
    name: 'Gym / Workout',
    emoji: '🏋️',
    color: '#EF4444', // Red / Rose
    target: '45 mins',
    order: 0,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'act_reading_2',
    name: 'Reading',
    emoji: '📚',
    color: '#3B82F6', // Blue
    target: '20 pages',
    order: 1,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'act_coding_3',
    name: 'Coding',
    emoji: '💻',
    color: '#8B5CF6', // Purple
    target: '1 hour',
    order: 2,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'act_water_4',
    name: 'Water 3L',
    emoji: '💧',
    color: '#06B6D4', // Cyan
    target: '3 Liters',
    order: 3,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'act_sleep_5',
    name: 'Sleep by 11 PM',
    emoji: '😴',
    color: '#10B981', // Emerald
    target: '8 hrs sleep',
    order: 4,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
];

/**
 * Generates realistic sample history for the past 35 days
 * This ensures both current month and previous month have data for comparisons,
 * charts, streaks, and calendar heatmap.
 */
export function generateSampleLogs(activities = SAMPLE_ACTIVITIES) {
  const logs = {};
  const todayKey = getTodayKey();

  // Pseudo-random but deterministic pattern based on day offset
  // so it stays consistent on initial render
  const activityIds = activities.map((a) => a.id);

  // Generate for days -34 up to 0 (today)
  for (let offset = 34; offset >= 0; offset--) {
    const dateKey = shiftDateKey(todayKey, -offset);
    logs[dateKey] = {};

    // For today (offset 0), let's mark 3 completed, 1 pending, 1 missed for interactive testing
    if (offset === 0) {
      logs[dateKey][activityIds[0]] = 'completed'; // Gym done
      logs[dateKey][activityIds[1]] = 'completed'; // Reading done
      logs[dateKey][activityIds[2]] = 'completed'; // Coding done
      logs[dateKey][activityIds[3]] = 'missed';    // Water missed
      // activityIds[4] (Sleep) left pending
      continue;
    }

    // For past days, generate a realistic completion distribution
    // Higher completion on some days, occasional missed days
    const daySeed = (offset * 17 + 23) % 100;

    activityIds.forEach((actId, index) => {
      // Different habits have different completion probabilities
      // e.g. Water is high (85%), Sleep is medium (70%), Gym is 75%
      let baseChance = 75;
      if (actId.includes('water')) baseChance = 88;
      if (actId.includes('reading')) baseChance = 82;
      if (actId.includes('gym')) baseChance = 74;
      if (actId.includes('coding')) baseChance = 78;
      if (actId.includes('sleep')) baseChance = 65;

      // Slight variation by day
      const randVal = ((daySeed + index * 29 + offset * 7) % 100);

      if (randVal < baseChance) {
        logs[dateKey][actId] = 'completed';
      } else {
        logs[dateKey][actId] = 'missed';
      }
    });
  }

  return logs;
}
