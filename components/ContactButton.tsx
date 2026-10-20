'use client'

import { useUI } from './UIProvider'

export default function ContactButton({ label, className = 'btn-solid' }: { label: string; className?: string }) {
  const { openContact } = useUI()
  return (
    <button onClick={openContact} className={className}>
      {label}
    </button>
  )
}
