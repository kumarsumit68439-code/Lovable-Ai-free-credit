'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) {
      setError('Please enter email and password.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.')
          setLoading(false)
          return
        }
        if (password !== confirm) {
          setError('Passwords do not match.')
          setLoading(false)
          return
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        })
        if (signUpError) {
          setError(signUpError.message)
          setLoading(false)
          return
        }
        if (data.session) {
          router.push(next.startsWith('/') ? next : '/')
          router.refresh()
          return
        }
        setSuccess('Account created. Check your email to confirm, then sign in.')
        setMode('login')
        setPassword('')
        setConfirm('')
        setLoading(false)
        return
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      router.push(next.startsWith('/') ? next : '/')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] animate-scale-in">
      <div className="text-center mb-8 animate-fade-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 shadow-lg shadow-pink-500/30">
          <span className="text-xl font-black text-white">∞</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Lvbl <span className="gradient-text">Infinity</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {mode === 'login'
            ? 'Sign in to continue to your dashboard'
            : 'Create an account to get started'}
        </p>
      </div>

      <div className="glass-card shimmer-border rounded-3xl p-7 sm:p-8 animate-fade-up delay-1">
        <div className="mb-6 flex rounded-full bg-white/5 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError('')
              setSuccess('')
            }}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
              mode === 'login'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/45 hover:text-white/70'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError('')
              setSuccess('')
            }}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
              mode === 'signup'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/45 hover:text-white/70'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
              placeholder="••••••••"
            />
          </div>

          {mode === 'signup' && (
            <div className="animate-fade-in">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')} className="text-pink-400 hover:text-pink-300 font-medium">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-pink-400 hover:text-pink-300 font-medium">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <p className="mt-8 text-center text-[11px] text-white/30">
        Protected access · Lvbl Infinity © 2026
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">Loading…</div>}>
      <AuthForm />
    </Suspense>
  )
}
