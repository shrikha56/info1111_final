'use client'

import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import NewMaintenanceForm from '../components/NewMaintenanceForm'
import supabase from '@/lib/supabase'

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  unit: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  category: string
  date: string
  property?: {
    unit_number: string
    address: string
  }
}

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Fetch maintenance requests from Supabase
  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true)
      console.log('Fetching maintenance requests...')
      
      // Fetch from API with cache control
      const response = await fetch('/api/maintenance', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched maintenance requests from API:', data)
      
      if (!Array.isArray(data)) {
        throw new Error('API did not return an array of maintenance requests')
      }
      
      // Transform the data to match our interface
      const formattedRequests = data.map((request: any) => ({
        id: request.id,
        title: request.title,
        description: request.description,
        unit: '101', // Default unit for consistency
        status: request.status || 'pending',
        priority: request.priority || 'medium',
        category: request.category || 'general',
        date: request.created_at ? new Date(request.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        property: {
          unit_number: '101',
          address: '123 Sunset Blvd, Sydney, Unit 101'
        }
      }))
      
      setRequests(formattedRequests)
    } catch (error) {
      console.error('Error fetching maintenance requests:', error)
      setError('Failed to load maintenance requests')
      
      // Only use mock data if we have no existing data
      if (requests.length === 0) {
        console.log('Using mock data as fallback')
        const mockRequests: MaintenanceRequest[] = [
          {
            id: 'mock-1',
            title: 'Demo Request 1',
            description: 'This is a demo maintenance request',
            unit: '101',
            status: 'pending',
            priority: 'medium',
            category: 'general',
            date: new Date().toISOString().split('T')[0],
            property: {
              unit_number: '101',
              address: '123 Sunset Blvd, Sydney, Unit 101'
            }
          },
          {
            id: 'mock-2',
            title: 'Demo Request 2',
            description: 'Another demo maintenance request',
            unit: '101',
            status: 'in-progress',
            priority: 'high',
            category: 'plumbing',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            property: {
              unit_number: '101',
              address: '123 Sunset Blvd, Sydney, Unit 101'
            }
          }
        ]
        setRequests(mockRequests)
      }
    } finally {
      setLoading(false)
    }
  }
  
  // Initial fetch
  useEffect(() => {
    fetchMaintenanceRequests()
  }, [])
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  })

  const handleNewRequest = async (data: any) => {
    try {
      setLoading(true)
      // Create request data
      const requestData = {
        title: data.title || 'Maintenance Request',
        description: data.description || 'Description needed',
        status: 'pending',
        priority: data.priority || 'medium',
        category: data.category || 'general'
      }
      
      console.log('Sending maintenance request with data:', requestData)
      
      // Determine which API endpoint to use based on hostname
      const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
      const apiEndpoint = isVercel ? '/api/vercel-maintenance' : '/api/direct-maintenance';
      console.log(`Using API endpoint: ${apiEndpoint} (Vercel: ${isVercel})`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestData),
      })
      
      // Parse the response
      const responseData = await response.json()
      console.log('API response:', responseData)
      
      // Format the new request to match our interface
      const formattedRequest: MaintenanceRequest = {
        id: responseData.id || `local-${Date.now()}`,
        title: responseData.title || requestData.title,
        description: responseData.description || requestData.description,
        unit: '101',
        status: responseData.status || 'pending',
        priority: responseData.priority || requestData.priority,
        category: responseData.category || requestData.category,
        date: responseData.created_at ? new Date(responseData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        property: {
          unit_number: '101',
          address: '123 Sunset Blvd, Sydney, Unit 101'
        }
      }
      
      console.log('Adding new request to UI:', formattedRequest)
      
      // Add the new request to the list immediately
      setRequests(prevRequests => [formattedRequest, ...prevRequests])
      
      // Close the modal
      setIsModalOpen(false)
      
      // Show success message
      setSuccessMessage('Maintenance request created successfully!')
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error in handleNewRequest:', error)
      setError('Failed to create maintenance request')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters to the requests
  const filteredRequests = requests.filter((request: MaintenanceRequest) => {
    if (filters.status && request.status !== filters.status) return false
    if (filters.priority && request.priority !== filters.priority) return false
    if (filters.category && request.category !== filters.category) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'in-progress': return 'bg-burgundy-100 dark:bg-burgundy-900 text-burgundy-800 dark:text-burgundy-200'
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
    }
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-black dark:text-white">Track and manage property maintenance issues</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-black dark:text-white bg-burgundy-700 dark:bg-burgundy-800 border border-transparent rounded-md hover:bg-burgundy-800 dark:hover:bg-burgundy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
        >
          New Request
        </button>
      </div>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded">
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select 
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="structural">Structural</option>
            <option value="appliances">Appliances</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700 mb-2"></div>
            <p className="text-gray-600 dark:text-white">Loading maintenance requests...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 dark:hover:bg-burgundy-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-white">No maintenance requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-black dark:text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
                      #{request.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black dark:text-white">{request.title}</div>
                      <div className="text-sm text-black dark:text-white">{request.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                      {request.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-burgundy-700 dark:text-burgundy-400 hover:text-burgundy-900 dark:hover:text-burgundy-300 mr-3">
                        View
                      </button>
                      <button className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Maintenance Request"
      >
        <NewMaintenanceForm
          onSubmit={handleNewRequest}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}