import { useMediaQuery } from '../hooks/useMediaQuery'

/** Live `prefers-reduced-motion: reduce`. Use this outside motion/react components (Lenis, three). */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
