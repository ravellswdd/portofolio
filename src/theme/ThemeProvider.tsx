import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import {
  STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type SetTheme,
  type ThemeOrigin,
  type ThemePreference,
} from './theme-context'

const darkQuery = '(prefers-color-scheme: dark)'
const reducedQuery = '(prefers-reduced-motion: reduce)'

function subscribeSystem(cb: () => void) {
  const mq = window.matchMedia(darkQuery)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getSystem = (): ResolvedTheme => (window.matchMedia(darkQuery).matches ? 'dark' : 'light')

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* storage blocked: fall back to system */
  }
  return 'system'
}

/** Mirrors the inline script in index.html: no attribute means "follow the system". */
function applyPreference(pref: ThemePreference) {
  const root = document.documentElement
  if (pref === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', pref)
  try {
    if (pref === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, pref)
  } catch {
    /* ignore */
  }
}

function originPoint(origin: ThemeOrigin | undefined) {
  if (!origin) return { x: window.innerWidth / 2, y: 0 }
  if ('getBoundingClientRect' in origin) {
    const r = origin.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return origin
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(readPreference)
  const system = useSyncExternalStore(subscribeSystem, getSystem, () => 'light' as const)
  const theme: ResolvedTheme = preference === 'system' ? system : preference
  const running = useRef<ViewTransition | null>(null)

  useEffect(() => {
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme)
  }, [theme])

  const setTheme = useCallback<SetTheme>((next, origin) => {
    const commit = () => {
      flushSync(() => setPreference(next))
      applyPreference(next)
    }

    const canAnimate =
      typeof document.startViewTransition === 'function' && !window.matchMedia(reducedQuery).matches
    if (!canAnimate) {
      commit()
      return
    }

    // A second click while a reveal is still running finishes that one at once instead of waiting.
    running.current?.skipTransition()

    const { x, y } = originPoint(origin)
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(commit)
    running.current = transition
    transition.finished.finally(() => {
      if (running.current === transition) running.current = null
    })
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 480, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {
        /* transition skipped: the swap already happened */
      })
  }, [])

  const value = useMemo(() => ({ preference, theme, setTheme }), [preference, theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
