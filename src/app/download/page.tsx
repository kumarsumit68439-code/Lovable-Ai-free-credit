'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DownloadPage() {
  const [key, setKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) {
      setStatus('error')
      setMessage('Please enter a license or trial key.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setStatus('error')
        setMessage(data.error || 'Invalid or expired key.')
        return
      }
      setStatus('ok')
      setMessage('Key valid. Download starting...')
      const a = document.createElement('a')
      a.href = '/extension/lvbl-infinity-v16.50.zip'
      a.download = 'lvbl-infinity-extension.zip'
      a.click()
    } catch {
      setStatus('error')
      setMessage('Validation failed. Try again.')
    }
  }

  return (
    <div className="pt-28 px-6 pb-20 min-h-screen">
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-2xl font-bold text-white">Unlock download</h1>
          <p className="mt-1 text-sm text-white/50">Only available for valid keys.</p>
          <form onSubmit={handleDownload} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-white/40">
                LICENSE KEY OR TRIAL KEY *
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your key..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-white/30 focus:border-pink-500/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 py-3 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Validating...' : '↓ Download extension (.zip)'}
            </button>
            {message && (
              <p className={`text-sm ${status === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>
            )}
          </form>
          <p className="mt-4 text-center text-xs text-white/30">CURRENT VERSION: 6.0</p>
          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/50">Don&apos;t have an activation key?</p>
            <Link
              href="/#pricing"
              className="mt-3 inline-block rounded-full border border-white/20 px-6 py-2 text-sm text-white hover:bg-white/5 transition"
            >
              Get Free Plan
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-xl font-bold text-white">How to install</h2>
          <p className="mt-1 text-sm text-white/50">5 quick steps — takes less than a minute.</p>
          <ol className="mt-6 space-y-4">
            {[
              'Unzip the downloaded file.',
              'Open chrome://extensions',
              'Enable Developer mode.',
              'Click Load unpacked and select the folder.',
              'Done — activate with your license key.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-white/10 p-4">
              <p className="font-medium text-white">Always up to date</p>
              <p className="mt-1 text-white/50 text-xs">You always download the latest approved build.</p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <p className="font-medium text-white">Chrome, Edge, Brave and Arc</p>
              <p className="mt-1 text-white/50 text-xs">Quick install in developer mode.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
