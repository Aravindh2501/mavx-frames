'use client'

import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react'
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

// Keep query-dependent owner controls inside a small boundary so public content
// is present in static HTML even before hydration.
function EditModeReader({ onChange }: { onChange: (value: boolean) => void }) {
  const params = useSearchParams()
  const edit = params.get('edit') === 'true'
  useEffect(() => onChange(edit), [edit, onChange])
  return null
}

export default function UIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isEdit, setIsEdit] = useState(false)

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
      <Suspense fallback={null}><EditModeReader onChange={setIsEdit} /></Suspense>
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
