import { getBinding } from '@/lib/d1-client';

export const runtime = 'edge';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const currentPlayerId = searchParams.get('playerId');

    const db = getBinding();

    // Fallback when D1 is not available
    if (!db) {
      const fakeLeaderboard: LeaderboardEntry[] = [
        { rank: 1, id: 'seed-1', name: 'QuizMaster3000', xp: 12500, level: 15, gamesPlayed: 52, bestCombo: 8, accuracy: 80, isCurrentPlayer: false },
        { rank: 2, id: 'seed-2', name: 'ScienceNerd42', xp: 8750, level: 10, gamesPlayed: 34, bestCombo: 6, accuracy: 80, isCurrentPlayer: false },
        { rank: 3, id: 'seed-3', name: 'BioBoss99', xp: 6200, level: 7, gamesPlayed: 26, bestCombo: 5, accuracy: 75, isCurrentPlayer: false },
        { rank: 4, id: 'seed-4', name: 'MathWizKid', xp: 3400, level: 5, gamesPlayed: 18, bestCombo: 4, accuracy: 68, isCurrentPlayer: false },
        { rank: 5, id: 'seed-5', name: 'CasualLearner', xp: 1200, level: 2, gamesPlayed: 9, bestCombo: 3, accuracy: 58, isCurrentPlayer: false },
      ];
      return Response.json({ leaderboard: fakeLeaderboard });
    }

    let dateFilterSQL = '';

    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      dateFilterSQL = `AND s.createdAt >= '${today}T00:00:00Z'`;
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilterSQL = `AND s.createdAt >= '${weekAgo.toISOString()}'`;
    }

    let leaderboard: LeaderboardEntry[];

    if (filter === 'all') {
      // Use totalXp from Player directly for 'all' filter
      const result = await db.prepare(
        'SELECT * FROM Player ORDER BY totalXp DESC LIMIT 20'
      ).all();

      leaderboard = (result.results as Array<Record<string, unknown>>).map((p, index) => ({
        rank: index + 1,
        id: p.id as string,
        name: p.name as string,
        xp: p.totalXp as number,
        level: p.level as number,
        gamesPlayed: p.gamesPlayed as number,
        bestCombo: p.bestCombo as number,
        accuracy: (p.totalQuestions as number) > 0
          ? Math.round(((p.correctAnswers as number) / (p.totalQuestions as number)) * 100)
          : 0,
        isCurrentPlayer: p.id === currentPlayerId,
      }));
    } else {
      // For filtered views, sum score XP within the time window
      const result = await db.prepare(
        `SELECT p.id, p.name, p.totalXp, p.level, p.gamesPlayed, p.bestCombo, p.totalQuestions, p.correctAnswers,
         COALESCE(SUM(s.xpEarned), 0) as filteredXp
         FROM Player p
         LEFT JOIN Score s ON s.playerId = p.id ${dateFilterSQL}
         GROUP BY p.id
         ORDER BY filteredXp DESC
         LIMIT 20`
      ).all();

      leaderboard = (result.results as Array<Record<string, unknown>>).map((p, index) => ({
        rank: index + 1,
        id: p.id as string,
        name: p.name as string,
        xp: p.filteredXp as number,
        level: p.level as number,
        gamesPlayed: p.gamesPlayed as number,
        bestCombo: p.bestCombo as number,
        accuracy: (p.totalQuestions as number) > 0
          ? Math.round(((p.correctAnswers as number) / (p.totalQuestions as number)) * 100)
          : 0,
        isCurrentPlayer: p.id === currentPlayerId,
      }));
    }

    return Response.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return Response.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
