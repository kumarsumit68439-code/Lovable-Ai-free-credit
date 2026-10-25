import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import path from 'path'

function dbClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const key = body.key
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Key required' }, { status: 400 })
    }

    const normalized = key.trim().toUpperCase()
    const supabase = dbClient()
    const { data, error } = await supabase
      .from('license_keys')
      .select('*')
      .ilike('key', normalized)
      .eq('active', true)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 404 })
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Key expired' }, { status: 403 })
    }

    const candidates = [
      path.join(process.cwd(), 'public', 'extension', 'lvbl-infinity-v16.50.zip'),
      path.join(process.cwd(), 'public', 'extension', 'lvbl-infinity-extension.zip'),
      path.join(process.cwd(), 'public', 'extension', 'lvbl-infinity-v16.50-own.zip'),
    ]

    let buf: Buffer | null = null
    for (const zipPath of candidates) {
      try {
        buf = await readFile(/*turbopackIgnore: true*/ zipPath)
        if (buf.length > 1000) break
      } catch {
        /* try next */
      }
    }

    if (!buf || buf.length < 1000) {
      return NextResponse.json(
        {
          error:
            'Extension package not on server. Add public/extension/lvbl-infinity-v16.50.zip to the repo.',
        },
        { status: 404 }
      )
    }

    await supabase
      .from('license_keys')
      .update({ used_count: (data.used_count || 0) + 1 })
      .eq('id', data.id)

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="lvbl-infinity-extension.zip"',
        'Content-Length': String(buf.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
