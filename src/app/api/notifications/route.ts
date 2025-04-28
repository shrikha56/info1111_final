import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if we're in a deployment without a database connection
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      // Return mock data for demo purposes
      console.log('⚠️ No database connection, returning mock notifications');
      return NextResponse.json([
        {
          id: 'mock-notif-1',
          title: 'Maintenance Request Update',
          message: 'Your maintenance request has been updated',
          isRead: false,
          createdAt: new Date().toISOString(),
          userId: userId,
          user: { id: userId, name: 'Demo User', email: 'demo@example.com' }
        }
      ]);
    }

    const userNotifications = await prisma.notification.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 'mock-error-notif',
        title: 'Demo Notification (Database Error)',
        message: 'This is shown when the database connection fails',
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: 'mock-user',
        user: { id: 'mock-user', name: 'Demo User', email: 'demo@example.com' }
      }
    ]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newNotification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        isRead: false,
        user: {
          connect: { id: data.userId }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if notification exists
    const notification = await prisma.notification.findUnique({
      where: { id: data.id }
    });
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Update notification to mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id: data.id },
      data: { isRead: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 400 }
    );
  }
}
