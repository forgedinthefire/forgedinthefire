'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Flame } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)
  const router = useRouter()

  // Initialize Supabase client after mount (avoids build-time errors)
  useEffect(() => {
    try {
      setSupabase(createClient())
    } catch (err) {
      setError('Failed to initialize authentication. Please check your configuration.')
      console.error('Supabase initialization error:', err)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('Authentication not initialized. Please refresh the page.')
      return
    }
    
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1714] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C8A46B]/10 flex items-center justify-center mx-auto mb-4 border border-[#C8A46B]/30">
            <Flame className="w-8 h-8 text-[#C8A46B]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F6F0E8] mb-1">Admin Login</h1>
          <p className="text-[#B8A89A]">Forged in the Fire</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#241B18] rounded-2xl p-8 border border-[#3A2A24]">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#CDBDAF] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1E1714] border border-[#3A2A24] rounded-lg px-4 py-2.5 text-[#F6F0E8] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C8A46B] transition-colors"
                placeholder="admin@forgedinthefireohio.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CDBDAF] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1E1714] border border-[#3A2A24] rounded-lg px-4 py-2.5 text-[#F6F0E8] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C8A46B] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C] hover:text-[#C8A46B] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !supabase}
              className="w-full bg-[#1E6B73] hover:bg-[#4C9AA3] text-[#F6F0E8] font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : !supabase ? 'Initializing...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#3A2A24] text-center">
            <a href="/" className="text-sm text-[#8B5E3C] hover:text-[#C8A46B] transition-colors">
              ← Back to website
            </a>
          </div>
        </form>

        {/* Security Note */}
        <p className="text-center text-xs text-[#8B5E3C] mt-6">
          This area is restricted to authorized personnel only.
          <br />
          All access is logged for security purposes.
        </p>
      </div>
    </div>
  )
}
