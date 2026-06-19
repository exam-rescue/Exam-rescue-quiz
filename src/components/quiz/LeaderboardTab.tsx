'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/store';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  xp: number;
  level: number;
  gamesPlayed: number;
  bestCombo: number;
  accuracy: number;
  isCurrentPlayer: boolean;
}

const filters = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
];

export default function LeaderboardTab() {
  const { playerId } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?filter=${activeFilter}&playerId=${playerId || ''}`);
        const data = await res.json();
        if (!cancelled && data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
      if (!cancelled) setLoading(false);
    };
    loadLeaderboard();
    return () => { cancelled = true; };
  }, [activeFilter, playerId]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={20} className="text-gray-300" />;
    if (rank === 3) return <Medal size={20} className="text-amber-600" />;
    return <span className="text-sm font-bold text-white/40">#{rank}</span>;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6 sm:py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">🏆 Leaderboard</h2>
        <p className="text-white/60 text-sm">Top performers across India</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeFilter === filter.value
                ? 'bg-neon-orange text-white neon-btn'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="flex items-end gap-2 sm:gap-4 w-full max-w-md justify-center">
          {[1, 0, 2].map((podiumIndex) => {
            const entry = leaderboard[podiumIndex];
            if (!entry) return null;
            const rank = podiumIndex + 1;
            const heights = ['h-20', 'h-28', 'h-16'];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rank * 0.15 }}
                className="flex flex-col items-center"
              >
                <div className={`glass-card p-3 sm:p-4 text-center ${podiumIndex === 0 ? 'ring-2 ring-yellow-400/50' : ''}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neon-orange/20 flex items-center justify-center mb-2 mx-auto">
                    <span className={`text-lg sm:text-xl font-black ${getRankClass(rank)}`}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[80px]">{entry.name}</p>
                  <p className="text-xs sm:text-sm font-bold text-neon-orange">{entry.xp.toLocaleString()} XP</p>
                </div>
                <div className={`w-full ${heights[podiumIndex]} bg-gradient-to-t from-neon-orange/20 to-transparent rounded-t-lg mt-1`} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <div className="w-full max-w-md space-y-2">
        <AnimatePresence>
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-3 sm:p-4 flex items-center gap-3 ${
                entry.isCurrentPlayer ? 'ring-1 ring-neon-orange/50 bg-neon-orange/5' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                {getRankBadge(entry.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
                  {entry.isCurrentPlayer && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neon-orange/20 text-neon-orange font-bold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>Lv.{entry.level}</span>
                  <span>•</span>
                  <span>{entry.accuracy}% acc</span>
                  <span>•</span>
                  <span>x{entry.bestCombo} combo</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-neon-orange">{entry.xp.toLocaleString()}</p>
                <p className="text-[10px] text-white/40">XP</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-neon-orange/30 border-t-neon-orange rounded-full animate-spin" />
          </div>
        )}

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12 text-white/40">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>No scores yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
