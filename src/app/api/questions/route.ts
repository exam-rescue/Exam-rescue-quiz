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
      const result = await db.prepare('SELECT * FROM Question ORDER BY id ASC').all();
      questions = result.results;
    } else {
      const result = await db.prepare('SELECT * FROM Question WHERE subject = ? ORDER BY id ASC').bind(category).all();
      questions = result.results;
    }

    // Shuffle
    questions = questions.sort(() => Math.random() - 0.5);
    const selected = questions.slice(0, Math.min(count, questions.length));

    return Response.json({
      questions: selected.map((q: Record<string, unknown>) => ({
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
  } catch (error) {
    console.error('Questions fetch error:', error);
    return Response.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
