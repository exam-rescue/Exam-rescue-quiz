import { getBinding } from '@/lib/d1-client';
import { achievementDefs } from '@/lib/questions';

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
      const allAchievements = achievementDefs.map((def) => ({
        ...def,
        unlocked: false,
        unlockedAt: null,
      }));
      return Response.json({ achievements: allAchievements, fallback: true });
    }

    const result = await db.prepare(
      'SELECT * FROM Achievement WHERE playerId = ?'
    ).bind(playerId).all();

    const unlockedAchievements = result.results as Array<{ type: string; unlockedAt: string }>;
    const unlockedTypes = new Set(unlockedAchievements.map((a) => a.type));

    const allAchievements = achievementDefs.map((def) => ({
      ...def,
      unlocked: unlockedTypes.has(def.type),
      unlockedAt: unlockedAchievements.find((a) => a.type === def.type)?.unlockedAt || null,
    }));

    return Response.json({ achievements: allAchievements });
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return Response.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}
