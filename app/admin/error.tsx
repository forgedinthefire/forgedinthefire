'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LogOut, RefreshCw, ArrowLeft } from 'lucide-react'

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

  const handleSignOut = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#1E1714] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#241B18] rounded-2xl p-8 border border-[#3A2A24]">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <span className="text-red-400 text-xl">!</span>
        </div>
        <h2 className="text-xl font-bold text-red-400 mb-2 text-center">Admin Page Error</h2>
        <p className="text-[#B8A89A] text-sm text-center mb-6">
          Something went wrong loading the admin area.
        </p>
        
        <div className="bg-[#1E1714] rounded-lg p-4 mb-6 overflow-auto">
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
            className="w-full flex items-center justify-center gap-2 bg-[#1E6B73] hover:bg-[#4C9AA3] text-[#F6F0E8] font-medium py-2.5 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#3A2A24] text-[#B8A89A] font-medium py-2.5 rounded-lg transition-colors border border-[#3A2A24]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          
          <a
            href="/admin-setup"
            className="block w-full text-center text-[#8B5E3C] hover:text-[#C8A46B] text-sm py-2 transition-colors"
          >
            Go to Admin Setup Check →
          </a>
        </div>
      </div>
    </div>
  )
}
