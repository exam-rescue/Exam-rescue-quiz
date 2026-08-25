import { getBinding } from '@/lib/d1-client';
import { questionBank } from '@/lib/questions';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'Mixed';
    const count = parseInt(searchParams.get('count') || '10');

    const db = getBinding();

    // Fallback to embedded data when D1 is not available
    if (!db) {
      let pool = questionBank;
      if (category !== 'Mixed') {
        pool = questionBank.filter((q) => q.subject === category);
      }
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));
      return Response.json({
        questions: selected.map((q) => ({
          id: q.id,
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correct: q.correct,
          explanation: q.explanation,
          subject: q.subject,
          difficulty: q.difficulty,
        })),
        total: selected.length,
      });
    }

    let questions;
    if (category === 'Mixed') {
      const result = await db.prepare('SELECT * FROM Question ORDER BY RANDOM() LIMIT ?').bind(count).all();
      questions = result.results;
    } else {
      const result = await db.prepare('SELECT * FROM Question WHERE subject = ? ORDER BY RANDOM() LIMIT ?').bind(category, count).all();
      questions = result.results;
    }

    return Response.json({
      questions: (questions as Array<Record<string, unknown>>).map((q) => {
        // Normalize correct answer to 1-4 number
        let correctNum = 1;
        const raw = q.correct;
        if (typeof raw === 'number') {
          correctNum = raw;
        } else if (typeof raw === 'string') {
          const map: Record<string, number> = { '1': 1, '2': 2, '3': 3, '4': 4, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'a': 1, 'b': 2, 'c': 3, 'd': 4 };
          correctNum = map[raw] || 1;
        }
        return {
          id: q.id !== null && q.id !== undefined ? String(q.id) : `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correct: correctNum,
          explanation: q.explanation || '',
          subject: q.subject,
          difficulty: q.difficulty || 'easy',
        };
      }),
      total: questions.length,
    });
  } catch (error) {
    console.error('Questions fetch error:', error);
    return Response.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
