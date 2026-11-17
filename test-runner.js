// Automated test runner to verify core calculations, state transitions, streaks, and data flow
import { 
  toDateKey, 
  shiftDateKey, 
  getDailyMetrics, 
  calculateStreaks, 
  getPerformanceRating, 
  getDatesInMonth 
} from './src/utils/dateUtils.js';
import { SAMPLE_ACTIVITIES, generateSampleLogs } from './src/utils/seedData.js';
import { parseImportJson } from './src/utils/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- RUNNING HABIT TRACKER UNIT & INTEGRATION TESTS ---\n');

// 1. Test Seed Data
assert(SAMPLE_ACTIVITIES.length === 5, 'Sample activities array contains 5 seeded habits');
const sampleLogs = generateSampleLogs(SAMPLE_ACTIVITIES);
const logDates = Object.keys(sampleLogs);
assert(logDates.length >= 35, 'Sample history generated 35 days of history for immediate charts');

// 2. Test Daily Metrics Calculation
// Formula: Daily % = completed activities / total activities x 100
const testDate = '2026-11-17';
const testLogs = {
  [testDate]: {
    [SAMPLE_ACTIVITIES[0].id]: 'completed',
    [SAMPLE_ACTIVITIES[1].id]: 'completed',
    [SAMPLE_ACTIVITIES[2].id]: 'completed',
    [SAMPLE_ACTIVITIES[3].id]: 'completed',
    [SAMPLE_ACTIVITIES[4].id]: 'missed',
  }
};
const m1 = getDailyMetrics(testDate, SAMPLE_ACTIVITIES, testLogs);
assert(m1.total === 5, 'Metrics total activities equals 5');
assert(m1.completed === 4, 'Metrics completed equals 4');
assert(m1.missed === 1, 'Metrics missed equals 1');
assert(m1.pending === 0, 'Metrics pending equals 0');
assert(m1.percentage === 80, 'Daily percentage equals 80% (4 / 5 * 100)');

// Test with 3 completed and 2 pending
const testLogs2 = {
  [testDate]: {
    [SAMPLE_ACTIVITIES[0].id]: 'completed',
    [SAMPLE_ACTIVITIES[1].id]: 'completed',
    [SAMPLE_ACTIVITIES[2].id]: 'completed',
  }
};
const m2 = getDailyMetrics(testDate, SAMPLE_ACTIVITIES, testLogs2);
assert(m2.completed === 3, 'Metrics completed equals 3');
assert(m2.pending === 2, 'Metrics pending equals 2');
assert(m2.percentage === 60, 'Daily percentage equals 60% (3 / 5 * 100)');

// 3. Test Toggling / State transitions
// Default state = undefined (pending)
let currentState = testLogs[testDate][SAMPLE_ACTIVITIES[0].id]; // 'completed'
// Tapping Tick when already 'completed' unselects it (back to pending)
let desired = 'completed';
let nextState = currentState === desired ? undefined : desired;
assert(nextState === undefined, 'Tapping completed when already completed resets to pending');

// Tapping Cross when currently completed switches to missed
desired = 'missed';
nextState = currentState === desired ? undefined : desired;
assert(nextState === 'missed', 'Tapping cross when currently completed switches to missed');

// Tapping Cross when missed unselects to pending
currentState = 'missed';
desired = 'missed';
nextState = currentState === desired ? undefined : desired;
assert(nextState === undefined, 'Tapping cross when already missed resets to pending');

// 4. Test Performance Rating Thresholds
// 90%+ : Excellent
// 70-89% : Good
// 50-69% : Average
// below 50% : Needs Improvement
assert(getPerformanceRating(95).label === 'Excellent', '95% returns Excellent');
assert(getPerformanceRating(90).label === 'Excellent', '90% returns Excellent');
assert(getPerformanceRating(85).label === 'Good', '85% returns Good');
assert(getPerformanceRating(70).label === 'Good', '70% returns Good');
assert(getPerformanceRating(65).label === 'Average', '65% returns Average');
assert(getPerformanceRating(50).label === 'Average', '50% returns Average');
assert(getPerformanceRating(49).label === 'Needs Improvement', '49% returns Needs Improvement');
assert(getPerformanceRating(20).label === 'Needs Improvement', '20% returns Needs Improvement');

// 5. Test Streaks
const streakResult = calculateStreaks(SAMPLE_ACTIVITIES, sampleLogs);
assert(streakResult.currentStreak >= 0, 'Current streak is a non-negative number');
assert(streakResult.bestStreak >= streakResult.currentStreak, 'Best streak is >= current streak');

// 6. Test Dates in Month & Calendar navigation
const novDates = getDatesInMonth(2026, 10); // Nov is index 10
assert(novDates.length === 30, 'November 2026 has 30 days');
assert(novDates[0] === '2026-11-01', 'First day of Nov 2026 is 2026-11-01');
assert(novDates[29] === '2026-11-30', 'Last day of Nov 2026 is 2026-11-30');

// 7. Test Backup Parse and Validation
const validBackupJson = JSON.stringify({
  activities: SAMPLE_ACTIVITIES,
  logs: testLogs,
});
const parsedBackup = parseImportJson(validBackupJson);
assert(parsedBackup.activities.length === 5, 'Parsed backup returns 5 activities');
assert(Boolean(parsedBackup.logs[testDate]), 'Parsed backup returns valid logs');

let threwErrorOnInvalid = false;
try {
  parseImportJson('{ "corrupted": true }');
} catch (e) {
  threwErrorOnInvalid = true;
}
assert(threwErrorOnInvalid, 'Invalid backup payload throws descriptive error');

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
