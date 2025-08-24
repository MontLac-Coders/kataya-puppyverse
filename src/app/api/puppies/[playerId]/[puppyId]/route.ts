import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const puppies = await db.puppy.findMany({
      where: { playerId: params.playerId },
    });

    return NextResponse.json({ success: true, data: puppies });
  } catch (error) {
    console.error('Error fetching puppies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch puppies' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { playerId: string; puppyId: string } }
) {
  try {
    const body = await request.json();
    const { happiness, hunger, energy, experience, skills } = body;

    const puppy = await db.puppy.update({
      where: { 
        id: params.puppyId,
        playerId: params.playerId,
      },
      data: {
        ...(happiness !== undefined && { happiness }),
        ...(hunger !== undefined && { hunger }),
        ...(energy !== undefined && { energy }),
        ...(experience !== undefined && { experience }),
      },
    });

    return NextResponse.json({ success: true, data: puppy });
  } catch (error) {
    console.error('Error updating puppy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update puppy' },
      { status: 500 }
    );
  }
}