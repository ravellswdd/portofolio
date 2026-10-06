// Follows 21st.dev "Custom Cursor" (soralabs): a dot on the pointer and a ring that follows on a
// spring and morphs into a larger ring over interactive targets; plus "Cursor" (unlumen): the
// ring stretches along its direction of travel and a label rides with it. Restyled to the
// exhibition: ink ring drawn with mix-blend difference (visible on light and dark walls), labels
// in the mono placard face. Elements can ask for a label with data-cursor="View" etc.
//
// Mouse and trackpad only (fine pointer, hover). Touch, pen and reduced motion keep the system
// cursor, and the native cursor is only hidden once this one has actually moved.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../motion/useReducedMotion'

const RING = { stiffness: 380, damping: 32, mass: 0.6 }
const INTERACTIVE = 'a, button, [role="button"], [role="radio"], summary, label, [data-cursor]'
const TEXT = 'input, textarea, select, [contenteditable="true"]'

type Mode = 'idle' | 'hover' | 'label' | 'text'

export function FluidCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()
  if (!fine || reduced) return null
  return <Cursor />
}

function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, RING)
  const ry = useSpring(y, RING)
  const [mode, setMode] = useState<Mode>('idle')
  const [label, setLabel] = useState('')
  const [shown, setShown] = useState(false)
  const [down, setDown] = useState(false)

  // Fluid stretch: the faster the ring travels, the more it elongates along its path.
  const vx = useVelocity(rx)
  const vy = useVelocity(ry)
  const speed = useTransform(() => Math.min(Math.hypot(vx.get(), vy.get()) / 2400, 0.45))
  const angle = useTransform(() => (Math.atan2(vy.get(), vx.get()) * 180) / Math.PI)
  const scaleX = useTransform(speed, (s) => 1 + s)
  const scaleY = useTransform(speed, (s) => 1 - s * 0.55)

  useEffect(() => {
    const root = document.documentElement
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      if (!root.classList.contains('has-fluid-cursor')) root.classList.add('has-fluid-cursor')
      setShown(true)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (!t || !(t instanceof Element)) return
      if (t.closest(TEXT)) {
        setMode('text')
        return
      }
      const hit = t.closest(INTERACTIVE)
      // only the element itself names a label: a button inside a "Drag" area stays a plain ring
      const named = hit?.getAttribute('data-cursor') ?? ''
      setLabel(named)
      setMode(named ? 'label' : hit ? 'hover' : 'idle')
    }
    const leave = () => setShown(false)
    const press = () => setDown(true)
    const release = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('blur', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('blur', leave)
      root.classList.remove('has-fluid-cursor')
    }
  }, [x, y])

  const size = mode === 'label' ? 76 : mode === 'hover' ? 46 : mode === 'text' ? 4 : 30
  return (
    <div className="fluid-cursor" aria-hidden data-shown={shown || undefined}>
      <motion.div className="fc-ring" style={{ x: rx, y: ry, rotate: angle }}>
        <motion.div
          className={`fc-ring-shape is-${mode}`}
          style={{ scaleX, scaleY }}
          animate={{ width: size, height: mode === 'text' ? 26 : size, scale: down ? 0.82 : 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        />
      </motion.div>
      <motion.div className="fc-label-pos" style={{ x: rx, y: ry }}>
        <AnimatePresence>
          {mode === 'label' && label && (
            <motion.span
              key={label}
              className="fc-label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div className={`fc-dot${mode !== 'idle' ? ' is-hidden' : ''}`} style={{ x, y }} />
    </div>
  )
}
