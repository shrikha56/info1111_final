import { NextRequest, NextResponse } from 'next/server';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'emergency' | 'maintenance';
  createdAt: string;
  expiresAt?: string;
}

// In-memory store (replace with database in production)
let announcements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Building Maintenance',
    content: 'Scheduled maintenance work next week',
    type: 'maintenance',
    createdAt: '2025-04-01T00:00:00Z',
    expiresAt: '2025-04-08T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  console.log('📣 Fetching announcements...');
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  console.log(`🔍 Filter type: ${type || 'none'}`);
  let filteredAnnouncements = [...announcements];
  
  // Filter by type if specified
  if (type) {
    filteredAnnouncements = filteredAnnouncements.filter(a => a.type === type);
    console.log(`📋 Found ${filteredAnnouncements.length} announcements of type: ${type}`);
  }
  
  // Filter out expired announcements
  const now = new Date();
  filteredAnnouncements = filteredAnnouncements.filter(a => {
    if (!a.expiresAt) return true;
    return new Date(a.expiresAt) > now;
  });

  console.log(`✅ Returning ${filteredAnnouncements.length} active announcements`);
  return NextResponse.json(filteredAnnouncements);
}

export async function POST(request: NextRequest) {
  console.log('📝 Creating new announcement...');
  try {
    const data = await request.json();
    console.log('📦 Received announcement data:', data);
    
    const newAnnouncement: Announcement = {
      id: `ann-${String(announcements.length + 1).padStart(3, '0')}`,
      title: data.title,
      content: data.content,
      type: data.type,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt
    };

    announcements.unshift(newAnnouncement);
    console.log(`✅ Created announcement with ID: ${newAnnouncement.id}`);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 400 }
    );
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

    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) {
      console.log(`❌ Error: Announcement with ID ${id} not found`);
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    announcements.splice(index, 1);
    console.log(`✅ Successfully deleted announcement with ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 400 }
    );
  }
}
