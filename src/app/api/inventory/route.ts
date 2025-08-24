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

    const inventory = await db.inventoryItem.findMany({
      where: { playerId },
      orderBy: { itemType: 'asc' },
    });

    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, itemType, name, quantity, rarity } = body;

    if (!playerId || !itemType || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if item already exists in inventory
    const existingItem = await db.inventoryItem.findFirst({
      where: {
        playerId,
        itemType,
        name,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await db.inventoryItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (quantity || 1),
        },
      });

      return NextResponse.json({ success: true, data: updatedItem });
    }

    // Create new item if it doesn't exist
    const newItem = await db.inventoryItem.create({
      data: {
        playerId,
        itemType,
        name,
        quantity: quantity || 1,
        rarity: rarity || 'common',
      },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add inventory item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, ...updateData } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const updatedItem = await db.inventoryItem.update({
      where: { id: itemId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}