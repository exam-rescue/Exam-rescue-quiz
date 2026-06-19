-- D1 Schema for Exam Rescue
-- Run: wrangler d1 migrations apply exam-rescue-db --remote

-- Players table
CREATE TABLE IF NOT EXISTS Player (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  totalXp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  currentStreak INTEGER NOT NULL DEFAULT 0,
  bestStreak INTEGER NOT NULL DEFAULT 0,
  totalQuestions INTEGER NOT NULL DEFAULT 0,
  correctAnswers INTEGER NOT NULL DEFAULT 0,
  bestCombo INTEGER NOT NULL DEFAULT 0,
  gamesPlayed INTEGER NOT NULL DEFAULT 0,
  fastestCorrect REAL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Scores table
CREATE TABLE IF NOT EXISTS Score (
  id TEXT PRIMARY KEY,
  playerId TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  xpEarned INTEGER NOT NULL,
  correctCount INTEGER NOT NULL,
  totalCount INTEGER NOT NULL,
  comboMax INTEGER NOT NULL,
  timeTaken REAL NOT NULL,
  mode TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (playerId) REFERENCES Player(id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS Achievement (
  id TEXT PRIMARY KEY,
  playerId TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlockedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (playerId) REFERENCES Player(id),
  UNIQUE(playerId, type)
);

-- Daily Activity table
CREATE TABLE IF NOT EXISTS DailyActivity (
  id TEXT PRIMARY KEY,
  playerId TEXT NOT NULL,
  date TEXT NOT NULL,
  questions INTEGER NOT NULL DEFAULT 0,
  xp INTEGER NOT NULL DEFAULT 0,
  games INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (playerId) REFERENCES Player(id),
  UNIQUE(playerId, date)
);

-- Questions table
CREATE TABLE IF NOT EXISTS Question (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  optionA TEXT NOT NULL,
  optionB TEXT NOT NULL,
  optionC TEXT NOT NULL,
  optionD TEXT NOT NULL,
  correct INTEGER NOT NULL,
  explanation TEXT,
  subject TEXT,
  chapter TEXT,
  difficulty TEXT,
  spell TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_score_player ON Score(playerId);
CREATE INDEX IF NOT EXISTS idx_score_created ON Score(createdAt);
CREATE INDEX IF NOT EXISTS idx_achievement_player ON Achievement(playerId);
CREATE INDEX IF NOT EXISTS idx_daily_player_date ON DailyActivity(playerId, date);
CREATE INDEX IF NOT EXISTS idx_question_subject ON Question(subject);
CREATE INDEX IF NOT EXISTS idx_player_xp ON Player(totalXp DESC);
