import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 relative z-10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
              <span className="font-semibold text-white">Lvbl Infinity</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Unlimited access to the future of browser automation.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/download" className="hover:text-white transition">Download</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/#faq" className="hover:text-white transition">FAQ</Link></li>
              <li><span className="text-white/35">Terms of Service</span></li>
              <li><span className="text-white/35">Privacy Policy</span></li>
              <li><span className="text-white/35">Refund Policy</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Contact</h4>
            <a href="mailto:support@lvbl.ai" className="text-sm text-white/60 hover:text-white transition">
              support@lvbl.ai
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © 2026 Lvbl Infinity. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
