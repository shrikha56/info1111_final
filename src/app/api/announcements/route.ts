import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log('📣 Fetching announcements...');
  try {
    // Check if we're in a deployment without a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      // Return mock data for demo purposes
      console.log('⚠️ No database connection, returning mock announcements');
      return NextResponse.json([
        {
          id: 'mock-ann-1',
          title: 'Building Maintenance Notice',
          content: 'This is a demo announcement when no database is available',
          type: 'general',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          buildingId: 'mock-building'
        },
        {
          id: 'mock-ann-2',
          title: 'Annual General Meeting',
          content: 'The annual general meeting will be held next month',
          type: 'general',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          buildingId: 'mock-building'
        }
      ]);
    }
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    console.log(`🔍 Filter type: ${type || 'none'}`);
    
    // Build the where clause for Prisma query
    const whereClause: any = {};
    
    // Filter by type if specified
    if (type) {
      whereClause.type = type;
      console.log(`🔍 Filtering announcements of type: ${type}`);
    }
    
    // Filter out expired announcements
    const now = new Date();
    whereClause.OR = [
      { expiresAt: null },
      { expiresAt: { gt: now } }
    ];
    
    // Query the database
    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`✅ Returning ${announcements.length} active announcements`);
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 'mock-error-ann',
        title: 'Demo Announcement (Database Error)',
        content: 'This is shown when the database connection fails',
        type: 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        buildingId: 'mock-building'
      }
    ]);
  }
}

export async function POST(request: NextRequest) {
  console.log('📝 Creating new announcement...');
  try {
    const data = await request.json();
    console.log('📦 Received announcement data:', data);
    
    // Check if we're in a deployment without a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      // Return mock data for demo purposes
      console.log('⚠️ No database connection, returning mock announcement');
      return NextResponse.json({
        id: 'mock-new-ann',
        title: data.title || 'Demo Announcement',
        content: data.content || 'This is a demo announcement created without a database',
        type: data.type || 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        buildingId: 'mock-building'
      }, { status: 201 });
    }
    
    // Create announcement in the database
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'general',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        building: {
          connect: { id: data.buildingId || (await prisma.building.findFirst()).id }
        }
      }
    });

    console.log(`✅ Created announcement with ID: ${newAnnouncement.id}`);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    // Return mock data in case of error
    return NextResponse.json({
      id: 'mock-error-new-ann',
      title: 'Demo Announcement (Error)',
      content: 'This is shown when the database connection fails',
      type: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildingId: 'mock-building'
    }, { status: 201 });
  }
}

export async function DELETE(request: NextRequest) {
  console.log('🗑 Deleting announcement...');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log(`🔍 Looking for announcement with ID: ${id}`);
    
    if (!id) {
      console.log('❌ Error: No announcement ID provided');
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    // Check if announcement exists
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });
    
    if (!announcement) {
      console.log(`❌ Error: Announcement with ID ${id} not found`);
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    // Delete the announcement from the database
    await prisma.announcement.delete({
      where: { id }
    });
    
    console.log(`✅ Successfully deleted announcement with ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 400 }
    );
  }
}
