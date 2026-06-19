import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActiveTab = 'home' | 'battle' | 'practice' | 'leaderboard' | 'profile';

export interface QuestionData {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: number;
  explanation: string;
  subject: string;
  difficulty: string;
}

interface GameState {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Player
  playerId: string | null;
  playerName: string;
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  playerXP: number;
  setPlayerXP: (xp: number) => void;
  playerLevel: number;
  setPlayerLevel: (level: number) => void;
  playerStreak: number;
  setPlayerStreak: (streak: number) => void;
  playerBestStreak: number;
  setPlayerBestStreak: (streak: number) => void;
  playerTotalQuestions: number;
  setPlayerTotalQuestions: (q: number) => void;
  playerCorrectAnswers: number;
  setPlayerCorrectAnswers: (a: number) => void;
  playerBestCombo: number;
  setPlayerBestCombo: (c: number) => void;
  playerGamesPlayed: number;
  setPlayerGamesPlayed: (g: number) => void;
  playerAccuracy: number;
  setPlayerAccuracy: (a: number) => void;
  playerFastestCorrect: number | null;
  setPlayerFastestCorrect: (f: number | null) => void;
  dailyActivity: Array<{ date: string; questions: number; xp: number; games: number }>;
  setDailyActivity: (a: Array<{ date: string; questions: number; xp: number; games: number }>) => void;
  subjectsPlayed: string[];
  addSubjectPlayed: (subject: string) => void;

  // Battle Mode
  battleQuestions: QuestionData[];
  setBattleQuestions: (q: QuestionData[]) => void;
  battleCurrentIndex: number;
  setBattleCurrentIndex: (i: number) => void;
  battleTimer: number;
  setBattleTimer: (t: number) => void;
  battleScore: number;
  setBattleScore: (s: number) => void;
  battleCombo: number;
  setBattleCombo: (c: number) => void;
  battleMaxCombo: number;
  setBattleMaxCombo: (c: number) => void;
  battleCorrectCount: number;
  setBattleCorrectCount: (c: number) => void;
  battleStartTime: number | null;
  setBattleStartTime: (t: number | null) => void;
  battleCategory: string | null;
  setBattleCategory: (c: string | null) => void;
  battleAnswered: boolean;
  setBattleAnswered: (a: boolean) => void;
  battleSelectedAnswer: number | null;
  setBattleSelectedAnswer: (a: number | null) => void;
  battleIsComplete: boolean;
  setBattleIsComplete: (c: boolean) => void;
  scorePopups: Array<{ id: number; text: string; x: number; y: number }>;
  addScorePopup: (text: string, x: number, y: number) => void;
  removeScorePopup: (id: number) => void;
  showConfetti: boolean;
  setShowConfetti: (s: boolean) => void;
  showShake: boolean;
  setShowShake: (s: boolean) => void;

  // Practice Mode
  practiceQuestions: QuestionData[];
  setPracticeQuestions: (q: QuestionData[]) => void;
  practiceCurrentIndex: number;
  setPracticeCurrentIndex: (i: number) => void;
  practiceCorrectCount: number;
  setPracticeCorrectCount: (c: number) => void;
  practiceCategory: string | null;
  setPracticeCategory: (c: string | null) => void;
  practiceAnswered: boolean;
  setPracticeAnswered: (a: boolean) => void;
  practiceSelectedAnswer: number | null;
  setPracticeSelectedAnswer: (a: number | null) => void;
  practiceIsComplete: boolean;
  setPracticeIsComplete: (c: boolean) => void;

  // New Achievements
  newAchievements: Array<{ type: string; name: string; description: string; icon: string }>;
  setNewAchievements: (a: Array<{ type: string; name: string; description: string; icon: string }>) => void;
  showAchievementPopup: boolean;
  setShowAchievementPopup: (s: boolean) => void;

  // Reset
  resetBattle: () => void;
  resetPractice: () => void;
}

