import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useHabits } from '../context/HabitContext';
import { 
  getDatesInMonth, 
  getDailyMetrics, 
  MONTH_NAMES, 
  MONTH_NAMES_SHORT, 
  getTodayKey,
  getPerformanceRating,
} from '../utils/dateUtils.js';

export default function MonthlyReportView() {
  const { activities, logs, setSelectedDate, setActiveTab, theme } = useHabits();
  const isDark = theme === 'dark';

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const jumpToCurrentMonth = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  // 1. Calculate Monthly Metrics
  const monthlyMetrics = useMemo(() => {
    const dates = getDatesInMonth(year, month);
    let totalCompleted = 0;
    let totalMissed = 0;
    let sumPercentages = 0;
    let loggedDaysCount = 0;

    let bestDay = null;
    let worstDay = null;

    const activityStats = {};
    activities.forEach((act) => {
      activityStats[act.id] = { completed: 0, missed: 0, total: 0 };
    });

    const dayDataList = dates.map((dateKey) => {
      const m = getDailyMetrics(dateKey, activities, logs);
      const dayLogs = logs[dateKey] || {};
      const hasLogged = Object.keys(dayLogs).length > 0;

      if (hasLogged) {
        loggedDaysCount++;
        totalCompleted += m.completed;
        totalMissed += m.missed;
        sumPercentages += m.percentage;

        if (!bestDay || m.percentage > bestDay.percentage) {
          bestDay = { dateKey, ...m };
        }

        if (!worstDay || m.percentage < worstDay.percentage) {
          worstDay = { dateKey, ...m };
        }

        activities.forEach((act) => {
          const status = dayLogs[act.id];
          if (status === 'completed') {
            activityStats[act.id].completed++;
            activityStats[act.id].total++;
          } else if (status === 'missed') {
            activityStats[act.id].missed++;
            activityStats[act.id].total++;
          }
        });
      }

      return {
        dateKey,
        dayNum: parseInt(dateKey.split('-')[2], 10),
        metrics: m,
        hasLogged,
      };
    });

    const averagePercentage = loggedDaysCount > 0 
      ? Math.round(sumPercentages / loggedDaysCount) 
      : 0;

    let bestActivity = null;
    let weakestActivity = null;

    const actList = activities.map((act) => {
      const stats = activityStats[act.id] || { completed: 0, missed: 0, total: 0 };
      const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      return {
        activity: act,
        ...stats,
        rate,
      };
    }).filter((a) => a.total > 0);

    if (actList.length > 0) {
      const sorted = [...actList].sort((a, b) => b.rate - a.rate);
      bestActivity = sorted[0];
      weakestActivity = sorted[sorted.length - 1];
    }

    return {
      dates,
      dayDataList,
      totalCompleted,
      totalMissed,
      averagePercentage,
      loggedDaysCount,
      bestDay,
      worstDay,
      bestActivity,
      weakestActivity,
    };
  }, [year, month, activities, logs]);

  // 2. Month-over-Month (MoM) Comparison
  const momComparison = useMemo(() => {
    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = year - 1;
    }

    const prevDates = getDatesInMonth(prevYear, prevMonth);
    let prevSum = 0;
    let prevLoggedDays = 0;

    prevDates.forEach((dateKey) => {
      const dayLogs = logs[dateKey] || {};
      if (Object.keys(dayLogs).length > 0) {
        const m = getDailyMetrics(dateKey, activities, logs);
        prevSum += m.percentage;
        prevLoggedDays++;
      }
    });

    const prevAverage = prevLoggedDays > 0 ? Math.round(prevSum / prevLoggedDays) : null;

    if (prevAverage === null) {
      return {
        hasData: false,
        prevMonthName: MONTH_NAMES[prevMonth],
        prevAverage: 0,
        difference: 0,
      };
    }

    const diff = monthlyMetrics.averagePercentage - prevAverage;
    return {
      hasData: true,
      prevMonthName: MONTH_NAMES[prevMonth],
      prevAverage,
      difference: diff,
    };
  }, [year, month, activities, logs, monthlyMetrics.averagePercentage]);

  // 3. Weekly Breakdown
  const weeklyData = useMemo(() => {
    const weeks = [
      { name: 'Week 1', range: '1-7', start: 1, end: 7, completed: 0, missed: 0, totalTracked: 0, sumRate: 0, daysCount: 0 },
      { name: 'Week 2', range: '8-14', start: 8, end: 14, completed: 0, missed: 0, totalTracked: 0, sumRate: 0, daysCount: 0 },
      { name: 'Week 3', range: '15-21', start: 15, end: 21, completed: 0, missed: 0, totalTracked: 0, sumRate: 0, daysCount: 0 },
      { name: 'Week 4', range: '22-28', start: 22, end: 28, completed: 0, missed: 0, totalTracked: 0, sumRate: 0, daysCount: 0 },
      { name: 'Week 5', range: '29-31', start: 29, end: 31, completed: 0, missed: 0, totalTracked: 0, sumRate: 0, daysCount: 0 },
    ];

    monthlyMetrics.dayDataList.forEach((day) => {
      const dNum = day.dayNum;
      const week = weeks.find((w) => dNum >= w.start && dNum <= w.end);
      if (week && day.hasLogged) {
        week.completed += day.metrics.completed;
        week.missed += day.metrics.missed;
        week.totalTracked += (day.metrics.completed + day.metrics.missed);
        week.sumRate += day.metrics.percentage;
        week.daysCount++;
      }
    });

    return weeks.map((w) => {
      const avgRate = w.daysCount > 0 ? Math.round(w.sumRate / w.daysCount) : 0;
      return {
        name: w.name,
        range: w.range,
        rate: avgRate,
        completed: w.completed,
        missed: w.missed,
      };
    });
  }, [monthlyMetrics.dayDataList]);

  // Performance Rating
  const rating = getPerformanceRating(monthlyMetrics.averagePercentage);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const paddingSlots = Array.from({ length: firstDayOfWeek });

  const getHeatmapColor = (percentage, hasLogged) => {
    if (!hasLogged) {
      return 'bg-purple-50/50 dark:bg-purple-950/20 text-zinc-400 dark:text-zinc-500 border-purple-100 dark:border-purple-900/30';
    }
    if (percentage === 100) {
      return 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-sm shadow-emerald-600/30';
    }
    if (percentage >= 75) {
      return 'bg-purple-600 text-white font-semibold border-purple-500 shadow-xs shadow-purple-600/20';
    }
    if (percentage >= 50) {
      return 'bg-violet-400 dark:bg-violet-500 text-white font-semibold border-violet-400';
    }
    if (percentage >= 25) {
      return 'bg-amber-500 text-white font-semibold border-amber-400';
    }
    return 'bg-rose-500 text-white font-semibold border-rose-400';
  };

  const handleDayClick = (dateKey) => {
    setSelectedDate(dateKey);
    setActiveTab('today');
  };

  const gridColor = isDark ? '#2e1c4a' : '#f3e8ff';
  const textColor = isDark ? '#c084fc' : '#7e22ce';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Month Navigator Header */}
      <div className="bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 rounded-xl border border-purple-200/70 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center sm:text-left min-w-[170px]">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center sm:justify-start gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              <span>{MONTH_NAMES[month]} {year}</span>
            </h2>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-0.5 font-medium">
              {monthlyMetrics.loggedDaysCount} tracked days this month
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2.5 rounded-xl border border-purple-200/70 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {!isCurrentMonth && (
          <button
            onClick={jumpToCurrentMonth}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Current Month</span>
          </button>
        )}
      </div>

      {/* Performance Score & Rating Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-gradient-to-r from-purple-50/80 via-violet-50/50 to-fuchsia-50/30 dark:from-[#19112e] dark:via-[#130d24] dark:to-[#1a0f30] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#110e1f] shadow-md shadow-purple-600/20 flex items-center justify-center text-3xl shrink-0 border border-purple-100 dark:border-purple-900/40">
            {rating.label === 'Excellent' && '🌟'}
            {rating.label === 'Good' && '💪'}
            {rating.label === 'Average' && '⚖️'}
            {rating.label === 'Needs Improvement' && '🌱'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Performance Rating: {rating.label}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
              {monthlyMetrics.averagePercentage}% Monthly Average
            </h3>
            <p className="text-xs text-purple-800/80 dark:text-purple-200/80 mt-1 max-w-xl font-medium">
              {rating.description}
            </p>
          </div>
        </div>

        {/* Month-over-Month Badge */}
        {momComparison.hasData && (
          <div className="sm:self-center p-3 rounded-xl bg-white/80 dark:bg-[#110e1f]/90 border border-purple-200/80 dark:border-purple-900/60 flex items-center gap-3 shrink-0 shadow-xs">
            <div className={`p-2 rounded-lg ${momComparison.difference >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
              {momComparison.difference >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                vs {momComparison.prevMonthName}
              </div>
              <div className={`text-sm font-black ${momComparison.difference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {momComparison.difference >= 0 ? `+${momComparison.difference}%` : `${momComparison.difference}%`}
                <span className="text-xs font-normal text-zinc-500 ml-1">
                  ({momComparison.prevAverage}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Report Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700/60 dark:text-purple-300/60">
            Completed Habits
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {monthlyMetrics.totalCompleted}
            </span>
            <span className="text-xs text-zinc-400">times</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Total wins this month</p>
        </div>

        {/* Total Missed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700/60 dark:text-purple-300/60">
            Missed Habits
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {monthlyMetrics.totalMissed}
            </span>
            <span className="text-xs text-zinc-400">times</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Areas for improvement</p>
        </div>

        {/* Best Day & Worst Day */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700/60 dark:text-purple-300/60">
            Best & Worst Day
          </span>
          <div className="mt-2 space-y-1">
            <div className="text-xs flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Best:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {monthlyMetrics.bestDay ? `${monthlyMetrics.bestDay.dateKey.slice(5)} (${monthlyMetrics.bestDay.percentage}%)` : 'N/A'}
              </span>
            </div>
            <div className="text-xs flex items-center justify-between">
              <span className="text-rose-600 dark:text-rose-400 font-bold">Worst:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {monthlyMetrics.worstDay ? `${monthlyMetrics.worstDay.dateKey.slice(5)} (${monthlyMetrics.worstDay.percentage}%)` : 'N/A'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Peak and low moments</p>
        </div>

        {/* Best and Weakest Activity */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700/60 dark:text-purple-300/60">
            Top & Weakest Activity
          </span>
          <div className="mt-2 space-y-1">
            <div className="text-xs flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Top:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[130px]">
                {monthlyMetrics.bestActivity 
                  ? `${monthlyMetrics.bestActivity.activity.emoji} ${monthlyMetrics.bestActivity.activity.name} (${monthlyMetrics.bestActivity.rate}%)` 
                  : 'N/A'}
              </span>
            </div>
            <div className="text-xs flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400 font-bold">Weakest:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[130px]">
                {monthlyMetrics.weakestActivity 
                  ? `${monthlyMetrics.weakestActivity.activity.emoji} ${monthlyMetrics.weakestActivity.activity.name} (${monthlyMetrics.weakestActivity.rate}%)` 
                  : 'N/A'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Habit performance spotlight</p>
        </div>

      </div>

      {/* Calendar Heatmap Section */}
      <div className="bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              Calendar Completion Heatmap
            </h3>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-0.5">
              Click on any day to inspect and edit your habits for that date
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>Low</span>
            <div className="w-3.5 h-3.5 rounded-sm bg-rose-500" title="< 25%" />
            <div className="w-3.5 h-3.5 rounded-sm bg-amber-500" title="25% - 49%" />
            <div className="w-3.5 h-3.5 rounded-sm bg-violet-400" title="50% - 74%" />
            <div className="w-3.5 h-3.5 rounded-sm bg-purple-600" title="75% - 99%" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-600" title="100%" />
            <span>High</span>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-purple-700/60 dark:text-purple-300/60 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-2">
          {paddingSlots.map((_, idx) => (
            <div key={`pad-${idx}`} className="h-16 sm:h-20 rounded-xl bg-transparent" />
          ))}

          {monthlyMetrics.dayDataList.map((day) => {
            const isToday = day.dateKey === getTodayKey();
            const colorClass = getHeatmapColor(day.metrics.percentage, day.hasLogged);

            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => handleDayClick(day.dateKey)}
                className={`h-16 sm:h-20 rounded-xl p-2 flex flex-col justify-between border text-left transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer relative group ${colorClass} ${
                  isToday ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-[#110e1f]' : ''
                }`}
                title={`${day.dateKey}: ${day.hasLogged ? `${day.metrics.percentage}% (${day.metrics.completed}/${day.metrics.total})` : 'No logs'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs sm:text-sm font-bold">
                    {day.dayNum}
                  </span>
                  {isToday && (
                    <span className="w-2 h-2 rounded-full bg-purple-300 animate-ping" />
                  )}
                </div>

                <div className="text-[10px] sm:text-xs">
                  {day.hasLogged ? (
                    <div>
                      <div className="font-black text-xs sm:text-sm leading-tight">
                        {day.metrics.percentage}%
                      </div>
                      <div className="opacity-80 text-[10px] hidden sm:block">
                        {day.metrics.completed}/{day.metrics.total}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] opacity-60">--</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Breakdown Bar Chart */}
      <div className="bg-white dark:bg-[#110e1f] border border-purple-100 dark:border-purple-900/40 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              Weekly Breakdown (Week 1 to Week 5)
            </h3>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-0.5">
              Average habit completion rate for each week of {MONTH_NAMES[month]}
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                stroke={textColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: gridColor }}
                tickFormatter={(val, i) => `${val} (${weeklyData[i]?.range})`}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke={textColor} 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: gridColor }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div 
                        className="p-3 rounded-xl shadow-xl border text-xs bg-white dark:bg-[#110e1f] border-purple-200 dark:border-purple-800"
                      >
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                          {data.name} (Days {data.range})
                        </p>
                        <p className="text-purple-600 dark:text-purple-400 font-bold mt-1 text-sm">
                          Weekly Average: {data.rate}%
                        </p>
                        <div className="mt-1 text-zinc-500 space-y-0.5">
                          <p>✅ Completed: {data.completed}</p>
                          <p>❌ Missed: {data.missed}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="rate" 
                name="Average Completion %" 
                fill="#7C3AED" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
