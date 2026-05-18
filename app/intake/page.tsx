import { Suspense } from 'react'
import IntakeClient from './IntakeClient'

export default function IntakePage() {
  return (
    <Suspense>
      <IntakeClient />
    </Suspense>
  )
}
