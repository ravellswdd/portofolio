// Based on 21st.dev "Segmented Control" by ddoemonn (accessible radio group, sliding thumb,
// arrow / Home / End keys). Restyled to DESIGN.md tokens; onValueChange also passes the
// button so callers can start effects from it (the theme reveal).
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

const THUMB_SPRING = { type: 'spring', stiffness: 520, damping: 34, mass: 0.45 } as const

const SEG = 'px-3.5 py-1.5 text-center text-[0.8125rem] font-medium leading-5 whitespace-nowrap'

export type SegmentedOption<T extends string = string> = {
  value: T
  label: string
  disabled?: boolean
}

export type SegmentedControlProps<T extends string = string> = {
  options: SegmentedOption<T>[]
  /** Accessible name of the group */
  label: string
  value?: T
  defaultValue?: T
  onValueChange?: (value: T, from: HTMLButtonElement | null) => void
  className?: string
}

export function SegmentedControl<T extends string = string>({
  options,
  label,
  value,
  defaultValue,
  onValueChange,
  className = '',
}: SegmentedControlProps<T>) {
  const count = Math.max(1, options.length)
  const template = `repeat(${count}, minmax(0, 1fr))`

  const [internal, setInternal] = useState<T | undefined>(() => defaultValue ?? options[0]?.value)
  const [hovered, setHovered] = useState(-1)

  const controlled = value !== undefined
  const current = controlled ? value : internal
  const found = options.findIndex((o) => o.value === current)
  const index = found < 0 ? 0 : found

  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const reduced = useReducedMotion()
  const pos = useMotionValue(index)
  const thumbX = useTransform(pos, (v) => `${v * 100}%`)
  const maskX = useTransform(pos, (v) => `${v * -100}%`)

  useEffect(() => {
    if (reduced) {
      pos.set(index)
      return
    }
    const controls = animate(pos, index, THUMB_SPRING)
    return () => controls.stop()
  }, [index, reduced, pos])

  const select = useCallback(
    (i: number) => {
      const next = options[i]
      if (!next || next.disabled) return
      if (!controlled) setInternal(next.value)
      if (next.value !== current) onValueChange?.(next.value, buttons.current[i] ?? null)
    },
    [controlled, current, onValueChange, options],
  )

  const seek = useCallback(
    (from: number, dir: number) => {
      let i = from
      for (let k = 0; k < count; k++) {
        i = (i + dir + count) % count
        if (!options[i]?.disabled) return i
      }
      return from
    },
    [count, options],
  )

  const go = (i: number) => {
    buttons.current[i]?.focus()
    select(i)
  }

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const keys: Record<string, () => number> = {
      ArrowRight: () => seek(i, 1),
      ArrowDown: () => seek(i, 1),
      ArrowLeft: () => seek(i, -1),
      ArrowUp: () => seek(i, -1),
      Home: () => seek(count - 1, 1),
      End: () => seek(0, -1),
    }
    const target = keys[e.key]
    if (!target) return
    e.preventDefault()
    go(target())
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`relative inline-block select-none rounded-pill border border-rule bg-wall p-[3px] ${className}`}
    >
      <div className="relative grid" style={{ gridTemplateColumns: template, touchAction: 'manipulation' }}>
        {/* Resting labels */}
        {options.map((option, i) => (
          <span
            key={option.value}
            aria-hidden
            className={`${SEG} pointer-events-none transition-colors duration-[var(--dur-fast)] ${
              option.disabled ? 'text-ink-2/50' : hovered === i && i !== index ? 'text-ink' : 'text-ink-2'
            }`}
          >
            {option.label}
          </span>
        ))}

        {/* Thumb: an ink pill that carries an inverted copy of the labels */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-pill bg-ink"
          style={{ width: `${100 / count}%`, x: thumbX }}
          initial={false}
        >
          <motion.div className="absolute inset-0" style={{ x: maskX }} initial={false}>
            <div
              className="absolute inset-y-0 left-0 grid"
              style={{ width: `${count * 100}%`, gridTemplateColumns: template }}
            >
              {options.map((option) => (
                <span key={option.value} className={`${SEG} text-wall`}>
                  {option.label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Hit targets: before:-inset-y-2.5 grows each one to 44px tall without changing the pill */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: template }} onPointerLeave={() => setHovered(-1)}>
          {options.map((option, i) => (
            <button
              key={option.value}
              ref={(node) => {
                buttons.current[i] = node
              }}
              type="button"
              role="radio"
              aria-checked={i === index}
              aria-disabled={option.disabled || undefined}
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onPointerEnter={() => !option.disabled && setHovered(i)}
              className="relative cursor-pointer rounded-pill before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-[''] focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed"
            >
              <span className="sr-only">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
