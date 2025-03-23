'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Environment Variables Test</h1>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700">API URL</h2>
              <p className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_API_URL}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700">NextAuth URL</h2>
              <p className="text-sm text-gray-600">{process.env.NEXTAUTH_URL}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700">Analytics Enabled</h2>
              <p className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_ENABLE_ANALYTICS}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700">Maintenance Mode</h2>
              <p className="text-sm text-gray-600">{process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE}</p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700">Deployment Info</h2>
              <p className="text-sm text-gray-600">Environment: {process.env.NODE_ENV}</p>
              <p className="text-sm text-gray-600">Build Time: {new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 