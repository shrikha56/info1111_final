'use client'

import { useState, useEffect } from 'react'
import { setCookie, getCookie } from '@/utils/cookies'
import { Roboto_Mono } from 'next/font/google'

// Use Roboto Mono for code-like content
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function CookieSettings() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [preferencesEnabled, setPreferencesEnabled] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Load current cookie settings
    const analyticsValue = getCookie('analytics-enabled')
    const preferencesValue = getCookie('preferences-enabled')
    
    setAnalyticsEnabled(analyticsValue === 'true')
    setPreferencesEnabled(preferencesValue !== 'false') // Default to true if not set
  }, [])

  const saveSettings = () => {
    // Save cookie preferences
    setCookie('analytics-enabled', analyticsEnabled ? 'true' : 'false', 365)
    setCookie('preferences-enabled', preferencesEnabled ? 'true' : 'false', 365)
    setCookie('cookie-consent', 'customized', 365)
    
    // Show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className={`text-xl font-semibold text-burgundy-800 dark:text-burgundy-400 mb-4 ${robotoMono.className}`}>Cookie Settings</h2>
      
      <div className="space-y-4">
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
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-burgundy-700 dark:text-burgundy-400 focus:ring-burgundy-500 dark:focus:ring-burgundy-400" 
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
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-burgundy-700 dark:text-burgundy-400 focus:ring-burgundy-500 dark:focus:ring-burgundy-400" 
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
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-burgundy-700 dark:text-burgundy-400 focus:ring-burgundy-500 dark:focus:ring-burgundy-400" 
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveSettings}
          className={`px-4 py-2 bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white rounded-md hover:bg-burgundy-800 dark:hover:bg-burgundy-700 ${robotoMono.className}`}
        >
          Save Preferences
        </button>
      </div>
      
      {showSuccess && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-md">
          Your cookie preferences have been saved.
        </div>
      )}
    </div>
  )
}
