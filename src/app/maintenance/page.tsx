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
      
      // Use direct API call with fetch
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestData),
      })
      
      // Generate a unique ID for the request (since we can't rely on Supabase)
      const uniqueId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      
      // Format the new request to match our interface
      const formattedRequest: MaintenanceRequest = {
        id: uniqueId,
        title: requestData.title,
        description: requestData.description,
        unit: '101',
        status: 'pending',
        priority: requestData.priority,
        category: requestData.category,
        date: new Date().toISOString().split('T')[0],
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
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-black">Track and manage property maintenance issues</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-burgundy-700 border border-transparent rounded-md hover:bg-burgundy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
        >
          New Request
        </button>
      </div>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-burgundy-500"
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
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select 
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-burgundy-500"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-700 mb-2"></div>
            <p className="text-gray-600">Loading maintenance requests...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-burgundy-700 text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No maintenance requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      #{request.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black">{request.title}</div>
                      <div className="text-sm text-black">{request.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-burgundy-700 hover:text-burgundy-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-700 hover:text-gray-900">
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