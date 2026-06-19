import { getBinding } from '@/lib/d1-client';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return Response.json({ error: 'Player ID required' }, { status: 400 });
    }

    const db = getBinding();

    // Fallback when D1 is not available
    if (!db) {
      return Response.json({
        id: playerId,
        name: 'Player',
        totalXp: 0,
        level: 1,
        currentStreak: 0,
        bestStreak: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        bestCombo: 0,
        gamesPlayed: 0,
        fastestCorrect: null,
        accuracy: 0,
        dailyActivity: [],
        fallback: true,
      });
    }

    const player = await db.prepare('SELECT * FROM Player WHERE id = ?').bind(playerId).first();

    if (!player) {
      return Response.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get daily activity (last 7 days)
    const activityResult = await db.prepare(
      'SELECT * FROM DailyActivity WHERE playerId = ? ORDER BY date DESC LIMIT 7'
    ).bind(playerId).all();

    const totalQ = player.totalQuestions as number;
    return Response.json({
      id: player.id,
      name: player.name,
      totalXp: player.totalXp,
      level: player.level,
      currentStreak: player.currentStreak,
      bestStreak: player.bestStreak,
      totalQuestions: totalQ,
      correctAnswers: player.correctAnswers,
      bestCombo: player.bestCombo,
      gamesPlayed: player.gamesPlayed,
      fastestCorrect: player.fastestCorrect,
      accuracy: totalQ > 0 ? Math.round(((player.correctAnswers as number) / totalQ) * 100) : 0,
      dailyActivity: activityResult.results,
    });
  } catch (error) {
    console.error('Player fetch error:', error);
    return Response.json({ error: 'Failed to fetch player' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, name } = body;

    if (!playerId || !name) {
      return Response.json({ error: 'Player ID and name required' }, { status: 400 });
    }

    const db = getBinding();

    // Fallback when D1 is not available
    if (!db) {
      return Response.json({ success: true, fallback: true, player: { id: playerId, name } });
    }

    const now = new Date().toISOString();
    await db.prepare(
      'UPDATE Player SET name = ?, updatedAt = ? WHERE id = ?'
    ).bind(name, now, playerId).run();

    const player = await db.prepare('SELECT * FROM Player WHERE id = ?').bind(playerId).first();

    return Response.json({ success: true, player });
  } catch (error) {
    console.error('Player update error:', error);
    return Response.json({ error: 'Failed to update player' }, { status: 500 });
  }
}
