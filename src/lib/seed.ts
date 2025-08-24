import { db } from './db';

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Trivia Questions
  const triviaCategories = ['animals', 'colors', 'numbers', 'everyday', 'food', 'science', 'geography', 'sports', 'music', 'space'];
  
  for (const category of triviaCategories) {
    const existingQuestions = await db.triviaQuestion.findMany({
      where: { category },
    });

    if (existingQuestions.length === 0) {
      console.log(`Adding trivia questions for category: ${category}`);
      
      // Sample questions for each category
      const sampleQuestions = [
        {
          question: `Sample ${category} question 1?`,
          category,
          difficulty: 1,
          correctAnswer: 'Correct Answer 1',
          answers: ['Correct Answer 1', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'],
          explanation: `This is a sample explanation for ${category} question 1.`,
        },
        {
          question: `Sample ${category} question 2?`,
          category,
          difficulty: 2,
          correctAnswer: 'Correct Answer 2',
          answers: ['Wrong Answer 1', 'Correct Answer 2', 'Wrong Answer 2', 'Wrong Answer 3'],
          explanation: `This is a sample explanation for ${category} question 2.`,
        },
        {
          question: `Sample ${category} question 3?`,
          category,
          difficulty: 3,
          correctAnswer: 'Correct Answer 3',
          answers: ['Wrong Answer 1', 'Wrong Answer 2', 'Correct Answer 3', 'Wrong Answer 3'],
          explanation: `This is a sample explanation for ${category} question 3.`,
        },
      ];

      for (const questionData of sampleQuestions) {
        await db.triviaQuestion.create({
          data: {
            question: questionData.question,
            category: questionData.category,
            difficulty: questionData.difficulty,
            correctAnswer: questionData.correctAnswer,
            explanation: questionData.explanation,
            answers: {
              create: questionData.answers.map((answer, index) => ({
                answer,
                isCorrect: answer === questionData.correctAnswer,
              })),
            },
          },
        });
      }
    }
  }

  // Seed Spanish Lessons
  const spanishCategories = ['animals', 'colors', 'numbers', 'family', 'food', 'clothes', 'home', 'school'];
  
  for (const category of spanishCategories) {
    const existingLessons = await db.spanishLesson.findMany({
      where: { category },
    });

    if (existingLessons.length === 0) {
      console.log(`Adding Spanish lessons for category: ${category}`);
      
      // Sample lessons for each category
      const sampleLessons = [
        {
          spanishWord: `Palabra ${category} 1`,
          englishWord: `Word ${category} 1`,
          category,
          difficulty: 1,
          emoji: '📚',
        },
        {
          spanishWord: `Palabra ${category} 2`,
          englishWord: `Word ${category} 2`,
          category,
          difficulty: 2,
          emoji: '📚',
        },
        {
          spanishWord: `Palabra ${category} 3`,
          englishWord: `Word ${category} 3`,
          category,
          difficulty: 3,
          emoji: '📚',
        },
      ];

      for (const lessonData of sampleLessons) {
        await db.spanishLesson.create({
          data: lessonData,
        });
      }
    }
  }

  // Seed Game Zones
  const existingZones = await db.gameZone.findMany();
  
  if (existingZones.length === 0) {
    console.log('Adding game zones...');
    
    const zones = [
      { name: 'Yard', description: 'A sunny yard where puppies can play and run around', unlockLevel: 1 },
      { name: 'Living Room', description: 'Cozy indoor space for cuddling and relaxation', unlockLevel: 5 },
      { name: 'Park', description: 'Adventure playground with new friends and obstacles', unlockLevel: 10 },
      { name: 'Playground', description: 'Ultimate fun zone with slides and swings', unlockLevel: 15 },
    ];

    for (const zoneData of zones) {
      await db.gameZone.create({
        data: zoneData,
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });