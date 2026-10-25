import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segments = []
  for (let s = 0; s < 4; s++) {
    let seg = ''
    for (let i = 0; i < 4; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)]
    }
    segments.push(seg)
  }
  return segments.join('-')
}

export const PLANS = [
  { id: '7days', name: '7 Days Plan', days: 7, price: 0, label: 'Free', description: 'Perfect for a quick test drive.' },
  { id: '15days', name: '15 Days Plan', days: 15, price: 0, label: 'Free', description: 'Most popular choice for task completion.' },
  { id: '30days', name: '30 Days Plan', days: 30, price: 0, label: 'Free', description: 'Best value for long-term power users.' },
  { id: 'trial', name: '30 Minute Trial', days: 0, minutes: 30, price: 0, label: 'Free Trial', description: 'Experience full unlimited access with zero commitment.' },
] as const

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sumitjilowa34@gmail.com'
