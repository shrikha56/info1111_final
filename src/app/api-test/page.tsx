'use client'

import { useState } from 'react'
import { BeakerIcon, DocumentTextIcon, BellIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

export default function ApiTestPage() {
  const [activeTab, setActiveTab] = useState('database')
  const [logs, setLogs] = useState<string[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearLogs = () => {
    setLogs([])
  }

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
                  <button 
                    onClick={async () => {
                      try {
                        addLog('Fetching maintenance requests from database...')
                        const res = await fetch('/api/maintenance')
                        const data = await res.json()
                        setMaintenanceRequests(data)
                        addLog(`✅ GET Success: Retrieved ${data.length} maintenance requests`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors mr-2"
                  >
                    Fetch Maintenance Requests
                  </button>
                  {maintenanceRequests.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Found {maintenanceRequests.length} requests</p>
                      <ul className="mt-2 text-sm space-y-1">
                        {maintenanceRequests.map((req: any) => (
                          <li key={req.id}>
                            <span className="font-medium">{req.title}</span> - {req.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Notifications</h3>
                  <button 
                    onClick={async () => {
                      try {
                        const userId = 'clw5hqvxl0000ztfkgbkqvzwc' // John Resident ID from seed
                        addLog(`Fetching notifications for user ${userId}...`)
                        const res = await fetch(`/api/notifications?userId=${userId}`)
                        const data = await res.json()
                        setNotifications(data)
                        addLog(`✅ GET Success: Retrieved ${data.length} notifications`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors mr-2"
                  >
                    Fetch Notifications
                  </button>
                  {notifications.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Found {notifications.length} notifications</p>
                      <ul className="mt-2 text-sm space-y-1">
                        {notifications.map((notif: any) => (
                          <li key={notif.id}>
                            <span className="font-medium">{notif.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-black">Announcements</h3>
                  <button 
                    onClick={async () => {
                      try {
                        addLog('Fetching announcements from database...')
                        const res = await fetch('/api/announcements')
                        const data = await res.json()
                        setAnnouncements(data)
                        addLog(`✅ GET Success: Retrieved ${data.length} announcements`)
                      } catch (error) {
                        addLog(`❌ Error: ${error}`)
                      }
                    }}
                    className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors mr-2"
                  >
                    Fetch Announcements
                  </button>
                  {announcements.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Found {announcements.length} announcements</p>
                      <ul className="mt-2 text-sm space-y-1">
                        {announcements.map((ann: any) => (
                          <li key={ann.id}>
                            <span className="font-medium">{ann.title}</span>
                          </li>
                        ))}
                      </ul>
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
