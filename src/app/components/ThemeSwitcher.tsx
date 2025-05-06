'use client'

import { useState, useEffect } from 'react'
import { useCookie } from '@/hooks/useCookies'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Roboto_Mono } from 'next/font/google'

// Use Roboto Mono for code-like content
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function ThemeSwitcher() {
  const { value: theme, updateCookie } = useCookie('theme-preference', { defaultValue: 'light', expires: 365 })
  const [mounted, setMounted] = useState(false)

  // Only show the theme switcher after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    updateCookie(newTheme)
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Apply theme on initial load
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-burgundy-700 dark:hover:text-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-gray-800 ${robotoMono.className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  )
}
