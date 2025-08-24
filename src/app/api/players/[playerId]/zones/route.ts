import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const unlockedZones = await db.unlockedZone.findMany({
      where: { playerId: params.playerId },
      include: {
        zone: true,
      },
    });

    return NextResponse.json({ success: true, data: unlockedZones });
  } catch (error) {
    console.error('Error fetching unlocked zones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch unlocked zones' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const body = await request.json();
    const { zoneId } = body;

    if (!zoneId) {
      return NextResponse.json(
        { success: false, error: 'Zone ID is required' },
        { status: 400 }
      );
    }

    // Check if zone is already unlocked
    const existingUnlock = await db.unlockedZone.findFirst({
      where: {
        playerId: params.playerId,
        zoneId,
      },
    });

    if (existingUnlock) {
      return NextResponse.json(
        { success: false, error: 'Zone already unlocked' },
        { status: 400 }
      );
    }

    // Unlock the zone
    const unlockedZone = await db.unlockedZone.create({
      data: {
        playerId: params.playerId,
        zoneId,
      },
      include: {
        zone: true,
      },
    });

    return NextResponse.json({ success: true, data: unlockedZone });
  } catch (error) {
    console.error('Error unlocking zone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unlock zone' },
      { status: 500 }
    );
  }
}