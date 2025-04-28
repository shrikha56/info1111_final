import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'

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
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
            <div className="flex flex-col border-r border-gray-200 bg-white h-full shadow-sm">
              <div className="flex flex-col overflow-y-auto pt-5 pb-4 h-full">
                <div className="flex flex-shrink-0 items-center px-4">
                  <h1 className="text-2xl font-bold text-burgundy-700">Strata Management</h1>
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
        </div>
      </body>
    </html>
  )
}
