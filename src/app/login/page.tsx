'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/utils'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
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
        setError('Access denied. Only the authorized administrator can sign in.')
        setLoading(false)
        return
      }
      router.push(next.startsWith('/') ? next : '/')
      router.refresh()
    } catch {
      setError('Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="premium-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8 animate-fade-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 shadow-lg shadow-pink-500/30">
            <span className="text-xl font-black text-white">∞</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Lvbl <span className="gradient-text">Infinity</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Sign in to access unlimited extension controls
          </p>
        </div>

        <div className="glass-card shimmer-border rounded-3xl p-8 animate-fade-up delay-1">
          <h2 className="text-lg font-semibold text-white text-center">Administrator Sign In</h2>
          <p className="mt-1 text-center text-xs text-white/40">
            Secure access · Authorized account only
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="animate-fade-up delay-2">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="animate-fade-up delay-3">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-50 animate-fade-up delay-4"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[11px] text-white/30 animate-fade-up delay-5">
          Protected access · Lvbl Infinity © 2026
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white/40">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
