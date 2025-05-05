'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Roboto_Mono } from 'next/font/google'

// Use Roboto Mono for code-like content
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function ApiTestPage() {
  const [activeTab, setActiveTab] = useState('maintenance')
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [queryForm, setQueryForm] = useState({
    table: 'maintenance_requests',
    field: 'status',
    value: 'pending',
    limit: '10'
  })

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearLogs = () => {
    setLogs([])
  }

  const testMaintenanceApi = async () => {
    try {
      setIsLoading(true)
      addLog('🔍 Testing maintenance API...')
      
      // GET request
      addLog('Fetching maintenance requests...')
      const getResponse = await fetch('/api/maintenance')
      const getData = await getResponse.json()
      addLog(`✅ GET Success: Retrieved ${Array.isArray(getData) ? getData.length : 0} maintenance requests`)
      
      // POST request
      addLog('Creating test maintenance request...')
      const postResponse = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Request ' + new Date().toLocaleTimeString(),
          description: 'This is a test request created from the API test page',
          priority: 'medium',
          category: 'general'
        })
      })
      
      const postData = await postResponse.json()
      addLog(`✅ POST Success: Created maintenance request with ID: ${postData.id || 'unknown'}`)
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const testNotificationsApi = async () => {
    try {
      setIsLoading(true)
      addLog('🔍 Testing notifications API...')
      
      // GET request with user ID
      addLog('Fetching notifications...')
      const response = await fetch('/api/notifications?userId=00000000-0000-0000-0000-000000000003')
      const data = await response.json()
      addLog(`✅ GET Success: Retrieved ${Array.isArray(data) ? data.length : 0} notifications`)
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const testAnnouncementsApi = async () => {
    try {
      setIsLoading(true)
      addLog('🔍 Testing announcements API...')
      
      // GET request
      addLog('Fetching announcements...')
      const response = await fetch('/api/announcements')
      const data = await response.json()
      addLog(`✅ GET Success: Retrieved ${Array.isArray(data) ? data.length : 0} announcements`)
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const testPdfApi = async () => {
    try {
      setIsLoading(true)
      addLog('🔍 Testing PDF generation API...')
      
      addLog('Requesting PDF download...')
      const response = await fetch('/api/generate-report')
      
      if (response.ok) {
        addLog('✅ PDF download successful')
        // Create a blob from the PDF Stream
        const blob = await response.blob()
        // Create a link element to trigger download
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = "strata-report.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        addLog(`❌ PDF download failed: ${response.status}`)
      }
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testDatabaseQuery = async () => {
    try {
      setIsLoading(true)
      addLog('🔍 Testing direct database query...')
      
      // Prepare query parameters
      const queryParams: any = {
        table: queryForm.table,
        limit: parseInt(queryForm.limit)
      }
      
      // Add query filter if field and value are provided
      if (queryForm.field && queryForm.value) {
        queryParams.query = {
          [queryForm.field]: queryForm.value
        }
      }
      
      addLog(`Querying table: ${queryForm.table} ${queryForm.field ? `WHERE ${queryForm.field} = ${queryForm.value}` : ''} LIMIT ${queryForm.limit}`)
      
      // Send the query request
      const response = await fetch('/api/database-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryParams)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        addLog(`✅ Query successful: Retrieved ${data.count} records`)
        addLog(`Results: ${JSON.stringify(data.data, null, 2)}`)
      } else {
        addLog(`❌ Query failed: ${data.error || response.statusText}`)
      }
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleQueryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setQueryForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold text-burgundy-800 ${robotoMono.className}`}>API Testing Dashboard</h1>
            <p className="text-gray-600 mt-1">Test and debug API endpoints and database queries</p>
          </div>
          <Link href="/" className="bg-burgundy-700 text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 transition-all shadow-md">
            Back to Dashboard
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'maintenance'
                  ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                  : 'text-gray-500 hover:text-burgundy-700'
              }`}
            >
              Maintenance Requests
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                  : 'text-gray-500 hover:text-burgundy-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'announcements'
                  ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                  : 'text-gray-500 hover:text-burgundy-700'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'pdf'
                  ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                  : 'text-gray-500 hover:text-burgundy-700'
              }`}
            >
              PDF Generation
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'database'
                  ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                  : 'text-gray-500 hover:text-burgundy-700'
              }`}
            >
              Database Query
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'maintenance' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-black">Test Maintenance API</h2>
                <p className="mb-4 text-gray-600">Test GET and POST operations for maintenance requests</p>
                
                <button
                  onClick={testMaintenanceApi}
                  disabled={isLoading}
                  className={`bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50 shadow-sm ${robotoMono.className}`}
                >
                  {isLoading ? 'Testing...' : 'Run Test'}
                </button>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-black">Test Notifications API</h2>
                <p className="mb-4 text-gray-600">Test GET operations for user notifications</p>
                
                <button
                  onClick={testNotificationsApi}
                  disabled={isLoading}
                  className={`bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50 shadow-sm ${robotoMono.className}`}
                >
                  {isLoading ? 'Testing...' : 'Run Test'}
                </button>
              </div>
            )}
            
            {activeTab === 'announcements' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-black">Test Announcements API</h2>
                <p className="mb-4 text-gray-600">Test GET operations for announcements</p>
                
                <button
                  onClick={testAnnouncementsApi}
                  disabled={isLoading}
                  className={`bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50 shadow-sm ${robotoMono.className}`}
                >
                  {isLoading ? 'Testing...' : 'Run Test'}
                </button>
              </div>
            )}
            
            {activeTab === 'pdf' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-black">Test PDF Generation API</h2>
                <p className="mb-4 text-gray-600">Test PDF download functionality</p>
                
                <button
                  onClick={testPdfApi}
                  disabled={isLoading}
                  className={`bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50 shadow-sm ${robotoMono.className}`}
                >
                  {isLoading ? 'Generating PDF...' : 'Download PDF'}
                </button>
              </div>
            )}
            
            {activeTab === 'database' && (
              <div>
                <h2 className={`text-xl font-semibold mb-4 text-burgundy-800 ${robotoMono.className}`}>Test Database Query</h2>
                <p className="mb-4 text-gray-600">Directly query database tables</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">Table</label>
                    <select
                      name="table"
                      value={queryForm.table}
                      onChange={handleQueryFormChange}
                      className={`w-full border border-gray-300 rounded-md p-2 focus:ring-burgundy-500 focus:border-burgundy-500 ${robotoMono.className}`}
                    >
                      <option value="users">Users</option>
                      <option value="buildings">Buildings</option>
                      <option value="properties">Properties</option>
                      <option value="maintenance_requests">Maintenance Requests</option>
                      <option value="comments">Comments</option>
                      <option value="announcements">Announcements</option>
                      <option value="notifications">Notifications</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">Limit</label>
                    <input
                      type="number"
                      name="limit"
                      value={queryForm.limit}
                      onChange={handleQueryFormChange}
                      min="1"
                      max="50"
                      className={`w-full border border-gray-300 rounded-md p-2 focus:ring-burgundy-500 focus:border-burgundy-500 ${robotoMono.className}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">Filter Field (optional)</label>
                    <input
                      type="text"
                      name="field"
                      value={queryForm.field}
                      onChange={handleQueryFormChange}
                      placeholder="e.g., status"
                      className={`w-full border border-gray-300 rounded-md p-2 focus:ring-burgundy-500 focus:border-burgundy-500 ${robotoMono.className}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-burgundy-700 mb-1">Filter Value (optional)</label>
                    <input
                      type="text"
                      name="value"
                      value={queryForm.value}
                      onChange={handleQueryFormChange}
                      placeholder="e.g., pending"
                      className={`w-full border border-gray-300 rounded-md p-2 focus:ring-burgundy-500 focus:border-burgundy-500 ${robotoMono.className}`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testDatabaseQuery}
                    disabled={isLoading}
                    className={`bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50 shadow-sm ${robotoMono.className}`}
                  >
                    {isLoading ? 'Querying...' : 'Run Query'}
                  </button>
                  
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 ml-4">
                    <span className="font-medium text-burgundy-700">Example queries:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>All maintenance requests: select table, leave filter empty</li>
                      <li>Pending requests: table=maintenance_requests, field=status, value=pending</li>
                      <li>User by role: table=users, field=role, value=resident</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Logs Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold text-burgundy-800 ${robotoMono.className}`}>Test Logs</h2>
            <button 
              onClick={clearLogs}
              className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-100 transition-colors shadow-sm"
            >
              Clear
            </button>
          </div>
          
          <div className={`bg-gray-900 text-white p-4 rounded-lg h-96 overflow-y-auto text-sm ${robotoMono.className}`}>
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
