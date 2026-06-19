'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Swords, BookOpen, Home, User, Zap } from 'lucide-react';
import { useGameStore, ActiveTab } from '@/lib/store';
import { getLevelFromXP } from '@/lib/questions';

const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
  { id: 'home', label: 'Home', icon: <Home size={16} /> },
  { id: 'battle', label: 'Battle', icon: <Swords size={16} /> },
  { id: 'practice', label: 'Practice', icon: <BookOpen size={16} /> },
  { id: 'leaderboard', label: 'Ranks', icon: <Trophy size={16} /> },
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
];

export default function Navbar() {
  const { activeTab, setActiveTab, playerXP, playerStreak, playerLevel } = useGameStore();

  const levelInfo = getLevelFromXP(playerXP);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Top Row: Logo + Stats */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Zap size={22} className="text-neon-orange" />
            <span className="text-base sm:text-lg font-bold gradient-text">Exam Rescue</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* XP */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-orange to-neon-amber rounded-full xp-bar-shimmer"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-bold text-neon-orange">Lv.{levelInfo.level}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1">
              <span className="text-base">🔥</span>
              <span className="text-xs sm:text-sm font-bold text-neon-amber">{playerStreak}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-0.5 -mb-px overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-neon-orange'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-orange rounded-t-full"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="flex items-center">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
