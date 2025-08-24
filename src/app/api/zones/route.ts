import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const zones = await db.gameZone.findMany({
      orderBy: { unlockLevel: 'asc' },
    });

    return NextResponse.json({ success: true, data: zones });
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, unlockLevel } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Zone name is required' },
        { status: 400 }
      );
    }

    const newZone = await db.gameZone.create({
      data: {
        name,
        description,
        unlockLevel: unlockLevel || 1,
      },
    });

    return NextResponse.json({ success: true, data: newZone });
  } catch (error) {
    console.error('Error creating zone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create zone' },
      { status: 500 }
    );
  }
}