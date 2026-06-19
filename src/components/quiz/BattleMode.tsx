'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, QuestionData } from '@/lib/store';
import QuestionCard from './QuestionCard';

const QUESTIONS_PER_ROUND = 10;
const TIMER_DURATION = 30;

export default function BattleMode() {
  const {
    battleQuestions, setBattleQuestions,
    battleCurrentIndex, setBattleCurrentIndex,
    battleTimer, setBattleTimer,
    battleScore, setBattleScore,
    battleCombo, setBattleCombo,
    battleMaxCombo, setBattleMaxCombo,
    battleCorrectCount, setBattleCorrectCount,
    battleStartTime, setBattleStartTime,
    battleCategory, setBattleCategory,
    battleAnswered, setBattleAnswered,
    battleSelectedAnswer, setBattleSelectedAnswer,
    battleIsComplete, setBattleIsComplete,
    showConfetti, setShowConfetti,
    showShake, setShowShake,
    addScorePopup, scorePopups,
    resetBattle,
    setPlayerXP, setPlayerLevel, setPlayerStreak, setPlayerBestStreak,
    setPlayerTotalQuestions, setPlayerCorrectAnswers, setPlayerBestCombo,
    setPlayerGamesPlayed, setPlayerAccuracy, setPlayerFastestCorrect,
    playerId, playerName,
    addSubjectPlayed, setNewAchievements, setShowAchievementPopup,
    setActiveTab, subjectsPlayed,
  } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = ['Physics', 'Chemistry', 'Biology', 'Maths', 'Mixed'];

  async function startBattle(category: string) {
    resetBattle();
    setBattleCategory(category);
    if (category !== 'Mixed') addSubjectPlayed(category);
    try {
      const res = await fetch(`/api/questions?category=${category}&count=${QUESTIONS_PER_ROUND}`);
      const data = await res.json();
      if (data.questions) {
        setBattleQuestions(data.questions);
        setBattleStartTime(Date.now());
        setActiveTab('battle');
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  }

  function handleTimeUp() {
    setBattleAnswered(true);
    setBattleCombo(0);
    setShowShake(true);
    setTimeout(() => {
      if (battleCurrentIndex + 1 < battleQuestions.length) {
        setBattleCurrentIndex(battleCurrentIndex + 1);
        setBattleAnswered(false);
        setBattleSelectedAnswer(null);
      } else {
        finishGame();
      }
    }, 2000);
  }

  function handleAnswer(index: number) {
    if (battleAnswered) return;
    const question = battleQuestions[battleCurrentIndex];
    if (!question) return;

    setBattleAnswered(true);
    setBattleSelectedAnswer(index);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === question.correct - 1;

    if (isCorrect) {
      const newCombo = battleCombo + 1;
      setBattleCombo(newCombo);
      if (newCombo > battleMaxCombo) setBattleMaxCombo(newCombo);
      const comboMultiplier = newCombo >= 5 ? 5 : newCombo >= 3 ? 3 : newCombo >= 2 ? 2 : 1;
      const points = 10 * comboMultiplier;
      setBattleScore(battleScore + points);
      setBattleCorrectCount(battleCorrectCount + 1);
      setShowConfetti(true);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        addScorePopup(
          `+${points} XP${comboMultiplier > 1 ? ` (x${comboMultiplier})` : ''}`,
          rect.width / 2,
          rect.height / 2
        );
      }
    } else {
      setBattleCombo(0);
      setShowShake(true);
    }

    setTimeout(() => {
      if (battleCurrentIndex + 1 < battleQuestions.length) {
        setBattleCurrentIndex(battleCurrentIndex + 1);
        setBattleAnswered(false);
        setBattleSelectedAnswer(null);
      } else {
        finishGame();
      }
    }, 2000);
  }

  async function finishGame() {
    setBattleIsComplete(true);
    const timeTaken = battleStartTime ? (Date.now() - battleStartTime) / 1000 : 0;

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: playerId || undefined,
          playerName: playerName || 'Player',
          category: battleCategory,
          xpEarned: battleScore,
          correctCount: battleCorrectCount,
          totalCount: battleQuestions.length,
          comboMax: battleMaxCombo,
          timeTaken,
          mode: 'battle',
          subjectsPlayed: subjectsPlayed,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (!playerId) useGameStore.getState().setPlayerId(data.playerId);
        setPlayerXP(data.newXp);
        setPlayerLevel(Math.floor(data.newXp / 500) + 1);
        setPlayerStreak((s: number) => s + 1);
        setPlayerTotalQuestions((q: number) => q + battleQuestions.length);
        setPlayerCorrectAnswers((a: number) => a + battleCorrectCount);
        setPlayerBestCombo((c: number) => Math.max(c, battleMaxCombo));
        setPlayerGamesPlayed((g: number) => g + 1);
        setPlayerAccuracy(Math.round((battleCorrectCount / battleQuestions.length) * 100));
        setPlayerFastestCorrect(timeTaken / battleQuestions.length);

        if (data.newAchievements && data.newAchievements.length > 0) {
          setNewAchievements(data.newAchievements);
          setShowAchievementPopup(true);
        }
      }
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  }

  function shareScore() {
    const text = `🎯 Exam Rescue Battle!\n📊 Score: ${battleScore} XP\n✅ ${battleCorrectCount}/${battleQuestions.length} correct\n🔥 Max Combo: x${battleMaxCombo}\n⏱️ Time: ${battleStartTime ? Math.round((Date.now() - battleStartTime) / 1000) : 0}s\n\nPlay now: examrescue.pages.dev`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  // Timer
  useEffect(() => {
    if (battleQuestions.length > 0 && !battleIsComplete && !battleAnswered) {
      setBattleTimer(TIMER_DURATION);
      timerRef.current = setInterval(() => {
        setBattleTimer((prev: number) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [battleCurrentIndex, battleIsComplete, battleAnswered, battleQuestions.length]);

  const accuracy = battleQuestions.length > 0 ? Math.round((battleCorrectCount / battleQuestions.length) * 100) : 0;
  const timerPercentage = (battleTimer / TIMER_DURATION) * 100;
  const timerColor = battleTimer > 10 ? '#f97316' : '#ef4444';
  const isTimerDanger = battleTimer <= 10 && battleTimer > 0 && !battleAnswered;

  // Category Selection Screen
  if (!battleCategory) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">⚔️ Battle Mode</h2>
          <p className="text-white/60 text-sm sm:text-base">Choose your subject and prove your knowledge!</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => startBattle(cat)}
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

        <div className="glass-card p-4 w-full max-w-lg">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/50">
            <span>⏱️ 30s per question</span><span>•</span><span>🔥 Build combos</span><span>•</span><span>⚡ Earn XP</span>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (battleIsComplete) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">🏆 Battle Complete!</h2>
          <p className="text-white/60">Here&apos;s how you performed</p>
        </motion.div>

        <div className="glass-card p-6 w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="text-3xl font-bold text-neon-orange">{battleScore}</motion.p>
              <p className="text-xs text-white/50">XP Earned</p>
            </div>
            <div className="text-center">
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-3xl font-bold text-neon-green">{accuracy}%</motion.p>
              <p className="text-xs text-white/50">Accuracy</p>
            </div>
            <div className="text-center">
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }} className="text-3xl font-bold text-neon-amber">x{battleMaxCombo}</motion.p>
              <p className="text-xs text-white/50">Max Combo</p>
            </div>
            <div className="text-center">
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }} className="text-3xl font-bold text-white">{battleCorrectCount}/{battleQuestions.length}</motion.p>
              <p className="text-xs text-white/50">Correct</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} onClick={shareScore} className="neon-btn flex-1 bg-neon-green text-white font-semibold py-3 px-6 rounded-xl cursor-pointer">📤 Share Score</motion.button>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={() => { resetBattle(); setBattleCategory(null); }} className="neon-btn flex-1 bg-neon-orange text-white font-semibold py-3 px-6 rounded-xl cursor-pointer">🔄 Play Again</motion.button>
        </div>
      </div>
    );
  }

  // Battle Game Screen
  const currentQuestion = battleQuestions[battleCurrentIndex];

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto ${showShake ? 'screen-shake' : ''}`}>
      {showConfetti && <Confetti />}

      {scorePopups.map((popup) => (
        <div key={popup.id} className="score-popup text-neon-green" style={{ left: popup.x, top: popup.y }}>{popup.text}</div>
      ))}

      {/* Header: Progress + Timer + Combo */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm text-white/60">Q{battleCurrentIndex + 1} of {battleQuestions.length}</span>
            <span className="text-xs sm:text-sm font-bold text-neon-orange">{battleScore} XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-neon-orange to-neon-amber rounded-full xp-bar-shimmer" initial={{ width: 0 }} animate={{ width: `${((battleCurrentIndex + (battleAnswered ? 1 : 0)) / battleQuestions.length) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
        </div>

        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 ${isTimerDanger ? 'timer-danger border-neon-red' : 'border-neon-orange/50'}`}>
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="30" cy="30" r="26" fill="none" stroke={timerColor} strokeWidth="3" strokeLinecap="round" strokeDasharray={163.36} strokeDashoffset={163.36 * (1 - timerPercentage / 100)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <span className={`text-lg sm:text-xl font-bold ${isTimerDanger ? 'text-neon-red' : 'text-white'}`}>{battleTimer}</span>
        </div>
      </div>

      {battleCombo > 0 && (
        <motion.div key={battleCombo} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="combo-bounce text-center mb-4">
          <span className="text-2xl sm:text-3xl font-black gradient-text">🔥 x{battleCombo} COMBO!</span>
          {battleCombo >= 5 && <span className="block text-sm text-neon-amber font-bold">UNSTOPPABLE!</span>}
        </motion.div>
      )}

      {currentQuestion && (
        <QuestionCard question={currentQuestion} selectedIndex={battleSelectedAnswer} onAnswer={handleAnswer} answered={battleAnswered} mode="battle" />
      )}
    </div>
  );
}

function Confetti() {
  const colors = ['#f97316', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ffffff'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    size: `${Math.random() * 8 + 4}px`,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{ left: p.left, animationDelay: p.delay, width: p.size, height: p.size, background: p.color, borderRadius: Math.random() > 0.5 ? '50%' : '0', transform: `rotate(${p.rotation}deg)` }} />
      ))}
    </div>
  );
}
