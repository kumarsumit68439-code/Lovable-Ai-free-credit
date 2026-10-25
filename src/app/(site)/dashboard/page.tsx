'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/utils'

type License = {
  id: string
  key: string
  plan: string
  active: boolean
  used_count: number
  created_at: string
  expires_at: string | null
  label: string | null
}

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      setEmail(user.email || '')
      const admin = (user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase()
      setIsAdmin(admin)
      if (!admin) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('license_keys')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setLicenses(data || [])
      setLoading(false)
    }
    check()
  }, [router, supabase])

  async function generateKey(plan: string) {
    setGenerating(true)
    setNewKey('')
    setMsg('')
    try {
      const res = await fetch('/api/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (res.ok && data.key) {
        setNewKey(data.key)
        const { data: list } = await supabase
          .from('license_keys')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        setLicenses(list || [])
      } else {
        setMsg(data.error || 'Could not generate key.')
      }
    } finally {
      setGenerating(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50 pt-20">
        Loading…
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="glass-card rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-white">Access denied</h1>
          <p className="mt-3 text-sm text-white/50">
            The admin panel is only available for the authorized administrator account.
          </p>
          <p className="mt-2 text-xs text-white/30">Signed in as {email}</p>
          <div className="mt-6 flex flex-col gap-2">
            <a href="/download" className="gradient-btn rounded-full py-2.5 text-sm font-semibold text-white">
              Go to Download
            </a>
            <a href="/" className="rounded-full border border-white/15 py-2.5 text-sm text-white/70">
              Home
            </a>
            <button onClick={signOut} className="text-sm text-white/40 hover:text-white mt-2">
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin panel</h1>
            <p className="text-sm text-white/50 mt-1">
              {email} · Generate unique extension keys
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
              Home
            </a>
            <button
              onClick={signOut}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wide">Total keys</p>
            <p className="mt-2 text-3xl font-bold text-white">{licenses.length}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wide">Active</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {licenses.filter((l) => l.active).length}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wide">System</p>
            <p className="mt-2 text-sm text-emerald-400">Operational</p>
          </div>
        </div>

        {newKey && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">New key created (copy and share with user)</p>
            <p className="mt-1 font-mono text-lg text-white break-all select-all">{newKey}</p>
          </div>
        )}
        {msg && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {msg}
          </div>
        )}

        <div className="glass-card rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-3">Generate extension key</h2>
          <p className="text-xs text-white/40 mb-4">
            Each key is unique. Choose validity — 1 hour or 2 hours for short access, or multi-day.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: '1hour', label: '1 Hour' },
              { id: '2hours', label: '2 Hours' },
              { id: '7days', label: '7 Days' },
              { id: '15days', label: '15 Days' },
              { id: '30days', label: '30 Days' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => generateKey(p.id)}
                disabled={generating}
                className="gradient-btn rounded-full px-4 py-2 text-sm disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4">License keys</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="pb-3 font-medium pr-4">Key</th>
                  <th className="pb-3 font-medium pr-4">Plan</th>
                  <th className="pb-3 font-medium pr-4">Uses</th>
                  <th className="pb-3 font-medium pr-4">Status</th>
                  <th className="pb-3 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody>
                {licenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/40">
                      No keys yet. Generate one above.
                    </td>
                  </tr>
                ) : (
                  licenses.map((l) => (
                    <tr key={l.id} className="border-b border-white/5 text-white/70">
                      <td className="py-3 font-mono text-xs text-white pr-4 select-all">{l.key}</td>
                      <td className="py-3 pr-4">{l.plan}</td>
                      <td className="py-3 pr-4">{l.used_count ?? 0}</td>
                      <td className="py-3 pr-4">
                        <span className={l.active ? 'text-emerald-400' : 'text-red-400'}>
                          {l.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-xs">
                        {l.expires_at ? new Date(l.expires_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
