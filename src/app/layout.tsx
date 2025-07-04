import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import CookieConsent from './components/CookieConsent'
import ThemeSwitcher from './components/ThemeSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Strata Management',
  description: 'Strata Management Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
            <div className="flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full shadow-sm">
              <div className="flex flex-col overflow-y-auto pt-5 pb-4 h-full">
                <div className="flex flex-shrink-0 items-center justify-between px-4">
                  <h1 className="text-2xl font-bold text-burgundy-700 dark:text-burgundy-300">Strata Management</h1>
                  <ThemeSwitcher />
                </div>
                <Navigation />
              </div>
            </div>
          </div>
          <div className="flex-1 md:pl-64">
            <main className="min-h-screen">
              {children}
            </main>
          </div>
          <CookieConsent />
        </div>
      </body>
    </html>
  )
}
