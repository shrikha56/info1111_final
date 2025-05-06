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

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-semibold text-burgundy-800 dark:text-burgundy-400 ${robotoMono.className}`}>Cookie Consent</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={declineCookies}
            className={`px-4 py-2 border border-burgundy-700 dark:border-burgundy-400 text-burgundy-700 dark:text-burgundy-400 rounded-md hover:bg-burgundy-50 dark:hover:bg-opacity-10 ${robotoMono.className}`}
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className={`px-4 py-2 bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white rounded-md hover:bg-burgundy-800 dark:hover:bg-burgundy-700 ${robotoMono.className}`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
