import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// 1×1 transparent GIF
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

export async function GET(req: Request) {
  const ua = req.headers.get('user-agent') ?? null
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null

  try {
    const supabase = createServerClient()
    await supabase.from('invite_events').insert({ event_type: 'opened', user_agent: ua, ip })
  } catch { /* never block the pixel response */ }

  return new NextResponse(PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}
