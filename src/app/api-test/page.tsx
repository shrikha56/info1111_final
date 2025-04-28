'use client'

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { BeakerIcon, DocumentTextIcon, BellIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

export default function ApiTestPage() {
  const [activeTab, setActiveTab] = useState('database')
  const [logs, setLogs] = useState<string[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [databaseLoading, setDatabaseLoading] = useState(false);
  const [databaseLogs, setDatabaseLogs] = useState<Array<string>>([]);
  const [databaseData, setDatabaseData] = useState<any[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearLogs = () => {
    setLogs([])
  }

  // Database test functions
  const testMaintenanceRequests = async () => {
    setDatabaseLogs((prev: string[]) => [...prev, '🔍 Fetching maintenance requests...']);
    setDatabaseLoading(true);
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      setDatabaseLogs((prev: string[]) => [...prev, `✅ Received ${data?.length || 0} maintenance requests`]);
      setDatabaseData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setDatabaseLogs((prev: string[]) => [...prev, `❌ Error: ${errorMessage}`]);
    } finally {
      setDatabaseLoading(false);
    }
  };

  const testNotifications = async () => {
    setDatabaseLogs((prev: string[]) => [...prev, '🔍 Fetching notifications...']);
    setDatabaseLoading(true);
    try {
      // Using a mock user ID for testing
      const response = await fetch('/api/notifications?userId=mock-user-1');
      const data = await response.json();
      setDatabaseLogs((prev: string[]) => [...prev, `✅ Received ${data?.length || 0} notifications`]);
      setDatabaseData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setDatabaseLogs((prev: string[]) => [...prev, `❌ Error: ${errorMessage}`]);
    } finally {
      setDatabaseLoading(false);
    }
  };

  const testAnnouncements = async () => {
    setDatabaseLogs((prev: string[]) => [...prev, '🔍 Fetching announcements...']);
    setDatabaseLoading(true);
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      setDatabaseLogs((prev: string[]) => [...prev, `✅ Received ${data?.length || 0} announcements`]);
      setDatabaseData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setDatabaseLogs((prev: string[]) => [...prev, `❌ Error: ${errorMessage}`]);
    } finally {
      setDatabaseLoading(false);
    }
  };
  
  const testSupabaseConnection = async () => {
    setDatabaseLogs((prev: string[]) => [...prev, '🔍 Testing Supabase connection...']);
    setDatabaseLoading(true);
    try {
      const response = await fetch('/api/test-supabase');
      const data = await response.json();
      setDatabaseLogs((prev: string[]) => [...prev, `✅ Supabase connection: ${data.success ? 'Success' : 'Failed'}`]);
      if (data.message) {
        setDatabaseLogs((prev: string[]) => [...prev, `ℹ️ ${data.message}`]);
      }
      setDatabaseData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setDatabaseLogs((prev: string[]) => [...prev, `❌ Error: ${errorMessage}`]);
    } finally {
      setDatabaseLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">API Testing Dashboard</h1>
          <p className="mt-1 text-sm text-black">Test and debug API endpoints</p>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <button 
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'database' ? 'bg-white text-burgundy-700 border border-burgundy-700' : 'bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700'}`}
            onClick={() => setActiveTab('database')}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Database Test
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'maintenance' ? 'bg-white text-burgundy-700 border border-burgundy-700' : 'bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700'}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            Maintenance
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'notifications' ? 'bg-white text-burgundy-700 border border-burgundy-700' : 'bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700'}`}
            onClick={() => setActiveTab('notifications')}
          >
            <BellIcon className="h-5 w-5 mr-2" />
            Notifications
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'announcements' ? 'bg-white text-burgundy-700 border border-burgundy-700' : 'bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <BeakerIcon className="h-5 w-5 mr-2" />
            Announcements
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'pdf' ? 'bg-white text-burgundy-700 border border-burgundy-700' : 'bg-gray-100 text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700'}`}
            onClick={() => setActiveTab('pdf')}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            PDF Generation
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {activeTab === 'database' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">PostgreSQL Database Test</h2>
              <div className="p-4 bg-gray-50 rounded-lg mb-6 border border-gray-200">
                <h3 className="font-medium mb-2 text-black">How to Test Your PostgreSQL Database</h3>
                <p className="text-sm text-gray-700 mb-2">This panel allows you to test your PostgreSQL database connection by fetching data from your API endpoints. The database has been seeded with sample data using Prisma.</p>
                <p className="text-sm text-gray-700 mb-2">Each button below will make a direct API call to fetch data from your database tables. The results will be displayed below each section.</p>
                <p className="text-sm text-gray-700">If you're seeing fewer results than expected, check your database seeding and API implementation.</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 text-black">Maintenance Requests</h3>
                  <Button onClick={testMaintenanceRequests} disabled={databaseLoading}>
                    Test Maintenance Requests
                  </Button>
                  {maintenanceRequests.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Found {maintenanceRequests.length} requests</p>
                      <div className="flex gap-2 flex-wrap">
                        {maintenanceRequests.map((req: any) => (
                          <Badge key={req.id}>{req.title}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Notifications</h3>
                  <Button onClick={testNotifications} disabled={databaseLoading}>
                    Test Notifications
                  </Button>
                  {notifications.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Found {notifications.length} notifications</p>
                      <div className="flex gap-2 flex-wrap">
                        {notifications.map((notif: any) => (
                          <Badge key={notif.id}>{notif.title}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Announcements</h3>
                  <Button onClick={testAnnouncements} disabled={databaseLoading}>
                    Test Announcements
                  </Button>
                  {announcements.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Found {announcements.length} announcements</p>
                      <div className="flex gap-2 flex-wrap">
                        {announcements.map((ann: any) => (
                          <Badge key={ann.id}>{ann.title}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Supabase Connection</h3>
                  <Button onClick={testSupabaseConnection} disabled={databaseLoading}>
                    Test Supabase Connection
                  </Button>
                  {databaseData.success !== undefined && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Supabase Connection: {databaseData.success ? 'Success' : 'Failed'}</p>
                      {databaseData.message && (
                        <p className="text-sm text-gray-700">{databaseData.message}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'maintenance' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">Test Maintenance API</h2>
              <p className="mb-4 text-black">Test maintenance request operations</p>
              
              <div className="space-y-4">
                <div>
                  <button 
                    onClick={async () => {
                      try {
                        addLog('Fetching maintenance requests...')
                        const res = await fetch('/api/maintenance')
                        const data = await res.json()
                        addLog(`✅ GET Success: Retrieved ${data.length} maintenance requests`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors mr-2"
                  >
                    GET All
                  </button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Create New Request</h3>
                  <button 
                    onClick={async () => {
                      try {
                        const newRequest = {
                          title: 'Test Maintenance Request',
                          description: 'Created from test page',
                          priority: 'medium',
                          requesterId: 'clw5hqvxl0000ztfkgbkqvzwc', // John Resident ID
                          propertyId: 'clw5hqvxm0002ztfkfz8k9j2t' // Property 101 ID
                        }
                        
                        addLog('Creating maintenance request...')
                        const res = await fetch('/api/maintenance', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newRequest)
                        })
                        
                        const data = await res.json()
                        addLog(`✅ POST Success: Created request ${data.id}`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors"
                  >
                    Create Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">Test Notifications API</h2>
              <p className="mb-4 text-black">Test notification operations</p>
              
              <div className="space-y-4">
                <div>
                  <button 
                    onClick={async () => {
                      try {
                        const userId = 'clw5hqvxl0000ztfkgbkqvzwc' // John Resident ID
                        addLog(`Fetching notifications for user ${userId}...`)
                        const res = await fetch(`/api/notifications?userId=${userId}`)
                        const data = await res.json()
                        addLog(`✅ GET Success: Retrieved ${data.length} notifications`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors mr-2"
                  >
                    GET Notifications
                  </button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Create New Notification</h3>
                  <button 
                    onClick={async () => {
                      try {
                        const newNotification = {
                          userId: 'clw5hqvxl0000ztfkgbkqvzwc', // John Resident ID
                          title: 'Test Notification',
                          message: 'Created from test page'
                        }
                        
                        addLog('Creating notification...')
                        const res = await fetch('/api/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newNotification)
                        })
                        
                        const data = await res.json()
                        addLog(`✅ POST Success: Created notification ${data.id}`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors"
                  >
                    Create Notification
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">Test Announcements API</h2>
              <p className="mb-4 text-black">Test announcement operations</p>
              
              <div className="space-y-4">
                <div>
                  <button 
                    onClick={async () => {
                      try {
                        addLog('Fetching announcements...')
                        const res = await fetch('/api/announcements')
                        const data = await res.json()
                        addLog(`✅ GET Success: Retrieved ${data.length} announcements`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors mr-2"
                  >
                    GET All
                  </button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Create New Announcement</h3>
                  <button 
                    onClick={async () => {
                      try {
                        const newAnnouncement = {
                          title: 'Test Announcement',
                          content: 'Created from test page',
                          type: 'general'
                        }
                        
                        addLog('Creating announcement...')
                        const res = await fetch('/api/announcements', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newAnnouncement)
                        })
                        
                        const data = await res.json()
                        addLog(`✅ POST Success: Created announcement ${data.id}`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors"
                  >
                    Create Announcement
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">Test PDF Generation API</h2>
              <p className="mb-4 text-black">Test PDF download functionality</p>
              
              <div className="space-y-4">
                <div>
                  <button 
                    onClick={async () => {
                      try {
                        addLog('Requesting PDF download...')
                        const res = await fetch('/api/generate-report')
                        
                        if (res.ok) {
                          addLog('✅ PDF download successful')
                          // Create a blob from the PDF Stream
                          const blob = await res.blob()
                          // Create a link element to trigger download
                          const link = document.createElement('a')
                          link.href = URL.createObjectURL(blob)
                          link.download = "strata-laws.pdf"
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        } else {
                          addLog(`❌ PDF download failed: ${res.status}`)
                        }
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Logs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Test Logs</h2>
            <button 
              onClick={clearLogs}
              className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          </div>
          
          <div className="bg-gray-800 text-white p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-400">No logs yet. Run some tests to see results here.</p>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`py-1 ${
                    log.includes('❌') ? 'text-red-400' :
                    log.includes('✅') ? 'text-green-400' :
                    'text-blue-400'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
