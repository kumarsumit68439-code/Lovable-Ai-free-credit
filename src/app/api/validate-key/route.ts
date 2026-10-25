import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json()
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ valid: false, error: 'Key required' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('license_keys')
      .select('*')
      .eq('key', key.trim().toUpperCase())
      .eq('active', true)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ valid: false, error: 'Invalid key' }, { status: 404 })
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Key expired' }, { status: 403 })
    }
    return NextResponse.json({
      valid: true,
      plan: data.plan,
      expires_at: data.expires_at,
    })
  } catch {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
