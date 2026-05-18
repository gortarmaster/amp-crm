import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import { formatIntakeEmail } from '@/lib/intake/email'
import type { IntakeSubmission } from '@/lib/intake/types'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

  const googleId = user.user_metadata?.sub ?? user.id

  const { data: submission, error: fetchErr } = await supabase
    .from('intake_submissions')
    .select('*')
    .eq('respondent_google_id', googleId)
    .maybeSingle()

  if (fetchErr || !submission) {
    return NextResponse.json({ ok: false, error: 'Submission not found' }, { status: 404 })
  }

  if (submission.submitted_at) {
    return NextResponse.json({ ok: true, alreadySubmitted: true })
  }

  const { error: updateErr } = await supabase
    .from('intake_submissions')
    .update({ submitted_at: new Date().toISOString(), completed_chapters: 5 })
    .eq('respondent_google_id', googleId)

  if (updateErr) {
    return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { subject, html, text } = formatIntakeEmail(submission as IntakeSubmission)
    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to: process.env.NOTIFICATION_EMAIL ?? '',
      subject,
      html,
      text,
    })
  } catch (err) {
    console.error('Resend error:', err)
  }

  return NextResponse.json({ ok: true })
}
