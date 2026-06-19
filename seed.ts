import { db } from './src/lib/db';
import { questionBank } from './src/lib/questions';

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await db.score.deleteMany();
  await db.achievement.deleteMany();
  await db.dailyActivity.deleteMany();
  await db.question.deleteMany();
  await db.player.deleteMany();

  // Seed questions
  for (const q of questionBank) {
    await db.question.create({
      data: {
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
      },
    });
  }
  console.log(`Seeded ${questionBank.length} questions`);

  // Seed fake leaderboard players
  const fakePlayers = [
    { name: "Aarav Sharma", totalXp: 12500, level: 20, currentStreak: 12, bestStreak: 25, totalQuestions: 890, correctAnswers: 712, bestCombo: 8, gamesPlayed: 95, fastestCorrect: 1.2 },
    { name: "Priya Patel", totalXp: 9800, level: 16, currentStreak: 7, bestStreak: 18, totalQuestions: 650, correctAnswers: 520, bestCombo: 6, gamesPlayed: 72, fastestCorrect: 2.1 },
    { name: "Rahul Kumar", totalXp: 7200, level: 13, currentStreak: 5, bestStreak: 15, totalQuestions: 480, correctAnswers: 355, bestCombo: 5, gamesPlayed: 55, fastestCorrect: 3.0 },
    { name: "Ananya Singh", totalXp: 5400, level: 10, currentStreak: 3, bestStreak: 10, totalQuestions: 320, correctAnswers: 230, bestCombo: 4, gamesPlayed: 38, fastestCorrect: 2.5 },
    { name: "Vikram Reddy", totalXp: 3100, level: 7, currentStreak: 2, bestStreak: 8, totalQuestions: 200, correctAnswers: 140, bestCombo: 3, gamesPlayed: 25, fastestCorrect: 4.0 },
  ];

  for (const fp of fakePlayers) {
    const player = await db.player.create({ data: fp });
    // Create some scores for each player
    for (let i = 0; i < 3; i++) {
      await db.score.create({
        data: {
          playerId: player.id,
          category: ["Physics", "Chemistry", "Maths"][i],
          difficulty: "medium",
          xpEarned: Math.floor(Math.random() * 80) + 20,
          correctCount: Math.floor(Math.random() * 5) + 5,
          totalCount: 10,
          comboMax: Math.floor(Math.random() * 4) + 2,
          timeTaken: Math.floor(Math.random() * 150) + 60,
          mode: "battle",
        },
      });
    }
    // Create daily activity
    await db.dailyActivity.create({
      data: {
        playerId: player.id,
        date: new Date().toISOString().split('T')[0],
        questions: fp.totalQuestions % 50,
        xp: fp.totalXp % 500,
        games: fp.gamesPlayed % 10,
      },
    });
  }

  console.log(`Seeded ${fakePlayers.length} fake players`);

  console.log('Seed complete!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
