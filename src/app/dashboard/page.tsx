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
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newKey, setNewKey] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.replace('/login')
        return
      }
      const { data } = await supabase.from('license_keys').select('*').order('created_at', { ascending: false }).limit(50)
      setLicenses(data || [])
      setLoading(false)
    }
    check()
  }, [router, supabase])

  async function generateKey(plan: string) {
    setGenerating(true)
    setNewKey('')
    try {
      const res = await fetch('/api/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (res.ok && data.key) {
        setNewKey(data.key)
        const { data: list } = await supabase.from('license_keys').select('*').order('created_at', { ascending: false }).limit(50)
        setLicenses(list || [])
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
    return <div className="min-h-screen flex items-center justify-center text-white/50">Loading dashboard...</div>
  }

  const total = licenses.length
  const trial = licenses.filter((l) => l.plan === 'trial').length

  return (
    <div className="min-h-screen flex bg-[#050505]">
      <aside className="w-56 border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
          <div>
            <p className="text-xs font-bold text-white">LVBL</p>
            <p className="text-[10px] text-white/40">UNLIMITED EXTENSION</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 text-sm">
          <p className="text-[10px] uppercase text-white/30 px-2 mb-1">Main</p>
          <span className="block rounded-lg bg-white/10 px-3 py-2 text-white">Dashboard</span>
        </nav>
        <button onClick={signOut} className="mt-4 text-left text-sm text-white/50 hover:text-white px-2">
          Sign Out
        </button>
      </aside>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
            <p className="text-sm text-white/50">Monitor license activity in real-time.</p>
          </div>
          <button
            onClick={() => generateKey('30days')}
            disabled={generating}
            className="rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            + New License
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40 uppercase">Total Licenses</p>
            <p className="mt-2 text-3xl font-bold text-white">{total}</p>
            <p className="text-xs text-white/40 mt-1">{trial} Trial</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40 uppercase">Revenue</p>
            <p className="mt-2 text-3xl font-bold text-white">₹0</p>
            <p className="text-xs text-white/40 mt-1">All plans free</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs text-white/40 uppercase">System</p>
            <p className="mt-2 text-sm text-emerald-400">Operational</p>
          </div>
        </div>

        {newKey && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">New license created:</p>
            <p className="mt-1 font-mono text-lg text-white">{newKey}</p>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-semibold text-white">License Keys</h2>
            <div className="flex gap-2 flex-wrap">
              {['7days', '15days', '30days', 'trial'].map((p) => (
                <button
                  key={p}
                  onClick={() => generateKey(p)}
                  disabled={generating}
                  className="text-xs rounded-lg border border-white/20 px-3 py-1.5 text-white/70 hover:bg-white/5"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-white/40 border-b border-white/10">
                  <th className="pb-3 font-medium">Key</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody>
                {licenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/40">No licenses yet. Generate one above.</td>
                  </tr>
                ) : (
                  licenses.map((l) => (
                    <tr key={l.id} className="border-b border-white/5 text-white/70">
                      <td className="py-3 font-mono text-xs text-white">{l.key}</td>
                      <td className="py-3">{l.plan}</td>
                      <td className="py-3">
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
