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
    <div className="auth-shell animate-scale-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            margin: '0 auto 1rem',
            width: 56,
            height: 56,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ff8a00, #e52e71, #7b61ff)',
            boxShadow: '0 8px 24px rgba(229, 46, 113, 0.35)',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>∞</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fff' }}>
          Lvbl <span className="gradient-text">Infinity</span>
        </h1>
        <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          {mode === 'login'
            ? 'Sign in to continue to your dashboard'
            : 'Create an account to get started'}
        </p>
      </div>

      <div className="glass-card shimmer-border" style={{ borderRadius: 24, padding: '1.75rem' }}>
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login')
              setError('')
              setSuccess('')
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup')
              setError('')
              setSuccess('')
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div className="auth-field animate-fade-in">
              <label className="auth-label" htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                className="auth-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                placeholder="••••••••"
              />
            </div>
          )}
          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          {success && <div className="auth-alert auth-alert-ok">{success}</div>}
          <button type="submit" className="gradient-btn auth-submit" disabled={loading}>
            {loading
              ? mode === 'login'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-link">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')}>Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>Sign in</button>
            </>
          )}
        </div>
      </div>

      <p style={{ marginTop: 32, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
        Protected access · Lvbl Infinity © 2026
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading…</div>}>
      <AuthForm />
    </Suspense>
  )
}
