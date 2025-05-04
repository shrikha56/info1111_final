'use client'

import { useState, useEffect } from 'react';
import { HomeIcon, UsersIcon, BuildingOfficeIcon, WrenchScrewdriverIcon, BellIcon } from '@heroicons/react/24/outline';
import supabase from '@/lib/supabase';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, changeColor, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-burgundy-100">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-sm ${changeColor}`}>{change}</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  statusColor: string;
  statusText: string;
}

function ActivityItem({ iconColor, icon, title, description, time, statusColor, statusText }: ActivityItemProps) {
  return (
    <div className="flex items-start">
      <div className={`p-2 rounded-full ${iconColor}`}>
        {icon}
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{time}</p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  // Icons
  const statIcon1 = <HomeIcon className="h-6 w-6 text-burgundy-700" />;
  const statIcon2 = <UsersIcon className="h-6 w-6 text-burgundy-700" />;
  const statIcon3 = <BuildingOfficeIcon className="h-6 w-6 text-burgundy-700" />;
  const maintenanceIcon = <WrenchScrewdriverIcon className="h-5 w-5 text-burgundy-700" />;
  const notificationIcon = <BellIcon className="h-5 w-5 text-blue-700" />;
  
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    buildings: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fetch dashboard data from API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        console.log('Fetching dashboard data from API...');
        
        // Use the dashboard data API endpoint
        const response = await fetch('/api/dashboard-data', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dashboard data received:', data);
        
        // Update stats
        setStats(data.stats);
        
        // Format activity items with icons
        const activityItems = data.recentActivity.map((item: any) => ({
          ...item,
          icon: item.type === 'maintenance' ? maintenanceIcon : notificationIcon
        }));
        
        setRecentActivity(activityItems);
        
        // You can also set upcoming tasks here if needed
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        
        // Set fallback data
        setStats({
          properties: 3,
          users: 5,
          buildings: 1
        });
        
        setRecentActivity([
          {
            id: 'fallback-1',
            type: 'maintenance',
            title: 'Maintenance request pending',
            description: 'Leaking faucet - Unit 101',
            time: new Date().toLocaleString(),
            status: 'pending',
            icon: maintenanceIcon
          },
          {
            id: 'fallback-2',
            type: 'maintenance',
            title: 'Maintenance request completed',
            description: 'Light fixture replacement - Unit 102',
            time: new Date(Date.now() - 86400000).toLocaleString(),
            status: 'completed',
            icon: maintenanceIcon
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-800 to-burgundy-600 opacity-95 rounded-t-xl"></div>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 rounded-t-xl"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">Welcome back, Admin</h1>
                <p className="mt-2 text-burgundy-100 text-lg">Here's what's happening with your properties today</p>
              </div>
              <div className="mt-4 md:mt-0 space-x-3">
                <a href="/api" target="_blank" className="inline-block bg-white text-burgundy-700 px-6 py-2 rounded-lg font-medium hover:bg-burgundy-50 transition-colors">
                  PHP Strata Manager
                </a>
                <a href="/nsw.gov.au-Changes to strata laws.pdf" target="_blank" className="inline-block bg-white text-burgundy-700 px-6 py-2 rounded-lg font-medium hover:bg-burgundy-50 transition-colors">
                  View Strata Laws
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          {loading ? (
            <div className="col-span-4 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700 mb-2"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="col-span-4 p-8 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-burgundy-700 text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <StatCard
                title="Total Units"
                value={stats.properties.toString()}
                change={`${stats.properties > 0 ? stats.properties : 'No'} properties found`}
                changeColor="text-gray-600"
                icon={statIcon1}
              />
              <StatCard
                title="Total Residents"
                value={stats.users.toString()}
                change={`${stats.users > 0 ? stats.users : 'No'} users found`}
                changeColor="text-gray-600"
                icon={statIcon2}
              />
              <StatCard
                title="Active Buildings"
                value={stats.buildings.toString()}
                change={`${stats.buildings > 0 ? stats.buildings : 'No'} buildings found`}
                changeColor="text-gray-600"
                icon={statIcon3}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy-700 mb-2"></div>
                  <p className="text-gray-600">Loading activity...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-600">No recent activity found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      iconColor={activity.type === 'maintenance' ? 'bg-burgundy-100' : 'bg-blue-100'}
                      icon={activity.icon}
                      title={activity.title}
                      description={activity.description}
                      time={activity.time}
                      statusColor={getStatusColor(activity.status)}
                      statusText={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy-700 mb-2"></div>
                  <p className="text-gray-600">Loading tasks...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <ActivityItem
                    iconColor="bg-blue-100"
                    icon={<BuildingOfficeIcon className="h-5 w-5 text-blue-700" />}
                    title="Committee meeting scheduled"
                    description="Annual general meeting"
                    time="Tomorrow, 10:00 AM"
                    statusColor="bg-blue-100 text-blue-800"
                    statusText="Upcoming"
                  />
                  <ActivityItem
                    iconColor="bg-yellow-100"
                    icon={<WrenchScrewdriverIcon className="h-5 w-5 text-yellow-700" />}
                    title="Inspection scheduled"
                    description="Fire safety inspection"
                    time="Next week"
                    statusColor="bg-yellow-100 text-yellow-800"
                    statusText="Scheduled"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
