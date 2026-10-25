'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/#features', label: 'Features' },
  { href: '/download', label: 'Download' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const isDashboard =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/license') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/users') ||
    pathname?.startsWith('/activity') ||
    pathname?.startsWith('/api-') ||
    pathname?.startsWith('/docs')

  if (isDashboard) return null

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-1.5 backdrop-blur-xl shadow-lg shadow-black/40">
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
          <span className="font-semibold text-white text-sm hidden sm:inline">Lvbl Infinity</span>
        </Link>
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1 pl-1">
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            Support
          </Link>
          <Link
            href="/#pricing"
            className="rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 px-4 py-1.5 text-sm font-medium text-white shadow-md hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}
