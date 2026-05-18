'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

export default function SendInviteButton({ disabled }: { disabled: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const router = useRouter()

  async function handleSend() {
    if (state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/invite/send', { method: 'POST' })
      const json = await res.json()
      if (json.ok) {
        setState('sent')
        setTimeout(() => {
          setState('idle')
          router.refresh()
        }, 2000)
      } else {
        console.error(json.error)
        setState('error')
        setTimeout(() => setState('idle'), 3000)
      }
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  if (disabled) {
    return (
      <span className="inline-flex items-center gap-2 rounded-token-md border border-line px-4 py-2 text-caption text-ink-muted">
        Survey submitted ✓
      </span>
    )
  }

  const label = {
    idle: 'Send invite',
    sending: 'Sending…',
    sent: 'Sent ✓',
    error: 'Failed — retry?',
  }[state]

  return (
    <button
      onClick={handleSend}
      disabled={state === 'sending'}
      className={`inline-flex items-center gap-2 rounded-token-md px-4 py-2 text-caption font-semibold transition-colors disabled:opacity-60 ${
        state === 'error'
          ? 'bg-red-900/30 text-red-400'
          : state === 'sent'
          ? 'bg-gold/10 text-gold'
          : 'bg-gold text-bg-base hover:bg-gold-light'
      }`}
    >
      <Send size={13} />
      {label}
    </button>
  )
}
