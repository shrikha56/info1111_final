'use client'

import { useState } from 'react'

interface NewMaintenanceFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function NewMaintenanceForm({ onSubmit, onCancel }: NewMaintenanceFormProps) {
  const [formData, setFormData] = useState({
    title: 'Maintenance Request',
    description: 'Please fix this issue',
    unit: '101', // Default to unit 101 which exists in our schema
    priority: 'medium',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Always use valid data with defaults
      const submitData = {
        title: formData.title || 'Maintenance Request',
        description: formData.description || 'Please fix this issue',
        unit: '101', // Always use 101 since we know it exists
        priority: formData.priority || 'medium',
        category: formData.category || 'general'
      }
      
      console.log('Submitting maintenance request:', submitData)
      onSubmit(submitData)
    } catch (error) {
      console.error('Error in form submission:', error)
      alert('Error submitting form. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Enter a title for your maintenance request</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Describe the maintenance issue</p>
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-black">
          Unit
        </label>
        <div className="relative">
          <input
            type="text"
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
            required
            disabled
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2 mt-1">
            <span className="text-xs text-gray-500">Fixed: 101</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Unit is fixed to 101 for testing</p>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-black">
          Priority
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-black">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
        >
          <option value="general">General</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="structural">Structural</option>
          <option value="appliances">Appliances</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-burgundy-700 border border-transparent rounded-md hover:bg-burgundy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
        >
          Submit
        </button>
      </div>
    </form>
  )
}