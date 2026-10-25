import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateLicenseKey, ADMIN_EMAIL } from '@/lib/utils'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const plan = body.plan || '30days'
    const days = plan === '7days' ? 7 : plan === '15days' ? 15 : plan === 'trial' ? 0 : 30
    const key = generateLicenseKey()
    const expires_at = days === 0
      ? new Date(Date.now() + 30 * 60 * 1000).toISOString()
      : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabaseAdmin
      .from('license_keys')
      .insert({
        key,
        plan,
        active: true,
        used_count: 0,
        label: body.label || null,
        expires_at,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ key: data.key, plan: data.plan, expires_at: data.expires_at })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
