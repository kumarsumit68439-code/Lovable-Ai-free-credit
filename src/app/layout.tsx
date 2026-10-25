import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lvbl Infinity Unlimited Extension',
  description:
    'Experience unlimited extension features with Lvbl Infinity. Secure license generation and management for professional developers.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased bg-[#030308] text-white">
        <div className="premium-bg" aria-hidden>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        {children}
      </body>
    </html>
  )
}
