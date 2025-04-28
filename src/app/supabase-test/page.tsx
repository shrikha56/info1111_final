'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabase'

export default function SupabaseTestPage() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)

  // Test direct Supabase connection
  const testSupabaseConnection = async () => {
    setLoading(true)
    try {
      // Test maintenance_requests table
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setMaintenanceRequests(data || [])
      setTestResult({
        success: true,
        message: 'Successfully connected to Supabase',
        count: data?.length || 0
      })
    } catch (err) {
      console.error('Supabase test failed:', err)
      setError(err instanceof Error ? err.message : String(err))
      setTestResult({
        success: false,
        message: 'Failed to connect to Supabase',
        error: err instanceof Error ? err.message : String(err)
      })
    } finally {
      setLoading(false)
    }
  }

  // Create a test maintenance request
  const createTestRequest = async () => {
    setLoading(true)
    try {
      const newRequest = {
        title: `Test Request ${new Date().toLocaleTimeString()}`,
        description: 'This is a test request created from the Supabase test page',
        status: 'pending',
        priority: 'medium',
        category: 'general',
        requester_id: '00000000-0000-0000-0000-000000000003', // John Resident
        property_id: '00000000-0000-0000-0000-000000000001'   // Property 101
      }
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(newRequest)
        .select()
      
      if (error) throw error
      
      setTestResult({
        success: true,
        message: 'Successfully created test maintenance request',
        data
      })
      
      // Refresh the list
      testSupabaseConnection()
    } catch (err) {
      console.error('Create test request failed:', err)
      setError(err instanceof Error ? err.message : String(err))
      setTestResult({
        success: false,
        message: 'Failed to create test maintenance request',
        error: err instanceof Error ? err.message : String(err)
      })
    } finally {
      setLoading(false)
    }
  }

  // Run the test on page load
  useEffect(() => {
    testSupabaseConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Supabase Test Page</h1>
            <p className="text-gray-600">Test direct Supabase connection</p>
          </div>
          <Link href="/" className="text-burgundy-700 hover:text-burgundy-800">
            Back to Dashboard
          </Link>
        </div>
        
        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button
              onClick={createTestRequest}
              disabled={loading}
              className="bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Test Request'}
            </button>
          </div>
          
          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-medium ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.message}
              </h3>
              {testResult.count !== undefined && (
                <p className="mt-1 text-sm">Found {testResult.count} maintenance requests</p>
              )}
              {testResult.error && (
                <p className="mt-1 text-sm text-red-600">{testResult.error}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Maintenance Requests */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Maintenance Requests in Supabase</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-burgundy-700"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700">{error}</p>
              <button
                onClick={testSupabaseConnection}
                className="mt-2 text-sm text-burgundy-700 hover:text-burgundy-800"
              >
                Try Again
              </button>
            </div>
          ) : maintenanceRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No maintenance requests found in Supabase.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {request.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-black">{request.title}</div>
                        <div className="text-sm text-gray-500">{request.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.priority === 'high' ? 'bg-red-100 text-red-800' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(request.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* JSON Debug */}
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-white">Raw Data</h3>
          <pre className="text-xs text-gray-300 overflow-auto max-h-96">
            {JSON.stringify(maintenanceRequests, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
