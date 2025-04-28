'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, UserGroupIcon, WrenchScrewdriverIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Committee Members', href: '/committee', icon: UserGroupIcon },
  { name: 'Maintenance Requests', href: '/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'Levy Deadlines', href: '/levy', icon: CalendarIcon },
  { name: 'Policies & Reports', href: '/policies', icon: DocumentTextIcon },
  { name: 'API Testing', href: '/api-test', icon: DocumentTextIcon },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-burgundy-700 text-white'
                : 'text-gray-600 hover:bg-burgundy-50 hover:text-burgundy-700'
            }`}
          >
            <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}