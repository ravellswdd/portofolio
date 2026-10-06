import { useSyncExternalStore } from 'react'

/*
 * The entrance gate: closed while the loading screen is up, opened as it lifts. The hall waits
 * for it before playing its opening (lettering, camera settle, glass glint).
 */
let open = false
const listeners = new Set<() => void>()

export function openGate() {
  if (open) return
  open = true
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useGateOpen() {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => true,
  )
}
