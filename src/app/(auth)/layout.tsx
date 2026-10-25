export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="premium-bg" aria-hidden>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
