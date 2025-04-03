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
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  let filteredAnnouncements = [...announcements];
  
  // Filter by type if specified
  if (type) {
    filteredAnnouncements = filteredAnnouncements.filter(a => a.type === type);
  }
  
  // Filter out expired announcements
  filteredAnnouncements = filteredAnnouncements.filter(a => {
    if (!a.expiresAt) return true;
    return new Date(a.expiresAt) > new Date();
  });

  return NextResponse.json(filteredAnnouncements);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newAnnouncement: Announcement = {
      id: `ann-${String(announcements.length + 1).padStart(3, '0')}`,
      title: data.title,
      content: data.content,
      type: data.type,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt
    };

    announcements.unshift(newAnnouncement);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    announcements.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 400 }
    );
  }
}
