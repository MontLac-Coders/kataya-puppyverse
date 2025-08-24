import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const players = await db.player.findMany({
      include: {
        puppies: true,
        inventory: true,
        gameStats: true,
        triviaProgress: true,
        spanishProgress: true,
        unlockedZones: {
          include: {
            zone: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if player already exists
    const existingPlayer = await db.player.findUnique({
      where: { name },
    });

    if (existingPlayer) {
      return NextResponse.json(
        { success: false, error: 'Player already exists' },
        { status: 400 }
      );
    }

    // Create new player
    const player = await db.player.create({
      data: {
        name,
        level: 1,
        experience: 0,
        coins: 100,
        puppies: {
          create: [
            {
              name: 'KK',
              personality: 'energetic',
              happiness: 100,
              hunger: 80,
              energy: 100,
              ageStage: 'baby',
              age: 0,
            },
            {
              name: 'Hailey',
              personality: 'calm',
              happiness: 100,
              hunger: 80,
              energy: 100,
              ageStage: 'baby',
              age: 0,
            },
          ],
        },
        gameStats: {
          create: {
            triviaQuestionsAnswered: 0,
            triviaCorrectAnswers: 0,
            spanishWordsLearned: 0,
            spanishLessonsCompleted: 0,
            puppyInteractions: 0,
            puppyFeedings: 0,
            puppyPlaySessions: 0,
            totalPlayTime: 0,
            sessionsCompleted: 0,
          },
        },
        unlockedZones: {
          create: [
            {
              zone: {
                connectOrCreate: {
                  where: { name: 'Yard' },
                  create: {
                    name: 'Yard',
                    description: 'A sunny yard where puppies can play and run around',
                    unlockLevel: 1,
                  },
                },
              },
            },
          ],
        },
      },
      include: {
        puppies: true,
        inventory: true,
        gameStats: true,
        triviaProgress: true,
        spanishProgress: true,
        unlockedZones: {
          include: {
            zone: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: player });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create player' },
      { status: 500 }
    );
  }
}