'use client'

import { useState, useEffect } from 'react'
import { setCookie, getCookie } from '@/utils/cookies'
import { Roboto_Mono } from 'next/font/google'

// Use Roboto Mono for code-like content
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const consentCookie = getCookie('cookie-consent')
    if (!consentCookie) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    setCookie('cookie-consent', 'accepted', 365) // Set cookie for 1 year
    setCookie('analytics-enabled', 'true', 365)
    setIsVisible(false)
  }

  const declineCookies = () => {
    setCookie('cookie-consent', 'declined', 365) // Set cookie for 1 year
    setCookie('analytics-enabled', 'false', 365)
    setIsVisible(false)
  }

  const viewSettings = () => {
    window.location.href = '/profile'
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-sm font-semibold text-burgundy-800 ${robotoMono.className}`}>Privacy Notice</h3>
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        This dashboard uses cookies to enhance your experience. You can manage your preferences in your profile settings.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={viewSettings}
          className={`px-3 py-1 text-xs border border-burgundy-700 text-burgundy-700 rounded hover:bg-burgundy-50 ${robotoMono.className}`}
        >
          Settings
        </button>
        <button
          onClick={acceptCookies}
          className={`px-3 py-1 text-xs bg-burgundy-700 text-black rounded hover:bg-burgundy-800 ${robotoMono.className}`}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
