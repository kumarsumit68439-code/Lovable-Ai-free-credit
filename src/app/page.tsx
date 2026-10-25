import { redirect } from 'next/navigation'

// Prefer (site)/page.tsx — this avoids conflict if both exist
export default function RootPageRedirect() {
  redirect('/')
}
