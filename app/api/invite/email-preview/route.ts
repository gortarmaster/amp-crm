import { NextRequest, NextResponse } from 'next/server'
import { buildInviteEmail } from '@/lib/invite/email'

export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url)
  return new NextResponse(buildInviteEmail(origin), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
