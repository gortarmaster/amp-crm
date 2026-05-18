import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dest = searchParams.get('to') ?? '/intake?name=Andres'
  const ua = req.headers.get('user-agent') ?? null
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null

  try {
    const supabase = createServerClient()
    await supabase.from('invite_events').insert({ event_type: 'clicked', user_agent: ua, ip })
  } catch { /* never block the redirect */ }

  return NextResponse.redirect(new URL(dest, req.url))
}
