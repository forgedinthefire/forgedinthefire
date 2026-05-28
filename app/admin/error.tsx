'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#1E1714] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#241B18] rounded-2xl p-8 border border-[#3A2A24]">
        <h2 className="text-xl font-bold text-red-400 mb-4">Admin Page Error</h2>
        <div className="bg-[#1E1714] rounded-lg p-4 mb-4 overflow-auto">
          <p className="text-sm text-[#CDBDAF] font-mono whitespace-pre-wrap">
            {error.message}
          </p>
          {error.digest && (
            <p className="text-xs text-[#8B5E3C] mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <button
            onClick={reset}
            className="w-full bg-[#1E6B73] hover:bg-[#4C9AA3] text-[#F6F0E8] font-medium py-2.5 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/login"
            className="block w-full text-center bg-transparent hover:bg-[#3A2A24] text-[#B8A89A] font-medium py-2.5 rounded-lg transition-colors border border-[#3A2A24]"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
