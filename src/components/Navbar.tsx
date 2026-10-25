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
  if (pathname === '/login') return null
  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/license') ||
    pathname?.startsWith('/settings')
  ) {
    return null
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 animate-fade-up">
      <nav className="glass-nav flex items-center gap-1 rounded-full px-2 py-1.5 max-w-5xl w-full md:w-auto">
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 shadow-md shadow-pink-500/20" />
          <span className="font-semibold text-white text-sm hidden sm:inline tracking-tight">
            Lvbl Infinity
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1 pl-1 ml-auto">
          <Link
            href="/dashboard"
            className="rounded-full px-3 py-1.5 text-sm text-white/65 hover:text-white hover:bg-white/10 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/#pricing"
            className="gradient-btn rounded-full px-4 py-1.5 text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}
