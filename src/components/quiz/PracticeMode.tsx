'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import QuestionCard from './QuestionCard';

const QUESTIONS_PER_SESSION = 10;

export default function PracticeMode() {
  const {
    practiceQuestions, setPracticeQuestions,
    practiceCurrentIndex, setPracticeCurrentIndex,
    practiceCorrectCount, setPracticeCorrectCount,
    practiceCategory, setPracticeCategory,
    practiceAnswered, setPracticeAnswered,
    practiceSelectedAnswer, setPracticeSelectedAnswer,
    practiceIsComplete, setPracticeIsComplete,
    showShake, setShowShake,
    playerId, playerName,
    setPlayerXP, setPlayerLevel, setPlayerTotalQuestions,
    setPlayerCorrectAnswers, setPlayerBestCombo, setPlayerGamesPlayed,
    addSubjectPlayed, subjectsPlayed, setActiveTab,
    setNewAchievements, setShowAchievementPopup,
  } = useGameStore();

  const categories = ['Physics', 'Chemistry', 'Biology', 'Maths', 'Mixed'];

  async function startPractice(category: string) {
    useGameStore.getState().resetPractice();
    setPracticeCategory(category);
    if (category !== 'Mixed') addSubjectPlayed(category);
    try {
      const res = await fetch(`/api/questions?category=${category}&count=${QUESTIONS_PER_SESSION}`);
      const data = await res.json();
      if (data.questions) {
        setPracticeQuestions(data.questions);
        setActiveTab('practice');
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  }

  function handleAnswer(index: number) {
    if (practiceAnswered) return;
    const question = practiceQuestions[practiceCurrentIndex];
    if (!question) return;

    setPracticeAnswered(true);
    setPracticeSelectedAnswer(index);
    const isCorrect = index === question.correct - 1;
    if (isCorrect) {
      setPracticeCorrectCount(practiceCorrectCount + 1);
    } else {
      setShowShake(true);
    }
  }

  function nextQuestion() {
    if (practiceCurrentIndex + 1 < practiceQuestions.length) {
      setPracticeCurrentIndex(practiceCurrentIndex + 1);
      setPracticeAnswered(false);
      setPracticeSelectedAnswer(null);
    } else {
      finishPractice();
    }
  }

  async function finishPractice() {
    setPracticeIsComplete(true);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: playerId || undefined,
          playerName: playerName || 'Player',
          category: practiceCategory,
          xpEarned: practiceCorrectCount * 5,
          correctCount: practiceCorrectCount,
          totalCount: practiceQuestions.length,
          comboMax: 0,
          timeTaken: 0,
          mode: 'practice',
          subjectsPlayed: subjectsPlayed,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (!playerId) useGameStore.getState().setPlayerId(data.playerId);
        setPlayerXP(data.newXp);
        setPlayerLevel(Math.floor(data.newXp / 500) + 1);
        setPlayerTotalQuestions((q: number) => q + practiceQuestions.length);
        setPlayerCorrectAnswers((a: number) => a + practiceCorrectCount);
        setPlayerGamesPlayed((g: number) => g + 1);

        if (data.newAchievements && data.newAchievements.length > 0) {
          setNewAchievements(data.newAchievements);
          setShowAchievementPopup(true);
        }
      }
    } catch (err) {
      console.error('Failed to save:', err);
    }
  }

  const accuracy = practiceQuestions.length > 0
    ? Math.round((practiceCorrectCount / practiceQuestions.length) * 100)
    : 0;

  // Category Selection
  if (!practiceCategory) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">📖 Practice Mode</h2>
          <p className="text-white/60 text-sm sm:text-base">No timer, no pressure. Learn at your own pace!</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => startPractice(cat)}
              className="glass-card p-4 sm:p-6 text-center hover:scale-105 transition-transform cursor-pointer group"
            >
              <span className="text-2xl sm:text-3xl mb-2 block">
                {cat === 'Physics' ? '⚛️' : cat === 'Chemistry' ? '🧪' : cat === 'Biology' ? '🧬' : cat === 'Maths' ? '📐' : '🎲'}
              </span>
              <span className="text-sm sm:text-base font-semibold text-white/90 group-hover:text-neon-orange transition-colors">{cat}</span>
              <span className="block text-xs text-white/40 mt-1">10 Questions</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Results Screen
  if (practiceIsComplete) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">📚 Practice Complete!</h2>
        </motion.div>

        <div className="glass-card p-6 w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-green">{accuracy}%</p>
              <p className="text-xs text-white/50">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-orange">{practiceCorrectCount * 5}</p>
              <p className="text-xs text-white/50">XP Earned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{practiceCorrectCount}/{practiceQuestions.length}</p>
              <p className="text-xs text-white/50">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-amber">📖</p>
              <p className="text-xs text-white/50">Keep Learning!</p>
            </div>
          </div>
        </div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} onClick={() => { useGameStore.getState().resetPractice(); }} className="neon-btn w-full max-w-md bg-neon-orange text-white font-semibold py-3 px-6 rounded-xl cursor-pointer">
          🔄 Practice Again
        </motion.button>
      </div>
    );
  }

  // Practice Question Screen
  const currentQuestion = practiceQuestions[practiceCurrentIndex];

  return (
    <div className={`w-full max-w-2xl mx-auto ${showShake ? 'screen-shake' : ''}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm text-white/60">{practiceCurrentIndex + 1} of {practiceQuestions.length}</span>
            <span className="text-xs sm:text-sm font-bold text-neon-green">{practiceCorrectCount} correct</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-neon-green to-emerald-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${((practiceCurrentIndex + (practiceAnswered ? 1 : 0)) / practiceQuestions.length) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>
      </div>

      {currentQuestion && (
        <QuestionCard question={currentQuestion} selectedIndex={practiceSelectedAnswer} onAnswer={handleAnswer} answered={practiceAnswered} mode="practice" />
      )}

      {practiceAnswered && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <button onClick={nextQuestion} className="neon-btn-green w-full bg-neon-green text-white font-semibold py-3 px-6 rounded-xl cursor-pointer">
            {practiceCurrentIndex + 1 < practiceQuestions.length ? 'Next Question →' : 'See Results'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
