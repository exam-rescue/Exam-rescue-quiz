import { getBinding } from '@/lib/d1-client';
import { achievementDefs } from '@/lib/questions';

export const runtime = 'edge';

interface ScoreBody {
  playerId?: string;
  playerName?: string;
  category?: string;
  xpEarned?: number;
  correctCount?: number;
  totalCount?: number;
  comboMax?: number;
  timeTaken?: number;
  mode?: string;
  subjectsPlayed?: string[];
}

export async function POST(request: Request) {
  try {
    const body: ScoreBody = await request.json();
    const {
      playerId,
      playerName,
      category,
      xpEarned = 0,
      correctCount = 0,
      totalCount = 0,
      comboMax = 0,
      timeTaken = 0,
      mode,
      subjectsPlayed,
    } = body;

    const db = getBinding();

    // Fallback when D1 is not available
    if (!db) {
      const fakePlayerId = playerId || `fallback-${Date.now()}`;
      return Response.json({
        success: true,
        playerId: fakePlayerId,
        newXp: xpEarned,
        newAchievements: [],
        fallback: true,
      });
    }

    const now = new Date().toISOString();
    let effectivePlayerId = playerId;

    // Check if player exists
    let existingPlayer = null;
    if (playerId) {
      existingPlayer = await db.prepare('SELECT * FROM Player WHERE id = ?').bind(playerId).first();
    }

    if (existingPlayer) {
      effectivePlayerId = existingPlayer.id as string;
      const newTotalXp = (existingPlayer.totalXp as number) + xpEarned;
      const newTotalQuestions = (existingPlayer.totalQuestions as number) + totalCount;
      const newCorrectAnswers = (existingPlayer.correctAnswers as number) + correctCount;
      const newCurrentStreak = (existingPlayer.currentStreak as number) + 1;
      const newBestStreak = Math.max(existingPlayer.bestStreak as number, newCurrentStreak);
      const newBestCombo = Math.max(existingPlayer.bestCombo as number, comboMax);
      const avgTime = timeTaken / totalCount;
      const newFastest = existingPlayer.fastestCorrect === null
        ? avgTime
        : Math.min(existingPlayer.fastestCorrect as number, avgTime);

      await db.prepare(
        `UPDATE Player SET
          totalXp = ?, totalQuestions = ?, correctAnswers = ?,
          gamesPlayed = gamesPlayed + 1, bestCombo = ?,
          currentStreak = ?, bestStreak = ?,
          fastestCorrect = ?, updatedAt = ?
        WHERE id = ?`
      ).bind(newTotalXp, newTotalQuestions, newCorrectAnswers, newBestCombo, newCurrentStreak, newBestStreak, newFastest, now, effectivePlayerId).run();
    } else {
      // Create new player
      effectivePlayerId = playerId || `player-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const avgTime = totalCount > 0 ? timeTaken / totalCount : 0;
      await db.prepare(
        `INSERT INTO Player (id, name, totalXp, level, currentStreak, bestStreak, totalQuestions, correctAnswers, bestCombo, gamesPlayed, fastestCorrect, createdAt, updatedAt)
         VALUES (?, ?, ?, 1, 1, 1, ?, ?, ?, 1, ?, ?, ?)`
      ).bind(
        effectivePlayerId,
        playerName || 'Player',
        xpEarned,
        totalCount,
        correctCount,
        comboMax,
        avgTime,
        now,
        now
      ).run();
    }

    // Save score
    const scoreId = `score-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await db.prepare(
      `INSERT INTO Score (id, playerId, category, difficulty, xpEarned, correctCount, totalCount, comboMax, timeTaken, mode, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(scoreId, effectivePlayerId, category || 'Mixed', 'mixed', xpEarned, correctCount, totalCount, comboMax, timeTaken, mode || 'battle', now).run();

    // Update daily activity
    const today = new Date().toISOString().split('T')[0];
    const existingActivity = await db.prepare(
      'SELECT * FROM DailyActivity WHERE playerId = ? AND date = ?'
    ).bind(effectivePlayerId, today).first();

    if (existingActivity) {
      await db.prepare(
        `UPDATE DailyActivity SET questions = questions + ?, xp = xp + ?, games = games + 1 WHERE id = ?`
      ).bind(totalCount, xpEarned, existingActivity.id).run();
    } else {
      const activityId = `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await db.prepare(
        `INSERT INTO DailyActivity (id, playerId, date, questions, xp, games, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(activityId, effectivePlayerId, today, totalCount, xpEarned, 1, now).run();
    }

    // Check and unlock achievements
    const newAchievements: Array<{ type: string; name: string; description: string; icon: string }> = [];
    const existingAchievementsResult = await db.prepare(
      'SELECT type FROM Achievement WHERE playerId = ?'
    ).bind(effectivePlayerId).all();
    const existingTypes = new Set((existingAchievementsResult.results as Array<{ type: string }>).map((a) => a.type));

    // First Game
    if (!existingTypes.has('first_game')) {
      const achId = `ach-${effectivePlayerId}-first_game`;
      await db.prepare(
        `INSERT OR IGNORE INTO Achievement (id, playerId, type, name, description, icon, unlockedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(achId, effectivePlayerId, 'first_game', 'First Game', 'Complete your first quiz game', '🎮', now).run();
      newAchievements.push(achievementDefs[0]);
    }

    // Perfect Score
    if (!existingTypes.has('perfect_score') && correctCount === totalCount && totalCount === 10) {
      const achId = `ach-${effectivePlayerId}-perfect_score`;
      await db.prepare(
        `INSERT OR IGNORE INTO Achievement (id, playerId, type, name, description, icon, unlockedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(achId, effectivePlayerId, 'perfect_score', 'Perfect Score', 'Get 10/10 in a battle', '💯', now).run();
      newAchievements.push(achievementDefs[1]);
    }

    // Combo King
    if (!existingTypes.has('combo_king') && comboMax >= 5) {
      const achId = `ach-${effectivePlayerId}-combo_king`;
      await db.prepare(
        `INSERT OR IGNORE INTO Achievement (id, playerId, type, name, description, icon, unlockedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(achId, effectivePlayerId, 'combo_king', 'Combo King', 'Achieve a x5 combo', '👑', now).run();
      newAchievements.push(achievementDefs[4]);
    }

    // Get updated player total for milestone checks
    const updatedPlayer = await db.prepare('SELECT totalQuestions FROM Player WHERE id = ?').bind(effectivePlayerId).first();
    const totalQ = updatedPlayer ? (updatedPlayer.totalQuestions as number) : 0;

    // 100 Questions
    if (!existingTypes.has('100_questions') && totalQ >= 100) {
      const achId = `ach-${effectivePlayerId}-100_questions`;
      await db.prepare(
        `INSERT OR IGNORE INTO Achievement (id, playerId, type, name, description, icon, unlockedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(achId, effectivePlayerId, '100_questions', 'Century Club', 'Answer 100 questions total', '💯', now).run();
      newAchievements.push(achievementDefs[5]);
    }

    // 500 Questions
    if (!existingTypes.has('500_questions') && totalQ >= 500) {
      const achId = `ach-${effectivePlayerId}-500_questions`;
      await db.prepare(
        `INSERT OR IGNORE INTO Achievement (id, playerId, type, name, description, icon, unlockedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(achId, effectivePlayerId, '500_questions', 'Question Machine', 'Answer 500 questions total', '🤖', now).run();
      newAchievements.push(achievementDefs[6]);
    }

    // Subject Master
    if (!existingTypes.has('subject_master') && subjectsPlayed && subjectsPlayed.length >= 4) {
      const achId = `ach-${effectivePlayerId}-subject_master`;
      await db.prepare(
        `INSERT OR IGNORE INTO Achievement (id, playerId, type, name, description, icon, unlockedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(achId, effectivePlayerId, 'subject_master', 'Subject Master', 'Play all 4 subjects in battle mode', '📚', now).run();
      newAchievements.push(achievementDefs[7]);
    }

    // Get updated player XP
    const finalPlayer = await db.prepare('SELECT totalXp FROM Player WHERE id = ?').bind(effectivePlayerId).first();
    const newXp = finalPlayer ? (finalPlayer.totalXp as number) : xpEarned;

    return Response.json({
      success: true,
      playerId: effectivePlayerId,
      newXp,
      newAchievements,
    });
  } catch (error) {
    console.error('Score save error:', error);
    return Response.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
