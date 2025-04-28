'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  date: string
}

export default function MaintenanceTestPage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch maintenance requests
  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/maintenance', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests')
      }
      
      const data = await response.json()
      console.log('Fetched maintenance requests:', data)
      
      // Format the data
      const formattedRequests = data.map((item: any) => ({
        id: item.id || 'unknown',
        title: item.title || 'No title',
        description: item.description || 'No description',
        status: item.status || 'pending',
        priority: item.priority || 'medium',
        category: item.category || 'general',
        date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }))
      
      setRequests(formattedRequests)
    } catch (error) {
      console.error('Error fetching requests:', error)
      setError('Failed to load maintenance requests')
    } finally {
      setLoading(false)
    }
  }
  
  // Submit a new request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Create request data
      const requestData = {
        title: newRequest.title,
        description: newRequest.description,
        status: 'pending',
        priority: newRequest.priority,
        category: newRequest.category
      }
      
      console.log('Submitting maintenance request:', requestData)
      
      // Submit the request
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(requestData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${errorData.error || response.statusText}`)
      }
      
      // Get the created request
      const createdRequest = await response.json()
      console.log('Created maintenance request:', createdRequest)
      
      // Format the new request
      const formattedRequest: MaintenanceRequest = {
        id: createdRequest.id || `new-${Date.now()}`,
        title: createdRequest.title || requestData.title,
        description: createdRequest.description || requestData.description,
        status: createdRequest.status || 'pending',
        priority: createdRequest.priority || requestData.priority,
        category: createdRequest.category || requestData.category,
        date: createdRequest.created_at ? new Date(createdRequest.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }
      
      // Add the new request to the list
      setRequests(prevRequests => [formattedRequest, ...prevRequests])
      
      // Reset the form
      setNewRequest({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general'
      })
      
      // Show success message
      setSuccessMessage('Maintenance request created successfully!')
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error creating request:', error)
      setError('Failed to create maintenance request')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewRequest(prev => ({ ...prev, [name]: value }))
  }
  
  // Load requests on mount
  useEffect(() => {
    fetchRequests()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Maintenance Requests (Test)</h1>
            <p className="text-gray-600">Create and view maintenance requests</p>
          </div>
          <Link href="/" className="text-burgundy-700 hover:text-burgundy-800">
            Back to Dashboard
          </Link>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
            {error}
            <button 
              onClick={() => { setError(null); fetchRequests(); }} 
              className="ml-2 underline"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* New Request Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">New Maintenance Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newRequest.title}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 text-black"
                  placeholder="e.g., Leaking Faucet in Kitchen"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newRequest.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 text-black"
                  placeholder="Please describe the issue in detail..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-black mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newRequest.priority}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 text-black"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newRequest.category}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 text-black"
                  >
                    <option value="general">General</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="structural">Structural</option>
                    <option value="appliances">Appliances</option>
                    <option value="hvac">HVAC</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-burgundy-700 text-white rounded-md hover:bg-burgundy-800 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Maintenance Requests List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-black">
            Maintenance Requests
          </h2>
          
          {loading && requests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Loading maintenance requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No maintenance requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {request.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-black">
                        <div className="font-medium">{request.title}</div>
                        <div className="text-gray-500 truncate max-w-xs">{request.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.priority === 'high' ? 'bg-red-100 text-red-800' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {request.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Refresh Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="px-4 py-2 text-sm text-burgundy-700 bg-white border border-burgundy-300 rounded-md hover:bg-burgundy-50 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh Requests'}
          </button>
        </div>
      </div>
    </div>
  )
}
