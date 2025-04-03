import { NextRequest, NextResponse } from 'next/server';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'maintenance' | 'announcement' | 'alert';
  read: boolean;
  createdAt: string;
}

// In-memory store (replace with database in production)
let notifications: Notification[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  const userNotifications = notifications.filter(n => n.userId === userId);
  return NextResponse.json(userNotifications);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newNotification: Notification = {
      id: `NOT-${String(notifications.length + 1).padStart(3, '0')}`,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      read: false,
      createdAt: new Date().toISOString()
    };

    notifications.unshift(newNotification);
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const notification = notifications.find(n => n.id === data.id);
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    notification.read = true;
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 400 }
    );
  }
}
