import Link from 'next/link'
import { PLANS } from '@/lib/utils'

const faqs = [
  {
    q: 'What plans are available?',
    a: 'All plans are completely free: 7 Days, 15 Days, and 30 Days of unlimited access, plus a free trial.',
  },
  {
    q: 'Which plan should I choose?',
    a: 'Start with the free trial. For longer use, choose 7, 15, or 30 days based on your needs.',
  },
  {
    q: 'How do I get started?',
    a: 'Sign in, open Download, enter a valid license key, install the extension in developer mode, and activate with your key.',
  },
  {
    q: 'Are the plans available for 2026?',
    a: 'Yes. The extension and every free plan are fully updated for 2026.',
  },
]

export default function HomePage() {
  return (
    <div className="pt-24">
      <section className="relative overflow-hidden px-6 pb-24 pt-16 text-center">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            NEW · UPDATED FOR 2026
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl animate-fade-up delay-1">
            <span className="text-white">Lvbl Infinity</span>
            <br />
            <span className="gradient-text">Unlimited Extension</span>
          </h1>
          <p className="mt-6 text-lg text-white/55 animate-fade-up delay-2">
            Unlimited credits access · Built for 2026 workflows
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-3">
            <Link
              href="/#pricing"
              className="gradient-btn rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg shadow-pink-500/25"
            >
              Grab Free Trial
            </Link>
            <Link
              href="/#pricing"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-base font-medium text-white hover:bg-white/10 transition"
            >
              View Plans
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] uppercase tracking-[0.2em] text-white/35 animate-fade-up delay-4">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Simple Access
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" /> Multiple Plans
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Updated for 2026
            </span>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything You Need to Get Started</h2>
          <p className="mt-3 text-white/50">Choose the access period that works best for you.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Unlimited Credits', desc: 'Full access included with your selected plan — no unnecessary complexity.' },
              { title: 'Simple Plans', desc: '7-day, 15-day, or 30-day access. Every plan is free.' },
              { title: 'Updated for 2026', desc: 'Aligned with the latest version and current access requirements.' },
            ].map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-6 text-left transition hover:border-pink-500/30">
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl glass-card shimmer-border rounded-2xl p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-pink-400">Limited Offer</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Try It Free</h2>
          <p className="mt-2 text-white/55">Experience full unlimited access with zero commitment.</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-white/65">
            <li>• Full unlimited access</li>
            <li>• No credit card</li>
            <li>• Instant activation</li>
          </ul>
          <Link href="/download" className="gradient-btn mt-6 inline-block rounded-full px-8 py-3 font-semibold text-white">
            Grab Free Trial
          </Link>
        </div>
      </section>

      <section id="pricing" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Choose Your Access Plan</h2>
          <p className="mt-3 text-white/50">All plans are completely free. Pick the duration you need.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {PLANS.filter((p) => p.id !== 'trial').map((plan) => (
              <div key={plan.id} className="glass-card rounded-2xl p-6 text-left transition hover:border-pink-500/40">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold gradient-text">Free</span>
                  <span className="text-sm text-white/40">₹0</span>
                </div>
                <p className="mt-2 text-sm text-white/50">{plan.description}</p>
                <Link href="/download" className="gradient-btn mt-6 block w-full rounded-full py-2.5 text-center text-sm font-semibold text-white">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/40">7 Days — Free · 15 Days — Free · 30 Days — Free</p>
        </div>
      </section>

      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold text-white">FAQ</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group glass-card rounded-xl open:bg-white/[0.05]">
                <summary className="cursor-pointer list-none px-5 py-4 text-left font-medium text-white flex items-center justify-between">
                  {item.q}
                  <span className="text-white/40 transition group-open:rotate-180">▾</span>
                </summary>
                <div className="border-t border-white/10 px-5 py-4 text-sm text-white/60 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
