import { useCallback, useSyncExternalStore } from 'react'

/** Live media query match, e.g. useMediaQuery('(min-width: 901px)'). */
export function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}
