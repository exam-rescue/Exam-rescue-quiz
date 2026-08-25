'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Swords, BookOpen, Trophy, User, Home, Flame, Star } from 'lucide-react';
import { useGameStore, ActiveTab } from '@/lib/store';
import { getLevelFromXP } from '@/lib/questions';

const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
  { id: 'home', label: 'Home', icon: <Home size={16} /> },
  { id: 'battle', label: 'Quiz', icon: <Swords size={16} /> },
  { id: 'practice', label: 'Practice', icon: <BookOpen size={16} /> },
  { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
];

export default function Navbar() {
  const { activeTab, setActiveTab, playerXP, playerStreak } = useGameStore();
  const levelInfo = getLevelFromXP(playerXP);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex sticky top-0 z-50 backdrop-blur-xl bg-[#0c0d14]/80 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto w-full px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <GraduationCap size={18} className="text-indigo-400" />
            </div>
            <span className="text-lg font-bold gradient-text">Exam Rescue</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right: Streak + XP Level */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-base">🔥</span>
              <span className="font-semibold text-amber-400">{playerStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Star size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400">Lv.{levelInfo.level}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="flex sm:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0c0d14]/90 border-t border-white/[0.06]">
        <div className="w-full flex items-center justify-around h-14 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'text-indigo-400'
                  : 'text-white/40'
              }`}
            >
              <span className="flex items-center">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="mobileTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-400 rounded-full"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
