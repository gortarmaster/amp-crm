'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import type { IntakeAnswers } from '@/lib/intake/types'
import IntroScreen from './components/IntroScreen'
import ChapterProgress from './components/ChapterProgress'
import Chapter1 from './components/Chapter1'
import Chapter2 from './components/Chapter2'
import Chapter3 from './components/Chapter3'
import Chapter4 from './components/Chapter4'
import Chapter5 from './components/Chapter5'
import SummaryScreen from './components/SummaryScreen'
import SuccessScreen from './components/SuccessScreen'

const CHAPTER_META = [
  { n: 1, title: 'Home Base', emoji: '🌐', subtitle: 'Where do you live online?' },
  { n: 2, title: 'Money', emoji: '💳', subtitle: 'How you get paid and keep the books.' },
  { n: 3, title: 'Booking Flow', emoji: '📋', subtitle: 'From first inquiry to signed contract.' },
  { n: 4, title: 'Project & Delivery', emoji: '📦', subtitle: 'How you manage active work and hand off the final product.' },
  { n: 5, title: 'Pain Points', emoji: '⚡', subtitle: 'The honest part.' },
]

const STORAGE_KEY = 'intake_draft'

// step 0 = intro, 1–5 = chapters, 6 = summary, 7 = success
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export default function IntakePage() {
  const searchParams = useSearchParams()
  const nameParam = searchParams.get('name') ?? undefined
  const isResume = searchParams.get('resume') === '1'
  const isPreview = searchParams.get('preview') === '1'

  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<Partial<IntakeAnswers>>({})
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [, startTransition] = useTransition()
  const [submitting, setSubmitting] = useState(false)

  const patch = useCallback((p: Partial<IntakeAnswers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...p }
      if (!isPreview) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      }
      return next
    })
  }, [isPreview])

  useEffect(() => {
    if (isPreview) return // skip auth + resume logic entirely in preview mode

    const supabase = createBrowserClient()

    async function init() {
      const { data: { user: sbUser } } = await supabase.auth.getUser()

      if (sbUser) {
        setUser({ email: sbUser.email ?? '', name: sbUser.user_metadata?.full_name ?? sbUser.user_metadata?.name ?? null })

        if (isResume) {
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setAnswers(JSON.parse(raw))
          } catch { /* ignore */ }

          try {
            const res = await fetch('/api/intake/save')
            const json = await res.json()
            if (json.ok && json.data) {
              if (json.data.submitted_at) { setStep(7); return }
              const { completed_chapters, id, created_at, updated_at, submitted_at, respondent_email, respondent_name, respondent_google_id, ...rest } = json.data
              setAnswers((prev) => ({ ...prev, ...rest }))
              const resumeStep = Math.min(Math.max((completed_chapters ?? 0) + 1, 1), 5) as Step
              setStep(resumeStep)
              return
            }
          } catch { /* ignore */ }

          setStep(2)
        }
      } else if (isResume) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) setAnswers(JSON.parse(raw))
        } catch { /* ignore */ }
      }
    }

    init()
  }, [isResume, isPreview])

  async function saveChapter(chapterNum: number, chapterAnswers: Partial<IntakeAnswers>) {
    if (isPreview) return
    setSaving(true)
    try {
      await fetch('/api/intake/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter: chapterNum, answers: chapterAnswers }),
      })
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function handleNext() {
    if (step === 0) {
      setStep(1)
      return
    }

    if (step >= 1 && step <= 5) {
      const currentChapter = step as number

      if (currentChapter === 1 && !user && !isPreview) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)) } catch { /* ignore */ }
        setShowAuthModal(true)
        return
      }

      startTransition(() => {
        saveChapter(currentChapter, answers)
      })

      if (currentChapter < 5) {
        setStep((currentChapter + 1) as Step)
      } else {
        setStep(6)
      }
      return
    }
  }

  async function handleSignIn() {
    const supabase = createBrowserClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=/intake?resume=1`
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
  }

  async function handleSubmit() {
    if (isPreview) {
      setStep(7)
      return
    }
    setSubmitting(true)
    try {
      await fetch('/api/intake/submit', { method: 'POST' })
      setStep(7)
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  // ── Render ──────────────────────────────────────────────────────────────

  if (step === 0) {
    return <IntroScreen name={nameParam} onStart={() => setStep(1)} />
  }

  if (step === 7) {
    return <SuccessScreen name={isPreview ? 'Andres' : (user?.name ?? undefined)} />
  }

  if (step === 6) {
    return (
      <SummaryScreen
        answers={answers}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    )
  }

  const chapterIdx = (step as number) - 1
  const meta = CHAPTER_META[chapterIdx]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Preview banner */}
      {isPreview && (
        <div className="flex items-center justify-center gap-2 bg-gold/10 px-4 py-2 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gold">Preview mode</span>
          <span className="text-[11px] text-ink-muted">— nothing is saved · auth is skipped</span>
        </div>
      )}

      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-light.svg" alt="AM" className="h-6 w-auto opacity-80" />
        {saving && <span className="text-caption text-ink-muted animate-pulse">Saving…</span>}
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        {/* Progress */}
        <div className="mb-10">
          <ChapterProgress current={step as number} />
        </div>

        {/* Chapter header */}
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl" aria-hidden>{meta.emoji}</span>
            <h2 className="text-[1.5rem] font-bold tracking-tight text-ink-primary">{meta.title}</h2>
          </div>
          <p className="text-body text-ink-muted">{meta.subtitle}</p>
        </div>

        {/* Chapter form */}
        <div className="mb-10">
          {step === 1 && <Chapter1 answers={answers} onChange={patch} />}
          {step === 2 && <Chapter2 answers={answers} onChange={patch} />}
          {step === 3 && <Chapter3 answers={answers} onChange={patch} />}
          {step === 4 && <Chapter4 answers={answers} onChange={patch} />}
          {step === 5 && <Chapter5 answers={answers} onChange={patch} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {(step as number) > 1 ? (
            <button
              onClick={() => setStep(((step as number) - 1) as Step)}
              className="text-caption text-ink-muted hover:text-ink-secondary transition-colors"
            >
              ← Back
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-token-md bg-gold px-8 py-2.5 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light"
          >
            {step === 5 ? 'Review answers' : 'Next'}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      {/* Google sign-in modal — never shown in preview */}
      {showAuthModal && !isPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-token-lg border border-line bg-bg-card p-8 text-center shadow-xl">
            <div className="mb-4 text-3xl">🔒</div>
            <h3 className="mb-2 text-body font-semibold text-ink-primary">Save your progress</h3>
            <p className="mb-6 text-caption text-ink-muted leading-relaxed">
              Sign in with Google so your answers are saved and you can pick up where you left off.
            </p>
            <button
              onClick={handleSignIn}
              className="mb-3 flex w-full items-center justify-center gap-3 rounded-token-md border border-line bg-bg-base px-4 py-3 text-caption font-medium text-ink-primary transition-colors hover:bg-bg-hover"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-caption text-ink-muted hover:text-ink-secondary transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
