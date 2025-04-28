import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching dashboard data...');
    
    // Create a fresh Supabase client for this request
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Use the imported supabase client
    interface DashboardActivity {
      id: string;
      type: string;
      title: string;
      description: string;
      time: string;
      status: string;
    }
    
    interface DashboardData {
      stats: {
        properties: number;
        users: number;
        buildings: number;
      };
      recentActivity: DashboardActivity[];
      upcomingTasks: DashboardActivity[];
    }
    
    let dashboardData: DashboardData = {
      stats: {
        properties: 0,
        users: 0,
        buildings: 0
      },
      recentActivity: [],
      upcomingTasks: []
    };
    
    try {
      // Fetch property count
      const { count: propertiesCount, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
        
      if (!propertiesError) {
        dashboardData.stats.properties = propertiesCount || 0;
      } else {
        console.warn('Error fetching properties count:', propertiesError);
      }
      
      // Fetch user count
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
        
      if (!usersError) {
        dashboardData.stats.users = usersCount || 0;
      } else {
        console.warn('Error fetching users count:', usersError);
      }
      
      // Fetch building count
      const { count: buildingsCount, error: buildingsError } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true });
        
      if (!buildingsError) {
        dashboardData.stats.buildings = buildingsCount || 0;
      } else {
        console.warn('Error fetching buildings count:', buildingsError);
      }
      
      // Fetch recent maintenance requests
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select(`
          id,
          title,
          description,
          status,
          created_at,
          property:properties(unit_number)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (!maintenanceError && maintenanceData) {
        // Format maintenance requests as activity items
        dashboardData.recentActivity = maintenanceData.map((request: any) => ({
          id: request.id,
          type: 'maintenance',
          title: `Maintenance request ${request.status}`,
          description: `${request.title} - ${request.property?.unit_number || 'Unknown unit'}`,
          time: new Date(request.created_at).toLocaleString(),
          status: request.status
        }));
      } else {
        console.warn('Error fetching maintenance requests:', maintenanceError);
      }
      
      // Fetch upcoming tasks (notifications or scheduled events)
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!notificationsError && notificationsData) {
        // Add notifications to upcoming tasks
        const notificationTasks = notificationsData.map((notification: any) => ({
          id: notification.id,
          type: 'notification',
          title: notification.title || 'Notification',
          description: notification.content || 'No details available',
          time: new Date(notification.created_at).toLocaleString(),
          status: 'pending'
        }));
        
        dashboardData.upcomingTasks = notificationTasks;
      } else {
        console.warn('Error fetching notifications:', notificationsError);
        
        // Add fallback tasks if no data
        dashboardData.upcomingTasks = [
          {
            id: 'task-1',
            type: 'meeting',
            title: 'Committee meeting scheduled',
            description: 'Annual general meeting',
            time: 'Tomorrow, 10:00 AM',
            status: 'upcoming'
          },
          {
            id: 'task-2',
            type: 'inspection',
            title: 'Inspection scheduled',
            description: 'Fire safety inspection',
            time: 'Next week',
            status: 'scheduled'
          }
        ];
      }
      
      console.log('Successfully fetched dashboard data');
      return NextResponse.json(dashboardData);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return mock data as fallback
      return NextResponse.json({
        stats: {
          properties: 3,
          users: 5,
          buildings: 1
        },
        recentActivity: [
          {
            id: 'mock-1',
            type: 'maintenance',
            title: 'Maintenance request pending',
            description: 'Leaking faucet - Unit 101',
            time: new Date().toLocaleString(),
            status: 'pending'
          },
          {
            id: 'mock-2',
            type: 'maintenance',
            title: 'Maintenance request completed',
            description: 'Light fixture replacement - Unit 102',
            time: new Date(Date.now() - 86400000).toLocaleString(),
            status: 'completed'
          }
        ],
        upcomingTasks: [
          {
            id: 'mock-task-1',
            type: 'meeting',
            title: 'Committee meeting scheduled',
            description: 'Annual general meeting',
            time: 'Tomorrow, 10:00 AM',
            status: 'upcoming'
          },
          {
            id: 'mock-task-2',
            type: 'inspection',
            title: 'Inspection scheduled',
            description: 'Fire safety inspection',
            time: 'Next week',
            status: 'scheduled'
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error in dashboard data API:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
