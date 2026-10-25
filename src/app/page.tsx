import Link from 'next/link'
import { PLANS } from '@/lib/utils'

const faqs = [
  { q: 'What plans are available?', a: 'All plans are completely free: 7 Days, 15 Days, and 30 Days unlimited access, plus a free trial.' },
  { q: 'Which plan should I choose?', a: 'Start with the free trial. For longer use, pick 7, 15, or 30 days.' },
  { q: 'How do I get started?', a: 'Select a free plan, get a license key, download the extension, load it in developer mode, and activate with your key.' },
  { q: 'Are the plans available for 2026?', a: 'Yes. The extension and all free plans are fully updated for 2026.' },
]

export default function HomePage() {
  return (
    <div className="pt-24">
      <section className="relative overflow-hidden px-6 pb-20 pt-16 text-center">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            NEW • UPDATED FOR 2026
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-white">Lvbl Infinity</span>
            <br />
            <span className="bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Unlimited Extension
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/60">Unlimited Credits Access • Updated for 2026</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/#pricing" className="rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:opacity-90 transition">
              Grab Free Trial
            </Link>
            <Link href="/#pricing" className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-medium text-white hover:bg-white/10 transition">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything You Need to Get Started</h2>
          <p className="mt-3 text-white/50">Choose the access period that works best for you.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Unlimited Credits', desc: 'Get the access included with your selected plan without unnecessary complexity.' },
              { title: 'Simple Plans', desc: 'Choose from 7-day, 15-day, or 30-day access. All free.' },
              { title: 'Updated for 2026', desc: 'Designed around the latest version and current access requirements.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Choose Your Access Plan</h2>
          <p className="mt-3 text-white/50">All plans are completely free.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {PLANS.filter((p) => p.id !== 'trial').map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left hover:border-pink-500/40 transition">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">Free</span>
                  <span className="text-sm text-white/40">₹0</span>
                </div>
                <p className="mt-2 text-sm text-white/50">{plan.description}</p>
                <Link href="/download" className="mt-6 block w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90 transition">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold text-white">FAQ</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group rounded-xl border border-white/10 bg-white/[0.03]">
                <summary className="cursor-pointer list-none px-5 py-4 text-left font-medium text-white flex items-center justify-between">
                  {item.q}
                  <span className="text-white/40">▾</span>
                </summary>
                <div className="border-t border-white/10 px-5 py-4 text-sm text-white/60">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
