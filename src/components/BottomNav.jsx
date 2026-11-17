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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0a17]/95 backdrop-blur-md border-t border-purple-100 dark:border-purple-950 pb-safe">
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
                  ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-purple-500/15' : ''}`}>
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
