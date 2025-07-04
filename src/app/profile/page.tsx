'use client'

import React, { useState, useEffect } from 'react'
import { Roboto_Mono } from 'next/font/google'
import Link from 'next/link'
import { setCookie, getCookie } from '@/utils/cookies'

const robotoMono = Roboto_Mono({ subsets: ['latin'] })

interface Property {
  id: string
  unit_number: string
  address: string
  building?: {
    id: string
    name: string
    address: string
  }
}

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  created_at: string
  updated_at: string
  property?: {
    unit_number: string
    address: string
  }
}

interface Notification {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  created_at: string
  updated_at: string
  expires_at?: string
  building?: {
    id: string
    name: string
  }
}

interface UserProfile {
  user: {
    id: string
    name: string
    email: string
    role: string
    created_at: string
    properties: Property[]
  }
  maintenanceRequests: MaintenanceRequest[]
  notifications: Notification[]
  announcements: Announcement[]
}

// Roboto Mono font is defined at the top of the file

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [preferencesEnabled, setPreferencesEnabled] = useState(true)
  const [cookieSuccess, setCookieSuccess] = useState(false)

  // For demo purposes, use a fixed user ID
  const userId = '00000000-0000-0000-0000-000000000003' // John Manager

  useEffect(() => {
    fetchUserProfile()
    
    // Load current cookie settings
    const analyticsValue = getCookie('analytics-enabled')
    const preferencesValue = getCookie('preferences-enabled')
    
    setAnalyticsEnabled(analyticsValue === 'true')
    setPreferencesEnabled(preferencesValue !== 'false') // Default to true if not set
  }, [])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`)
      }
      
      const data = await response.json()
      setProfile(data)
      
      // Initialize form data with user data
      setFormData({
        name: data.user.name,
        email: data.user.email
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      console.error('Error fetching profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile) return
    
    try {
      setSaveStatus('saving')
      console.log('Updating profile with data:', {
        id: profile.user.id,
        name: formData.name,
        email: formData.email,
        role: profile.user.role
      })
      
      // Make the API call to update the profile in Supabase
      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: profile.user.id,
          name: formData.name,
          email: formData.email,
          role: profile.user.role
        })
      })
      
      const responseData = await response.json()
      console.log('API response:', responseData)
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile')
      }
      
      const updatedUser = responseData
      
      // Update the profile state with the new user data
      setProfile(prev => {
        if (!prev) return null;
        
        // Create a new profile object with updated user data
        return {
          ...prev,
          user: {
            ...prev.user,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role || prev.user.role
          }
        };
      })
      
      setSaveStatus('success')
      setIsEditing(false)
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setSaveStatus('error')
      
      // Show error for 5 seconds, then reset to idle
      setTimeout(() => {
        setSaveStatus('idle')
      }, 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-black dark:text-white">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={fetchUserProfile}
            className="bg-burgundy-700 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-burgundy-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No Profile Data Available</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-black dark:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold text-burgundy-800 dark:text-burgundy-300 ${robotoMono.className}`}>User Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`border border-burgundy-700 dark:border-burgundy-500 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 shadow-sm transition-all ${robotoMono.className}`}
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 shadow-sm transition-all"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={profile.user.role}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  disabled
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Role cannot be changed</p>
              </div>
              
              <button
                type="submit"
                className={`bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white px-6 py-2 rounded-lg hover:bg-burgundy-800 dark:hover:bg-burgundy-700 shadow-md transition-all ${robotoMono.className}`}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
              
              {saveStatus === 'success' && (
                <div className="text-green-500 dark:text-green-400 text-sm mt-2 font-medium">
                  Profile updated successfully!
                </div>
              )}
              
              {saveStatus === 'error' && (
                <div className="text-red-500 dark:text-red-400 text-sm mt-2 font-medium">
                  Failed to update profile. Please try again.
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Name</h3>
                  <p className="text-gray-900 dark:text-gray-100">{profile.user.name}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Email</h3>
                  <p className="text-gray-900 dark:text-gray-100">{profile.user.email}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Role</h3>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">{profile.user.role}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Member Since</h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(profile.user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Properties</h3>
                {profile.user.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.user.properties.map(property => (
                      <div key={property.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <p className="font-medium">Unit {property.unit_number}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{property.address}</p>
                        {property.building && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {property.building.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No properties associated with this account.</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold text-burgundy-800 dark:text-burgundy-300 mb-4 ${robotoMono.className}`}>Recent Maintenance Requests</h2>
            
            {profile.maintenanceRequests.length > 0 ? (
              <div className="space-y-4">
                {profile.maintenanceRequests.map(request => (
                  <div key={request.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{request.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        request.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        request.status === 'in_progress' ? 'bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-gray-200' :
                        request.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{request.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{request.priority} priority</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No maintenance requests found.</p>
            )}
            
            <div className="mt-4">
              <Link 
                href="/maintenance" 
                className={`text-burgundy-700 dark:text-burgundy-300 hover:text-burgundy-900 dark:hover:text-burgundy-200 text-sm font-medium ${robotoMono.className}`}
              >
                + Submit New Request
              </Link>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold text-burgundy-800 dark:text-burgundy-300 mb-4 ${robotoMono.className}`}>Notifications</h2>
            
            {profile.notifications.length > 0 ? (
              <div className="space-y-3">
                {profile.notifications.map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg ${notification.is_read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-burgundy-50 dark:bg-burgundy-900/30'}`}>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No notifications.</p>
            )}
          </div>
        </div>
        
        {/* Cookie Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold text-burgundy-800 dark:text-burgundy-300 ${robotoMono.className}`}>Privacy Preferences</h2>
            <button
              onClick={() => {
                // Save cookie preferences
                setCookie('analytics-enabled', analyticsEnabled ? 'true' : 'false', 365)
                setCookie('preferences-enabled', preferencesEnabled ? 'true' : 'false', 365)
                setCookie('cookie-consent', 'customized', 365)
                
                // Show success message
                setCookieSuccess(true)
                setTimeout(() => setCookieSuccess(false), 3000)
              }}
              className={`px-4 py-2 bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white rounded-md hover:bg-burgundy-800 dark:hover:bg-burgundy-700 ${robotoMono.className}`}
            >
              Save Preferences
            </button>
          </div>
          
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Essential Cookies</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Required for the website to function properly</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={true} 
                  disabled={true}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-burgundy-700 dark:text-burgundy-500 focus:ring-burgundy-500" 
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Analytics Cookies</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve our website by collecting anonymous usage data</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={analyticsEnabled} 
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-burgundy-700 dark:text-burgundy-500 focus:ring-burgundy-500" 
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Preferences Cookies</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remember your settings and preferences</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={preferencesEnabled} 
                  onChange={(e) => setPreferencesEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-burgundy-700 dark:text-burgundy-500 focus:ring-burgundy-500" 
                />
              </div>
            </div>
          </div>
          
          {cookieSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-md">
              Your privacy preferences have been saved.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
