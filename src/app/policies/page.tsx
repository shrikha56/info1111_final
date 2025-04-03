'use client';

import { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface Policy {
  id: string;
  title: string;
  description: string;
  type: string;
  lastUpdated: string;
  fileUrl: string;
}

export default function PoliciesPage() {
  const [policies] = useState<Policy[]>([
    {
      id: 'POL001',
      title: 'Strata Bylaws 2025',
      description: 'Updated bylaws and regulations',
      type: 'policy',
      lastUpdated: '2 days ago',
      fileUrl: '/nsw.gov.au-Changes to strata laws.pdf',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Policies & Documents</h1>
            
            <div className="space-y-6">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <DocumentIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{policy.title}</h3>
                      <p className="text-sm text-gray-500">{policy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Last updated {policy.lastUpdated}</span>
                    {policy.fileUrl && (
                      <a
                        href={policy.fileUrl}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-burgundy-700 bg-burgundy-100 hover:bg-burgundy-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
