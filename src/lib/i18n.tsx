"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Messages = Record<string, any>

interface I18nContextValue {
  locale: string
  setLocale: (l: string) => void
  t: (key: string, fallback?: string) => string
  ready: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>(() => {
    if (typeof window === 'undefined') return 'fr'
    const stored = localStorage.getItem('locale')
    if (stored) return stored
    const nav = navigator.language || navigator.languages?.[0] || 'fr'
    return nav.startsWith('fr') ? 'fr' : 'en'
  })
  const [messages, setMessages] = useState<Messages>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    localStorage.setItem('locale', locale)
    setReady(false)
    import(`../locales/${locale}.json`)
      .then((mod) => {
        setMessages(mod)
        setReady(true)
      })
      .catch(() => {
        setMessages({})
        setReady(true)
      })
  }, [locale])

  const t = (key: string, fallback = '') => {
    const parts = key.split('.')
    let cur: any = messages
    for (const p of parts) {
      if (!cur) return fallback || key
      cur = cur[p]
    }
    if (typeof cur === 'string') return cur
    return fallback || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, ready }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslations() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useTranslations must be used within I18nProvider')
  }
  return ctx
}
