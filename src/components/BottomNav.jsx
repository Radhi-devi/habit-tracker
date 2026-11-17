import React from 'react';
import { CheckCircle2, BarChart3, Calendar, ListOrdered } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useHabits();

  const navItems = [
    { id: 'today', label: 'Today', icon: CheckCircle2 },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'monthly', label: 'Monthly', icon: Calendar },
    { id: 'activities', label: 'Activities', icon: ListOrdered },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-blue-500/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
