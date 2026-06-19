'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import Navbar from '@/components/quiz/Navbar';
import HomeTab from '@/components/quiz/HomeTab';
import BattleMode from '@/components/quiz/BattleMode';
import PracticeMode from '@/components/quiz/PracticeMode';
import LeaderboardTab from '@/components/quiz/LeaderboardTab';
import ProfileTab from '@/components/quiz/ProfileTab';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

export default function ExamRescueApp() {
  const { activeTab, playerId, setActiveTab } = useGameStore();

  // Sync player data from server on load
  useEffect(() => {
    if (playerId) {
      fetch(`/api/player?playerId=${playerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            const store = useGameStore.getState();
            store.setPlayerXP(data.totalXp);
            store.setPlayerLevel(data.level);
            store.setPlayerStreak(data.currentStreak);
            store.setPlayerBestStreak(data.bestStreak);
            store.setPlayerTotalQuestions(data.totalQuestions);
            store.setPlayerCorrectAnswers(data.correctAnswers);
            store.setPlayerBestCombo(data.bestCombo);
            store.setPlayerGamesPlayed(data.gamesPlayed);
            store.setPlayerAccuracy(data.accuracy);
            store.setPlayerFastestCorrect(data.fastestCorrect);
            if (data.dailyActivity) {
              store.setDailyActivity(
                data.dailyActivity.map((a: { date: string; questions: number; xp: number; games: number }) => ({
                  date: a.date,
                  questions: a.questions,
                  xp: a.xp,
                  games: a.games,
                }))
              );
            }
          }
        })
        .catch(console.error);
    }
  }, [playerId]);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'battle':
        return <BattleMode />;
      case 'practice':
        return <PracticeMode />;
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-main-gradient flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
