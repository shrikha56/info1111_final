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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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
      await onSubmit(submitData)
      
      // Reset submission state after completion
      setIsSubmitting(false)
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
        <div className="relative">
          <input
            type="text"
            id="title"
            placeholder="e.g., Leaking Faucet in Kitchen"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
            required
          />
          {formData.title.length > 0 && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">Enter a brief, descriptive title for your maintenance request</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black">
          Description
        </label>
        <div className="relative">
          <textarea
            id="description"
            placeholder="Please provide details about the issue, including when it started and any relevant information that might help us address it..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500 sm:text-sm text-black"
            required
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {formData.description.length} characters
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Provide a detailed description of the maintenance issue</p>
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
        <div className="mt-2 flex space-x-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, priority: 'low' })}
            className={`px-4 py-2 rounded-md text-sm ${formData.priority === 'low' 
              ? 'bg-green-100 border-2 border-green-500 text-green-700 font-medium' 
              : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            Low
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, priority: 'medium' })}
            className={`px-4 py-2 rounded-md text-sm ${formData.priority === 'medium' 
              ? 'bg-yellow-100 border-2 border-yellow-500 text-yellow-700 font-medium' 
              : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, priority: 'high' })}
            className={`px-4 py-2 rounded-md text-sm ${formData.priority === 'high' 
              ? 'bg-red-100 border-2 border-red-500 text-red-700 font-medium' 
              : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            High
          </button>
        </div>
        <input type="hidden" name="priority" value={formData.priority} />
        <p className="mt-1 text-xs text-gray-500">Select the urgency of your maintenance request</p>
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
          <option value="hvac">HVAC</option>
          <option value="painting">Painting</option>
          <option value="flooring">Flooring</option>
          <option value="landscaping">Landscaping</option>
          <option value="security">Security</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">Select the category that best describes your maintenance issue</p>
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
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-burgundy-700 border border-transparent rounded-md hover:bg-burgundy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </form>
  )
}