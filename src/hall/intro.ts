/**
 * Opening of the entrance hall, in seconds from the moment the loading screen starts to lift
 * (hall/gate.ts). The hall is already lit; one table so the choreography reads in one place:
 *   camera settles -> name -> line, buttons -> label, with one glint across the glass.
 * Buttons and links work throughout; nothing waits for the sequence.
 */
export const INTRO = {
  cameraSettle: { delay: 0, duration: 2.6 },
  glare: { delay: 0.6, duration: 1.6 },
  now: { delay: 0.2, duration: 0.9 },
  name: { delay: 0.3, duration: 1.2, stagger: 0.045 },
  sub: { delay: 1.0, duration: 0.9 },
  ctas: { delay: 1.2, duration: 0.9 },
  label: { delay: 1.45, duration: 0.9 },
} as const

export type IntroStep = keyof typeof INTRO

/** Timing for one step, ready to spread into a Motion transition. */
export const at = (step: IntroStep) => ({ delay: INTRO[step].delay, duration: INTRO[step].duration })
