'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Roboto_Mono } from 'next/font/google'

// Use Roboto Mono for code-like content
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

interface Property {
  id: string
  name: string
  address: string
  units: number
  maintenance_requests: number
  last_inspection: string
}

interface Summary {
  totalProperties: number
  totalUnits: number
  totalMaintenanceRequests: number
  averageUnitsPerProperty: number
  averageMaintenancePerProperty: string
}

interface PropertyData {
  properties: Property[]
  summary: Summary
}

interface AnalyticsData {
  totalRequestsThisMonth: number
  averageCompletionTimeHours: number | null
  topProperties: Array<{ property_id: string; total: number }>
  completionRate: number | null
  monthlyTrend: Array<{ month: string; total: number }>
}

export default function DashboardPage() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchPropertyData()
    fetchAnalytics()
  }, [])

  const fetchPropertyData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/property-data')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch property data: ${response.status}`)
      }
      
      const data = await response.json()
      setPropertyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property data')
      console.error('Error fetching property data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/dashboard-analytics')
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.status}`)
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-black dark:text-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-black dark:text-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button 
              onClick={fetchPropertyData}
              className="bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 dark:hover:bg-burgundy-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-black dark:text-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No Data Available</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold text-burgundy-800 dark:text-burgundy-300 ${robotoMono.className}`}>Strata Management Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Property overview and management</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/profile" 
              className={`bg-white dark:bg-gray-800 text-burgundy-700 dark:text-burgundy-300 border border-burgundy-700 dark:border-burgundy-500 px-4 py-2 rounded-lg hover:bg-burgundy-50 dark:hover:bg-gray-700 shadow-sm transition-all ${robotoMono.className}`}
            >
              User Profile
            </Link>
            <Link 
              href="/api-test" 
              className={`bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 dark:hover:bg-burgundy-700 transition-all shadow-md ${robotoMono.className}`}
            >
              API Testing
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold text-burgundy-800 dark:text-burgundy-300 mb-2 ${robotoMono.className}`}>Properties</h2>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">{propertyData.summary.totalProperties}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1">total</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Managing {propertyData.summary.totalUnits} units</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold text-burgundy-800 dark:text-burgundy-300 mb-2 ${robotoMono.className}`}>Maintenance</h2>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">{propertyData.summary.totalMaintenanceRequests}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1">requests</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Avg {propertyData.summary.averageMaintenancePerProperty} per property</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold text-burgundy-800 dark:text-burgundy-300 mb-2 ${robotoMono.className}`}>Next Inspection</h2>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                {new Date().getDate() + 3}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1">May</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Parkside Residences</p>
          </div>
        </div>

        {/* Analytics Section */}
        {analyticsData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className={`text-xl font-semibold text-burgundy-800 dark:text-burgundy-300 mb-4 ${robotoMono.className}`}>Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-burgundy-800 dark:text-burgundy-300">Total Requests (This Month)</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{analyticsData.totalRequestsThisMonth}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-burgundy-800 dark:text-burgundy-300">Average Completion Time (Hours)</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{analyticsData.averageCompletionTimeHours !== null ? analyticsData.averageCompletionTimeHours.toFixed(1) : "N/A"}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-burgundy-800 dark:text-burgundy-300">Completion Rate (%)</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{analyticsData.completionRate !== null ? analyticsData.completionRate.toFixed(1) : "N/A"}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-burgundy-800 dark:text-burgundy-300 mb-2">Top 3 Properties (by Requests)</h3>
              <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                {analyticsData.topProperties.map((prop, i) => (
                  <li key={i}>Property {prop.property_id} – {prop.total} requests</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-burgundy-800 dark:text-burgundy-300 mb-2">Monthly Trend (Last 6 Months)</h3>
              <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                {analyticsData.monthlyTrend.map((trend, i) => (
                  <li key={i}>{trend.month} – {trend.total} requests</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Properties Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-semibold text-burgundy-800 dark:text-burgundy-300 ${robotoMono.className}`}>Properties Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Property Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Maintenance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Inspection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {propertyData.properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {property.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {property.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {property.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.maintenance_requests > 3 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
                          : property.maintenance_requests > 0 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      }`}>
                        {property.maintenance_requests} requests
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {property.last_inspection}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={`/api/index.php?property_id=${property.id}`}
                        target="_blank"
                        className={`text-burgundy-700 dark:text-burgundy-300 hover:text-burgundy-900 dark:hover:text-burgundy-200 ${robotoMono.className}`}
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
