import { createContext, useContext } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export type ThemeOrigin = Element | { x: number; y: number } | null

/**
 * Switch lighting. Pass the element (or point) the change came from so the
 * circular reveal starts there.
 */
export type SetTheme = (next: ThemePreference, origin?: ThemeOrigin) => void

export interface ThemeContextValue {
  preference: ThemePreference
  /** What is actually on screen ("Day" or "Night" gallery) */
  theme: ResolvedTheme
  setTheme: SetTheme
}

export const STORAGE_KEY = 'rvl-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
