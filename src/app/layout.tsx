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
        <div className="min-h-screen bg-gray-50">
          <div className="flex h-full">
            <div className="hidden md:flex md:w-64 md:flex-col h-screen sticky top-0">
              <div className="flex flex-1 flex-col border-r border-gray-200 bg-white h-full shadow-sm">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 h-full">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <h1 className="text-2xl font-bold text-burgundy-700">Strata Management</h1>
                  </div>
                  <Navigation />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col bg-gray-50">
              <main className="flex-1">
                <div className="py-6">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
