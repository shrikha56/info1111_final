'use client'

import { useState } from 'react'

interface NewMaintenanceFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function NewMaintenanceForm({ onSubmit, onCancel }: NewMaintenanceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit: '101', // Default to unit 101 which exists in our schema
    priority: 'medium',
    category: 'general'
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})  

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Submitting form data:', formData)
      onSubmit(formData)
    } else {
      console.warn('Form validation failed:', errors)
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
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value })
            if (errors.title) {
              setErrors({ ...errors, title: '' })
            }
          }}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-burgundy-500 sm:text-sm text-black ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-burgundy-500'}`}
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value })
            if (errors.description) {
              setErrors({ ...errors, description: '' })
            }
          }}
          rows={3}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-burgundy-500 sm:text-sm text-black ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-burgundy-500'}`}
          required
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
            onChange={(e) => {
              setFormData({ ...formData, unit: e.target.value })
              if (errors.unit) {
                setErrors({ ...errors, unit: '' })
              }
            }}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-burgundy-500 sm:text-sm text-black ${errors.unit ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-burgundy-500'}`}
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2 mt-1">
            <span className="text-xs text-gray-500">Default: 101</span>
          </div>
        </div>
        {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
        <p className="mt-1 text-xs text-gray-500">Enter a valid unit number (e.g., 101, 102)</p>
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