let popupIdCounter = 0;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Player
      playerId: null,
      playerName: '',
      setPlayerId: (id) => set({ playerId: id }),
      playerName: '',
      setPlayerName: (name) => set({ playerName: name }),
      playerXP: 0,
      setPlayerXP: (xp) => set({ playerXP: xp }),
      playerLevel: 1,
      setPlayerLevel: (level) => set({ playerLevel: level }),
      playerStreak: 0,
      setPlayerStreak: (streak) => set({ playerStreak: streak }),
      playerBestStreak: 0,
      setPlayerBestStreak: (streak) => set({ playerBestStreak: streak }),
      playerTotalQuestions: 0,
      setPlayerTotalQuestions: (q) => set({ playerTotalQuestions: q }),
      playerCorrectAnswers: 0,
      setPlayerCorrectAnswers: (a) => set({ playerCorrectAnswers: a }),
      playerBestCombo: 0,
      setPlayerBestCombo: (c) => set({ playerBestCombo: c }),
      playerGamesPlayed: 0,
      setPlayerGamesPlayed: (g) => set({ playerGamesPlayed: g }),
      playerAccuracy: 0,
      setPlayerAccuracy: (a) => set({ playerAccuracy: a }),
      playerFastestCorrect: null,
      setPlayerFastestCorrect: (f) => set({ playerFastestCorrect: f }),
      dailyActivity: [],
      setDailyActivity: (a) => set({ dailyActivity: a }),
      subjectsPlayed: [],
      addSubjectPlayed: (subject) => {
        const current = get().subjectsPlayed;
        if (!current.includes(subject)) {
          set({ subjectsPlayed: [...current, subject] });
        }
      },

      // Battle
      battleQuestions: [],
      setBattleQuestions: (q) => set({ battleQuestions: q }),
      battleCurrentIndex: 0,
      setBattleCurrentIndex: (i) => set({ battleCurrentIndex: i }),
      battleTimer: 30,
      setBattleTimer: (t) => set({ battleTimer: t }),
      battleScore: 0,
      setBattleScore: (s) => set({ battleScore: s }),
      battleCombo: 0,
      setBattleCombo: (c) => set({ battleCombo: c }),
      battleMaxCombo: 0,
      setBattleMaxCombo: (c) => set({ battleMaxCombo: c }),
      battleCorrectCount: 0,
      setBattleCorrectCount: (c) => set({ battleCorrectCount: c }),
      battleStartTime: null,
      setBattleStartTime: (t) => set({ battleStartTime: t }),
      battleCategory: null,
      setBattleCategory: (c) => set({ battleCategory: c }),
      battleAnswered: false,
      setBattleAnswered: (a) => set({ battleAnswered: a }),
      battleSelectedAnswer: null,
      setBattleSelectedAnswer: (a) => set({ battleSelectedAnswer: a }),
      battleIsComplete: false,
      setBattleIsComplete: (c) => set({ battleIsComplete: c }),
      scorePopups: [],
      addScorePopup: (text, x, y) => {
        const id = popupIdCounter++;
        set((state) => ({
          scorePopups: [...state.scorePopups, { id, text, x, y }],
        }));
        setTimeout(() => {
          set((state) => ({
            scorePopups: state.scorePopups.filter((p) => p.id !== id),
          }));
        }, 1500);
      },
      removeScorePopup: (id) =>
        set((state) => ({ scorePopups: state.scorePopups.filter((p) => p.id !== id) })),
      showConfetti: false,
      setShowConfetti: (s) => {
        set({ showConfetti: s });
        if (s) setTimeout(() => set({ showConfetti: false }), 2000);
      },
      showShake: false,
      setShowShake: (s) => {
        set({ showShake: s });
        if (s) setTimeout(() => set({ showShake: false }), 500);
      },

      // Practice
      practiceQuestions: [],
      setPracticeQuestions: (q) => set({ practiceQuestions: q }),
      practiceCurrentIndex: 0,
      setPracticeCurrentIndex: (i) => set({ practiceCurrentIndex: i }),
      practiceCorrectCount: 0,
      setPracticeCorrectCount: (c) => set({ practiceCorrectCount: c }),
      practiceCategory: null,
      setPracticeCategory: (c) => set({ practiceCategory: c }),
      practiceAnswered: false,
      setPracticeAnswered: (a) => set({ practiceAnswered: a }),
      practiceSelectedAnswer: null,
      setPracticeSelectedAnswer: (a) => set({ practiceSelectedAnswer: a }),
      practiceIsComplete: false,
      setPracticeIsComplete: (c) => set({ practiceIsComplete: c }),

      // Achievements
      newAchievements: [],
      setNewAchievements: (a) => set({ newAchievements: a }),
      showAchievementPopup: false,
      setShowAchievementPopup: (s) => {
        set({ showAchievementPopup: s });
        if (s) setTimeout(() => set({ showAchievementPopup: false }), 4000);
      },

      // Reset
      resetBattle: () =>
        set({
          battleQuestions: [],
          battleCurrentIndex: 0,
          battleTimer: 30,
          battleScore: 0,
          battleCombo: 0,
          battleMaxCombo: 0,
          battleCorrectCount: 0,
          battleStartTime: null,
          battleCategory: null,
          battleAnswered: false,
          battleSelectedAnswer: null,
          battleIsComplete: false,
          scorePopups: [],
          showConfetti: false,
          showShake: false,
        }),

      resetPractice: () =>
        set({
          practiceQuestions: [],
          practiceCurrentIndex: 0,
          practiceCorrectCount: 0,
          practiceCategory: null,
          practiceAnswered: false,
          practiceSelectedAnswer: null,
          practiceIsComplete: false,
        }),
    }),
    {
      name: 'exam-rescue-store',
      partialize: (state) => ({
        playerId: state.playerId,
        playerName: state.playerName,
        playerXP: state.playerXP,
        playerLevel: state.playerLevel,
        playerStreak: state.playerStreak,
        playerBestStreak: state.playerBestStreak,
        playerTotalQuestions: state.playerTotalQuestions,
        playerCorrectAnswers: state.playerCorrectAnswers,
        playerBestCombo: state.playerBestCombo,
        playerGamesPlayed: state.playerGamesPlayed,
        playerAccuracy: state.playerAccuracy,
        playerFastestCorrect: state.playerFastestCorrect,
        subjectsPlayed: state.subjectsPlayed,
        dailyActivity: state.dailyActivity,
      }),
    }
  )
);
