'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, AlertTriangle, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    const client = createClient()
    if (client) {
      setSupabase(client)
      // Get current user email
      client.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setUserEmail(user.email)
        }
      })
    }
  }, [])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1714] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#F6F0E8] mb-1">Access Denied</h1>
          <p className="text-[#B8A89A]">Forged in the Fire Admin Portal</p>
        </div>

        {/* Alert Box */}
        <div className="bg-[#241B18] rounded-2xl p-8 border border-[#3A2A24]">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#F6F0E8] mb-2">
                Unauthorized Access
              </h2>
              <p className="text-[#B8A89A] text-sm leading-relaxed">
                Your account does not have admin privileges. The admin portal is restricted to authorized personnel only.
              </p>
            </div>
          </div>

          {userEmail && (
            <div className="mb-6 p-4 bg-[#1E1714] rounded-lg border border-[#3A2A24]">
              <p className="text-xs text-[#8B5E3C] uppercase tracking-wider mb-1">Signed in as</p>
              <p className="text-[#F6F0E8] font-medium">{userEmail}</p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-[#1E6B73] hover:bg-[#4C9AA3] text-[#F6F0E8] font-medium py-2.5 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              Return to Website
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full bg-transparent hover:bg-[#3A2A24] text-[#B8A89A] font-medium py-2.5 rounded-lg transition-colors border border-[#3A2A24]"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-[#8B5E3C] mt-6">
          All access attempts are logged for security purposes.
          <br />
          If you believe this is an error, contact the site administrator.
        </p>
      </div>
    </div>
  )
}
