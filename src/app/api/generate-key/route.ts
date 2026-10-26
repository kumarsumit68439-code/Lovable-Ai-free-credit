import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateLicenseKey, ADMIN_EMAIL } from '@/lib/utils'

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              /* ignore */
            }
          },
        },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized — please login again' },
        { status: 401 }
      )
    }

    const email = (user.email || '').toLowerCase()
    const adminEmail = (process.env.ADMIN_EMAIL || ADMIN_EMAIL).toLowerCase()
    if (email !== adminEmail) {
      return NextResponse.json(
        { error: `Unauthorized — admin only (signed in as ${user.email})` },
        { status: 401 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error:
            'Server missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel env and redeploy.',
        },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const plan = (body.plan as string) || '1hour'
    const label = (body.label as string) || null

    let ms = 60 * 60 * 1000
    if (plan === '2hours') ms = 2 * 60 * 60 * 1000
    else if (plan === '1hour' || plan === 'trial') ms = 60 * 60 * 1000
    else if (plan === '24hours') ms = 24 * 60 * 60 * 1000
    else if (plan === '7days') ms = 7 * 24 * 60 * 60 * 1000
    else if (plan === '15days') ms = 15 * 24 * 60 * 60 * 1000
    else if (plan === '30days') ms = 30 * 24 * 60 * 60 * 1000

    const key = generateLicenseKey()
    const expires_at = new Date(Date.now() + ms).toISOString()

    const db = adminClient()
    const { data, error } = await db
      .from('license_keys')
      .insert({
        key,
        plan,
        active: true,
        used_count: 0,
        label,
        expires_at,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({
      key: data.key,
      plan: data.plan,
      expires_at: data.expires_at,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
