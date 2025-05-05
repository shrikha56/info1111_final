'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'



export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the dashboard page
    router.push('/dashboard')
  }, [])
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-burgundy-800 mb-4">Strata Management System</h1>
        <p className="text-gray-600 mb-8">Redirecting to dashboard...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-700 mx-auto"></div>
      </div>
    </main>
  )
}
