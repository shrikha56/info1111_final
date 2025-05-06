export default function LevyPage() {
    const mockLevies = [
      {
        id: 'LEVY001',
        amount: 2500,
        dueDate: '2025-04-15',
        status: 'pending',
        description: 'Q2 2025 Levy Payment',
        paymentMethod: 'Direct Debit'
      },
      {
        id: 'LEVY002',
        amount: 2500,
        dueDate: '2025-07-15',
        status: 'upcoming',
        description: 'Q3 2025 Levy Payment',
        paymentMethod: 'Direct Debit'
      },
      {
        id: 'LEVY003',
        amount: 2500,
        dueDate: '2025-10-15',
        status: 'upcoming',
        description: 'Q4 2025 Levy Payment',
        paymentMethod: 'Direct Debit'
      },
      {
        id: 'LEVY004',
        amount: 2500,
        dueDate: '2025-01-15',
        status: 'paid',
        description: 'Q1 2025 Levy Payment',
        paymentMethod: 'Direct Debit'
      }
    ]

    return (
      <div className="space-y-6 bg-gray-100 dark:bg-gray-900 p-6 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Levy Deadlines</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-white">Manage and track levy payments and deadlines</p>
          </div>
          <button className="bg-burgundy-700 dark:bg-burgundy-800 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-burgundy-800 dark:hover:bg-burgundy-700 transition-colors">
            New Levy
          </button>
        </div>
  
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Total Outstanding</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$12,450</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-700 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-red-600 dark:text-red-300">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                8 units pending payment
              </div>
            </div>
          </div>
  
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Next Due Date</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Mar 31, 2025</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-700 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-300">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                8 days remaining
              </div>
            </div>
          </div>
  
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-white">Payment Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">92%</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600 dark:text-green-300">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                22 units paid on time
              </div>
            </div>
          </div>
        </div>
  
        {/* Levy List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Levies</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Levy ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Levy Row 1 */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #LEV-001
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">Q1 2025 Maintenance</div>
                    <div className="text-sm text-gray-500 dark:text-white">Regular quarterly levy</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $1,250
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                    Mar 31, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-burgundy-700 dark:text-burgundy-400 hover:text-burgundy-900 dark:hover:text-burgundy-300 mr-3">
                      View
                    </button>
                    <button className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
                      Edit
                    </button>
                  </td>
                </tr>
  
                {/* Levy Row 2 */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #LEV-002
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">Special Levy</div>
                    <div className="text-sm text-gray-500 dark:text-white">Building repairs</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $2,500
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                    Apr 15, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-burgundy-700 dark:text-burgundy-400 hover:text-burgundy-900 dark:hover:text-burgundy-300 mr-3">
                      View
                    </button>
                    <button className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }