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

export default function DashboardPage() {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPropertyData()
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={fetchPropertyData}
              className="bg-burgundy-700 text-black px-4 py-2 rounded-lg hover:bg-burgundy-800"
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
      <div className="min-h-screen bg-gray-100 p-6 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold text-burgundy-800 ${robotoMono.className}`}>Strata Management Dashboard</h1>
            <p className="text-gray-600 mt-1">Property overview and management</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/profile" 
              className={`bg-white text-burgundy-700 border border-burgundy-700 px-4 py-2 rounded-lg hover:bg-burgundy-50 shadow-sm transition-all ${robotoMono.className}`}
            >
              User Profile
            </Link>
            <Link 
              href="/api-test" 
              className={`bg-burgundy-700 text-black px-4 py-2 rounded-lg hover:bg-burgundy-800 transition-all shadow-md ${robotoMono.className}`}
            >
              API Testing
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className={`text-lg font-semibold text-burgundy-800 mb-2 ${robotoMono.className}`}>Properties</h2>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-800">{propertyData.summary.totalProperties}</span>
              <span className="text-gray-500 ml-2 mb-1">total</span>
            </div>
            <p className="text-gray-600 mt-2">Managing {propertyData.summary.totalUnits} units</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className={`text-lg font-semibold text-burgundy-800 mb-2 ${robotoMono.className}`}>Maintenance</h2>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-800">{propertyData.summary.totalMaintenanceRequests}</span>
              <span className="text-gray-500 ml-2 mb-1">requests</span>
            </div>
            <p className="text-gray-600 mt-2">Avg {propertyData.summary.averageMaintenancePerProperty} per property</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className={`text-lg font-semibold text-burgundy-800 mb-2 ${robotoMono.className}`}>Next Inspection</h2>
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-800">
                {new Date().getDate() + 3}
              </span>
              <span className="text-gray-500 ml-2 mb-1">May</span>
            </div>
            <p className="text-gray-600 mt-2">Parkside Residences</p>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className={`text-xl font-semibold text-burgundy-800 ${robotoMono.className}`}>Properties Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maintenance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Inspection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {propertyData.properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.maintenance_requests > 3 
                          ? 'bg-red-100 text-red-800' 
                          : property.maintenance_requests > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {property.maintenance_requests} requests
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.last_inspection}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a 
                        href={`/api/property.php?id=${property.id}`}
                        target="_blank"
                        className={`text-burgundy-700 hover:text-burgundy-900 ${robotoMono.className}`}
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
