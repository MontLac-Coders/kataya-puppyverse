import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const questions = await db.triviaQuestion.findMany({
      include: {
        answers: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trivia questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, category, difficulty, correctAnswer, answers, explanation, funFact } = body;

    if (!question || !category || !correctAnswer || !answers) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the question
    const newQuestion = await db.triviaQuestion.create({
      data: {
        question,
        category,
        difficulty: difficulty || 1,
        correctAnswer,
        explanation,
        funFact,
        answers: {
          create: answers.map((answer: string, index: number) => ({
            answer,
            isCorrect: answer === correctAnswer,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json({ success: true, data: newQuestion });
  } catch (error) {
    console.error('Error creating trivia question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create trivia question' },
      { status: 500 }
    );
  }
}