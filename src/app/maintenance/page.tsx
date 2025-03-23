'use client'

import { useState } from 'react'
import Modal from '../components/Modal'
import NewMaintenanceForm from '../components/NewMaintenanceForm'

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  unit: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  category: string
  date: string
}

export default function MaintenancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState<MaintenanceRequest[]>([
    {
      id: 'MR-001',
      title: 'Water Leak',
      description: 'Kitchen Sink',
      unit: '12A',
      status: 'in-progress',
      priority: 'high',
      category: 'plumbing',
      date: '2025-03-23'
    },
    {
      id: 'MR-002',
      title: 'Broken Light',
      description: 'Living Room',
      unit: '8B',
      status: 'completed',
      priority: 'medium',
      category: 'electrical',
      date: '2025-03-22'
    }
  ])
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  })

  const handleNewRequest = (data: any) => {
    const newRequest: MaintenanceRequest = {
      id: `MR-${String(requests.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description,
      unit: data.unit,
      status: 'pending',
      priority: data.priority,
      category: data.category,
      date: new Date().toISOString().split('T')[0]
    }
    setRequests([newRequest, ...requests])
    setIsModalOpen(false)
  }

  const filteredRequests = requests.filter(request => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-black">Track and manage property maintenance issues</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-burgundy-700 text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 transition-colors"
        >
          New Request
        </button>
      </div>

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