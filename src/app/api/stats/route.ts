import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    const stats = await db.gameStats.findUnique({
      where: { playerId },
    });

    if (!stats) {
      return NextResponse.json(
        { success: false, error: 'Stats not found for this player' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game stats' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, ...updateData } = body;

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    const updatedStats = await db.gameStats.update({
      where: { playerId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedStats });
  } catch (error) {
    console.error('Error updating game stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update game stats' },
      { status: 500 }
    );
  }
}