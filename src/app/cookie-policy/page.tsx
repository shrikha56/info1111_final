'use client'

import React from 'react'
import { Roboto_Mono } from 'next/font/google'
import CookieSettings from '../components/CookieSettings'

// Use Roboto Mono for code-like content
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold text-burgundy-800 mb-6 ${robotoMono.className}`}>Cookie Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className={`text-xl font-semibold text-burgundy-800 mb-4 ${robotoMono.className}`}>About Cookies</h2>
          <p className="mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
          
          <h3 className={`text-lg font-semibold text-burgundy-800 mt-6 mb-2 ${robotoMono.className}`}>How We Use Cookies</h3>
          <p className="mb-4">
            We use cookies for several purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Essential cookies:</strong> These are necessary for the website to function properly and cannot be disabled.</li>
            <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website, allowing us to improve functionality.</li>
            <li><strong>Preference cookies:</strong> These remember your settings and choices to enhance your experience on return visits.</li>
          </ul>
          
          <h3 className={`text-lg font-semibold text-burgundy-800 mt-6 mb-2 ${robotoMono.className}`}>Managing Cookies</h3>
          <p className="mb-4">
            Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, 
            or to alert you when cookies are being sent. However, if you disable cookies, some parts of our website may not function properly.
          </p>
        </div>
        
        <CookieSettings />
      </div>
    </div>
  )
}
