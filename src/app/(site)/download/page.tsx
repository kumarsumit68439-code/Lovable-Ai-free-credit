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
    setMessage('')
    try {
      const res = await fetch('/api/download-extension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMessage(data.error || 'Invalid or expired key.')
        return
      }
      const blob = await res.blob()
      if (blob.type.includes('html') || blob.size < 1000) {
        setStatus('error')
        setMessage('Download failed — package missing on server.')
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'lvbl-infinity-extension.zip'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setStatus('ok')
      setMessage('Key valid. Download started.')
    } catch {
      setStatus('error')
      setMessage('Download failed. Try again.')
    }
  }

  return (
    <div className="pt-28 px-6 pb-20 min-h-screen">
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white">Unlock download</h1>
          <p className="mt-1 text-sm text-white/50">Only available for valid keys.</p>
          <form onSubmit={handleDownload} className="mt-6 space-y-4">
            <div>
              <label className="auth-label">License key or trial key *</label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your key..."
                className="auth-input mt-2"
              />
            </div>
            <button type="submit" disabled={status === 'loading'} className="gradient-btn auth-submit">
              {status === 'loading' ? 'Validating…' : 'Download extension (.zip)'}
            </button>
            {message && (
              <p className={`text-sm ${status === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>
                {message}
              </p>
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

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white">How to install</h2>
          <p className="mt-1 text-sm text-white/50">Five quick steps — less than a minute.</p>
          <ol className="mt-6 space-y-4">
            {[
              'Unzip the downloaded file.',
              'Open chrome://extensions',
              'Enable Developer mode.',
              'Click Load unpacked and select the folder.',
              'Activate with your license key.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
