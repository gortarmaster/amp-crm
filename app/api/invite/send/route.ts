import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase/server'
import { buildInviteEmail } from '@/lib/invite/email'

export async function POST(req: NextRequest) {
  const { origin } = new URL(req.url)
  const to = process.env.ANDRES_EMAIL

  if (!to) {
    return NextResponse.json({ ok: false, error: 'ANDRES_EMAIL env var not set' }, { status: 500 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to,
      subject: "5 minutes — let's map out your workflow",
      html: buildInviteEmail(origin),
      text: `Hey Andres,\n\nBefore we build anything, I want to understand how you work.\n\nI put together a short survey — 5 chapters, about 5 minutes — that walks through your tools, booking flow, how you handle money, and where the friction is.\n\nStart here: ${origin}/intake?name=Andres\n\n— Aaron`,
    })

    const supabase = createServerClient()
    await supabase.from('invite_events').insert({ event_type: 'sent' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Invite send error:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
