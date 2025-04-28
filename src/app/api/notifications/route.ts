import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

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

    const { data: userNotifications, error } = await supabase
      .from('notifications')
      .select(`
        *,
        user:users(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(userNotifications || []);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: 'mock-error-notif',
        title: 'Demo Notification (Database Error)',
        message: 'This is shown when the database connection fails',
        is_read: false,
        created_at: new Date().toISOString(),
        user: { id: 'mock-user', name: 'Demo User', email: 'demo@example.com' }
      }
    ]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { data: newNotification, error } = await supabase
      .from('notifications')
      .insert([
        {
          title: data.title,
          message: data.message,
          is_read: false,
          user_id: data.userId
        }
      ])
      .select(`
        *,
        user:users(*)
      `)
      .single();
    
    if (error) {
      throw error;
    }

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
    const { data: notification, error: findError } = await supabase
      .from('notifications')
      .select('id')
      .eq('id', data.id)
      .single();
    
    if (findError || !notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Update notification to mark as read
    const { data: updatedNotification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', data.id)
      .select(`
        *,
        user:users(*)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 400 }
    );
  }
}
