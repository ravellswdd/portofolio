import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

/** The Lenis instance, or null when smooth scrolling is off (reduced motion). */
export const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)
