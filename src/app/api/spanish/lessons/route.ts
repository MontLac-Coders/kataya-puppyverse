import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const lessons = await db.spanishLesson.findMany({
      orderBy: [
        { category: 'asc' },
        { difficulty: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, data: lessons });
  } catch (error) {
    console.error('Error fetching Spanish lessons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Spanish lessons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      spanishWord, 
      englishWord, 
      category, 
      difficulty, 
      emoji, 
      pronunciation, 
      exampleSentence, 
      exampleTranslation 
    } = body;

    if (!spanishWord || !englishWord || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the lesson
    const newLesson = await db.spanishLesson.create({
      data: {
        spanishWord,
        englishWord,
        category,
        difficulty: difficulty || 1,
        emoji: emoji || '📚',
        pronunciation,
        imageUrl: '', // Can be added later
        audioUrl: '', // Can be added later
      },
    });

    return NextResponse.json({ success: true, data: newLesson });
  } catch (error) {
    console.error('Error creating Spanish lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Spanish lesson' },
      { status: 500 }
    );
  }
}