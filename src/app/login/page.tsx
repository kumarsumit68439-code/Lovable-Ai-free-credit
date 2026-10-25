'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      const userEmail = data.user?.email?.toLowerCase()
      if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut()
        setError('Access restricted. Admin panel is available only for the authorized account.')
        setLoading(false)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-2xl font-bold text-white text-center">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-white/50">
          Sign in with email and password. Admin access is limited to the authorized account.
        </p>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-white/40">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-white/30 focus:border-pink-500/50 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-white/40">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-white/30 focus:border-pink-500/50 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 py-3 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
