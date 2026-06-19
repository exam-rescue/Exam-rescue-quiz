'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Flame, Zap, Target, Award, Clock, Gamepad2, TrendingUp, Lock } from 'lucide-react';
import { useGameStore } from '@/lib/store';
import { getLevelFromXP, achievementDefs } from '@/lib/questions';

export default function ProfileTab() {
  const {
    playerId,
    playerName,
    setPlayerName,
    playerXP,
    playerStreak,
    playerBestStreak,
    playerTotalQuestions,
    playerCorrectAnswers,
    playerBestCombo,
    playerGamesPlayed,
    playerAccuracy,
    playerFastestCorrect,
    dailyActivity,
    newAchievements,
    showAchievementPopup,
    setShowAchievementPopup,
  } = useGameStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName || '');
  const [achievements, setAchievements] = useState<Array<{ type: string; name: string; description: string; icon: string; unlocked: boolean }>>(
    () => achievementDefs.map((a) => ({ ...a, unlocked: false }))
  );
  const [isNameSaved, setIsNameSaved] = useState(false);

  const levelInfo = getLevelFromXP(playerXP);

  // Fetch achievements
  useEffect(() => {
    if (playerId) {
      fetch(`/api/achievements?playerId=${playerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.achievements) setAchievements(data.achievements);
        })
        .catch(console.error);
    }
  }, [playerId]);

  const saveName = async () => {
    if (nameInput.trim() && playerId) {
      try {
        await fetch('/api/player', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, name: nameInput.trim() }),
        });
        setPlayerName(nameInput.trim());
        setIsEditingName(false);
        setIsNameSaved(true);
        setTimeout(() => setIsNameSaved(false), 2000);
      } catch (err) {
        console.error('Failed to update name:', err);
      }
    } else if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const stats = [
    { icon: <Zap size={18} />, label: 'Total XP', value: playerXP.toLocaleString(), color: 'text-neon-orange' },
    { icon: <Target size={18} />, label: 'Questions', value: playerTotalQuestions.toLocaleString(), color: 'text-neon-green' },
    { icon: <TrendingUp size={18} />, label: 'Accuracy', value: `${playerAccuracy}%`, color: 'text-neon-amber' },
    { icon: <Flame size={18} />, label: 'Best Streak', value: playerBestStreak.toString(), color: 'text-red-400' },
    { icon: <Award size={18} />, label: 'Best Combo', value: `x${playerBestCombo}`, color: 'text-purple-400' },
    { icon: <Gamepad2 size={18} />, label: 'Games Played', value: playerGamesPlayed.toString(), color: 'text-cyan-400' },
  ];

  // Heatmap data - last 7 days
  const getHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;

    return days.map((day, i) => {
      const dateOffset = i - dayOfWeek;
      const date = new Date(today);
      date.setDate(date.getDate() + dateOffset);
      const dateStr = date.toISOString().split('T')[0];

      const activity = dailyActivity.find((a) => a.date === dateStr);
      const questions = activity?.questions || 0;

      let intensity = 0;
      if (questions >= 20) intensity = 4;
      else if (questions >= 10) intensity = 3;
      else if (questions >= 5) intensity = 2;
      else if (questions > 0) intensity = 1;

      return { day, date: dateStr, questions, intensity };
    });
  };

  const heatmapColors = [
    'bg-white/5',
    'bg-neon-orange/20',
    'bg-neon-orange/40',
    'bg-neon-orange/60',
    'bg-neon-orange/80',
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-6 sm:py-8 px-4 max-w-md mx-auto w-full">
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievementPopup && newAchievements.length > 0 && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed top-20 right-4 z-[100] achievement-popup glass-card p-4 max-w-xs border border-neon-amber/30"
          >
            <p className="text-xs font-bold text-neon-amber mb-1">🎉 Achievement Unlocked!</p>
            {newAchievements.map((a) => (
              <div key={a.type} className="flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{a.name}</p>
                  <p className="text-xs text-white/60">{a.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-card p-5 sm:p-6 text-center"
      >
        {/* Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-neon-orange to-neon-amber flex items-center justify-center mx-auto mb-3 shadow-lg shadow-neon-orange/20">
          <span className="text-2xl sm:text-3xl font-black text-white">
            {(playerName || 'P')[0].toUpperCase()}
          </span>
        </div>

        {/* Name (editable) */}
        {isEditingName ? (
          <div className="flex items-center gap-2 justify-center mb-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              className="bg-white/10 border border-neon-orange/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-orange w-40 text-center"
              maxLength={20}
              autoFocus
            />
            <button onClick={saveName} className="text-neon-green text-sm font-bold cursor-pointer">Save</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">{playerName || 'Set Your Name'}</h2>
            <button
              onClick={() => {
                setIsEditingName(true);
                setNameInput(playerName || '');
              }}
              className="text-white/40 hover:text-neon-orange transition-colors cursor-pointer"
            >
              <Edit3 size={14} />
            </button>
          </div>
        )}

        {/* Level Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-orange/10 border border-neon-orange/20 mb-4">
          <span className="text-sm font-bold text-neon-orange">Lv.{levelInfo.level}</span>
          <span className="text-xs text-white/50">{levelInfo.title}</span>
        </div>

        {/* XP Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/40">XP Progress</span>
            <span className="text-xs text-neon-orange font-medium">
              {playerXP.toLocaleString()} / {levelInfo.nextLevelXP.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-orange via-neon-amber to-neon-orange rounded-full xp-bar-shimmer"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-3 text-center"
          >
            <div className={`${stat.color} mb-1 flex justify-center`}>{stat.icon}</div>
            <p className={`text-lg sm:text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-white/40">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full glass-card p-4 sm:p-5"
      >
        <h3 className="text-sm font-bold text-white mb-3">📊 This Week</h3>
        <div className="flex justify-between gap-1 sm:gap-2">
          {getHeatmapData().map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1">
              <div
                className={`heatmap-cell ${heatmapColors[day.intensity]}`}
                title={`${day.questions} questions on ${day.date}`}
              />
              <span className="text-[9px] sm:text-[10px] text-white/30">{day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Wall */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full glass-card p-4 sm:p-5"
      >
        <h3 className="text-sm font-bold text-white mb-3">🏅 Achievements</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.type}
              className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
                achievement.unlocked
                  ? 'bg-neon-orange/10 border border-neon-orange/20'
                  : 'bg-white/3 border border-white/5 opacity-40'
              }`}
            >
              <span className="text-xl sm:text-2xl mb-1">{achievement.unlocked ? achievement.icon : <Lock size={18} className="text-white/30" />}</span>
              <span className="text-[9px] sm:text-[10px] text-white/70 font-medium text-center leading-tight">
                {achievement.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
