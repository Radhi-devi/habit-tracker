import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Activity as ActivityIcon,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { 
  getDatesInMonth, 
  getDailyMetrics, 
  parseDateKey, 
  MONTH_NAMES, 
  MONTH_NAMES_SHORT,
  getTodayKey,
  shiftDateKey
} from '../utils/dateUtils';

export default function DashboardView() {
  const { activities, logs, streakMetrics, theme } = useHabits();
  const isDark = theme === 'dark';

  // State for Daily Percentage Chart filter (month or last 14/30 days)
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar'

  // 1. Overall All-time Metrics
  const overallStats = useMemo(() => {
    let totalCompleted = 0;
    let totalMissed = 0;

    const activityCounts = {};
    activities.forEach((act) => {
      activityCounts[act.id] = { completed: 0, missed: 0 };
    });

    Object.values(logs).forEach((dayLog) => {
      if (!dayLog) return;
      Object.entries(dayLog).forEach(([actId, status]) => {
        if (activityCounts[actId]) {
          if (status === 'completed') {
            totalCompleted++;
            activityCounts[actId].completed++;
          } else if (status === 'missed') {
            totalMissed++;
            activityCounts[actId].missed++;
          }
        }
      });
    });

    const totalDecided = totalCompleted + totalMissed;
    const overallPercentage = totalDecided > 0 ? Math.round((totalCompleted / totalDecided) * 100) : 0;

    return {
      totalCompleted,
      totalMissed,
      totalDecided,
      overallPercentage,
      activityCounts,
    };
  }, [activities, logs]);

  // 2. Data for Overall Bar Graph: Completed vs Not Completed per Activity
  const activityOverallData = useMemo(() => {
    return activities.map((act) => {
      const counts = overallStats.activityCounts[act.id] || { completed: 0, missed: 0 };
      const total = counts.completed + counts.missed;
      const rate = total > 0 ? Math.round((counts.completed / total) * 100) : 0;

      return {
        name: act.name,
        emoji: act.emoji,
        completed: counts.completed,
        missed: counts.missed,
        rate,
        color: act.color,
      };
    });
  }, [activities, overallStats]);

  // Find strongest and weakest habit
  const { strongestHabit, weakestHabit } = useMemo(() => {
    const valid = activityOverallData.filter((a) => a.completed + a.missed > 0);
    if (valid.length === 0) return { strongestHabit: null, weakestHabit: null };

    const sorted = [...valid].sort((a, b) => b.rate - a.rate);
    return {
      strongestHabit: sorted[0],
      weakestHabit: sorted[sorted.length - 1],
    };
  }, [activityOverallData]);

  // 3. Data for Daily Percentage Chart (For the selected month)
  const dailyPercentageData = useMemo(() => {
    const dates = getDatesInMonth(selectedYear, selectedMonth);
    return dates.map((dateKey) => {
      const metrics = getDailyMetrics(dateKey, activities, logs);
      const dayNum = parseInt(dateKey.split('-')[2], 10);
      const isLogged = (logs[dateKey] && Object.keys(logs[dateKey]).length > 0);

      return {
        date: dateKey,
        day: `${dayNum}`,
        percentage: metrics.percentage,
        completed: metrics.completed,
        missed: metrics.missed,
        total: metrics.total,
        isLogged,
      };
    });
  }, [selectedYear, selectedMonth, activities, logs]);

  // Grid styling for Recharts based on theme
  const gridColor = isDark ? '#27272a' : '#f4f4f5';
  const textColor = isDark ? '#a1a1aa' : '#71717a';
  const tooltipBg = isDark ? '#18181b' : '#ffffff';
  const tooltipBorder = isDark ? '#27272a' : '#e4e4e7';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          Analytics & Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Long-term trends, habit consistency, and completion metrics across all time.
        </p>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Card 1: Total Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
              {overallStats.totalCompleted}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">All-time check-ins</p>
          </div>
        </div>

        {/* Card 2: Total Not Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Missed
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
              {overallStats.totalMissed}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Missed check-ins</p>
          </div>
        </div>

        {/* Card 3: Overall Completion % */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Success Rate
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {overallStats.overallPercentage}%
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Overall all-time average</p>
          </div>
        </div>

        {/* Card 4: Current Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Current Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
              {streakMetrics.currentStreak}
              <span className="text-xs font-semibold text-zinc-500">days</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Continuous momentum</p>
          </div>
        </div>

        {/* Card 5: Best Streak */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Best Streak
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1">
              {streakMetrics.bestStreak}
              <span className="text-xs font-semibold text-zinc-500">days</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">All-time record</p>
          </div>
        </div>

      </div>

      {/* 2. Daily Completion % Chart (Line / Area / Bar) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Daily Completion Rate
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Day-by-day progress percentage for {MONTH_NAMES[selectedMonth]} {selectedYear}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
            >
              {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Chart Type Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-zinc-500'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-zinc-500'
                }`}
              >
                Bar
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={dailyPercentageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDailyRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="day" 
                  stroke={textColor} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke={textColor} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: gridColor }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div 
                          className="p-3 rounded-xl shadow-xl border text-xs"
                          style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
                        >
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">
                            {data.date}
                          </p>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                            Completion: {data.percentage}%
                          </p>
                          <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {data.completed} of {data.total} completed
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.6} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  name="Completion %"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDailyRate)"
                />
              </AreaChart>
            ) : (
              <BarChart data={dailyPercentageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="day" 
                  stroke={textColor} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: gridColor }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke={textColor} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: gridColor }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div 
                          className="p-3 rounded-xl shadow-xl border text-xs"
                          style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
                        >
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{data.date}</p>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                            Completion: {data.percentage}%
                          </p>
                          <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {data.completed} / {data.total} completed
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  name="Completion %" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Overall Bar Graph: Completed vs Not Completed per Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart: 2 columns width */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-indigo-500" />
              Completed vs Not Completed (All Time)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-5">
              Total number of successful completions vs missed days for each activity
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityOverallData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  stroke={textColor} 
                  fontSize={11} 
                  tickLine={false} 
                  interval={0}
                  tick={({ x, y, payload }) => {
                    const act = activities.find(a => a.name === payload.value);
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={14} textAnchor="middle" fill={textColor} fontSize={11} fontWeight={500}>
                          {act?.emoji || ''} {payload.value.length > 10 ? `${payload.value.slice(0, 9)}…` : payload.value}
                        </text>
                      </g>
                    );
                  }}
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis 
                  stroke={textColor} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: gridColor }} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div 
                          className="p-3 rounded-xl shadow-xl border text-xs"
                          style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
                        >
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <span>{data.emoji}</span>
                            <span>{data.name}</span>
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                              ✅ Completed: {data.completed}
                            </p>
                            <p className="text-rose-600 dark:text-rose-400 font-medium">
                              ❌ Missed: {data.missed}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold pt-1 border-t border-zinc-200 dark:border-zinc-700">
                              Success Rate: {data.rate}%
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                />
                <Bar 
                  dataKey="completed" 
                  name="Completed" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="missed" 
                  name="Not Completed" 
                  fill="#F43F5E" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Activity-Wise Completion % (Strengths & Weaknesses) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Habit Performance
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-4">
              All-time success percentage per habit
            </p>

            {/* List with progress bars */}
            <div className="space-y-3.5">
              {activityOverallData.map((act) => (
                <div key={act.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <span>{act.emoji}</span>
                      <span className="truncate max-w-[120px]">{act.name}</span>
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {act.rate}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${act.rate}%`,
                        backgroundColor: act.color || '#3B82F6',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights Cards */}
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            {strongestHabit && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">Strongest Habit: </span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{strongestHabit.emoji} {strongestHabit.name} ({strongestHabit.rate}%)</span>
                </div>
              </div>
            )}

            {weakestHabit && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-amber-700 dark:text-amber-300 font-bold">Needs Focus: </span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{weakestHabit.emoji} {weakestHabit.name} ({weakestHabit.rate}%)</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
