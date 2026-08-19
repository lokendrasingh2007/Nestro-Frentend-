'use client'

import React from 'react'
import { FiAlertTriangle } from "react-icons/fi"

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd] p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#eef0f8] p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FiAlertTriangle size={48} className="text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#2a3460] mb-2">
          Oops! Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-sm text-[#7a84a6] mb-6">
          {error?.message || "An unexpected error occurred in Admin Panel."}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#3b497e] hover:bg-[#2a3460] text-white text-sm font-semibold shadow-md transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = "/admin"}
            className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
