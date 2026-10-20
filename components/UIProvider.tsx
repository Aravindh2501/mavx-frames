'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ContactModal from './ContactModal'
import ProjectModal from './ProjectModal'
import type { Project } from '@/lib/types'

interface UI {
  isEdit: boolean
  href: (path: string, hash?: string) => string
  openContact: () => void
  openEditor: (project: Project | null) => void
}

const Ctx = createContext<UI | null>(null)

export function useUI() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}

export default function UIProvider({ children }: { children: React.ReactNode }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isEdit = params.get('edit') === 'true'

  const [contactOpen, setContactOpen] = useState(false)
  const [editor, setEditor] = useState<{ open: boolean; project: Project | null }>({
    open: false,
    project: null
  })

  const href = useCallback(
    (path: string, hash?: string) =>
      `${path}${isEdit ? '?edit=true' : ''}${hash ? `#${hash}` : ''}`,
    [isEdit]
  )

  const openContact = useCallback(() => setContactOpen(true), [])
  const openEditor = useCallback(
    (project: Project | null) => setEditor({ open: true, project }),
    []
  )

  const value = useMemo(
    () => ({ isEdit, href, openContact, openEditor }),
    [isEdit, href, openContact, openEditor]
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <ProjectModal
        open={editor.open}
        project={editor.project}
        onClose={() => setEditor((s) => ({ ...s, open: false }))}
        onSaved={() => {
          setEditor((s) => ({ ...s, open: false }))
          router.refresh()
        }}
        onDeleted={() => {
          setEditor((s) => ({ ...s, open: false }))
          if (pathname.startsWith('/work/')) router.push(href('/work'))
          router.refresh()
        }}
      />
    </Ctx.Provider>
  )
}
