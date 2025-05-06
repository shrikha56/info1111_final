'use client'

import { useState, useEffect } from 'react'
import { setCookie, getCookie, eraseCookie } from '@/utils/cookies'

interface UseCookieOptions {
  defaultValue?: string;
  expires?: number; // days
}

export function useCookie(key: string, options: UseCookieOptions = {}) {
  const [value, setValue] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cookie value on mount
  useEffect(() => {
    const cookieValue = getCookie(key)
    setValue(cookieValue || options.defaultValue || null)
    setIsLoaded(true)
  }, [key, options.defaultValue])

  // Update cookie
  const updateCookie = (newValue: string, expires = options.expires) => {
    setCookie(key, newValue, expires)
    setValue(newValue)
  }

  // Remove cookie
  const removeCookie = () => {
    eraseCookie(key)
    setValue(null)
  }

  return {
    value,
    isLoaded,
    updateCookie,
    removeCookie
  }
}
