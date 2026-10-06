// Coverflow arc follows 21st.dev "Coverflow Carousel" (educalvolpz): cards rotate and step back
// with distance from the centre, drag or swipe to move, arrow keys and buttons. Restyled as
// framed paintings on the gallery wall, matching the curator's portrait: walnut moulding with a
// fillet, a bevel-cut mat, glass, and a brass picture lamp over each frame. Only the centre lamp
// is on; the side paintings sit in its shadow. Clicking the centre painting opens it.
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent } from 'motion/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { FEATURED, PROJECTS } from '../data/projects'
import { useReducedMotion } from '../motion/useReducedMotion'
import { Placard } from './Placard'

const N = PROJECTS.length
const SLIDE = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const
/** Offset from the centre, wrapped into -N/2..N/2 so the ring loops. */
const wrapOff = (o: number) => {
  const m = ((o % N) + N) % N
  return m > N / 2 ? m - N : m
}

interface Props {
  onOpen: (index: number) => void
}

export function ArcCarousel({ onOpen }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  // Opens on the featured project, with the others fanned out either side.
  const [index, setIndex] = useState(FEATURED)
  // Continuous position (index while resting, fractional while dragging or sliding).
  const pos = useMotionValue(FEATURED)
  const [layoutPos, setLayoutPos] = useState(FEATURED)
  useMotionValueEvent(pos, 'change', setLayoutPos)
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null)
  const justDragged = useRef(false)

  const go = useCallback(
    (i: number) => {
      const target = ((i % N) + N) % N
      const next = pos.get() + wrapOff(target - pos.get())
      setIndex(target)
      if (reduced) pos.set(next)
      else animate(pos, next, SLIDE)
    },
    [pos, reduced],
  )

  const pw = () => parseFloat(getComputedStyle(stageRef.current!).getPropertyValue('--pw')) || 270

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, start: pos.get(), moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
      e.currentTarget.classList.add('is-drag')
    }
    if (d.moved) pos.set(d.start - dx / (pw() * 1.1))
  }
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    e.currentTarget.classList.remove('is-drag')
    if (!d?.moved) return
    justDragged.current = true
    requestAnimationFrame(() => (justDragged.current = false))
    go(Math.round(pos.get()))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') go(index - 1)
    else if (e.key === 'ArrowRight') go(index + 1)
    else return
    e.preventDefault()
  }

  // Keep the focused painting in step when the index changes from the keyboard.
  const paintings = useRef<(HTMLButtonElement | null)[]>([])
  const keyNav = useRef(false)
  useEffect(() => {
    if (keyNav.current) paintings.current[index]?.focus({ preventScroll: true })
    keyNav.current = false
  }, [index])

  const project = PROJECTS[index]

  return (
    <div className="carousel">
      <div
        ref={stageRef}
        className={`stage${reduced ? ' is-flat' : ''}`}
        data-cursor="Drag"
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(e) => {
          keyNav.current = true
          onKeyDown(e)
        }}
      >
        <div className="arc-ring">
          {PROJECTS.map((p, i) => {
            const o = wrapOff(i - layoutPos)
            const a = Math.abs(o)
            const s = Math.sign(o)
            return (
              <motion.button
                key={p.key}
                ref={(el) => {
                  paintings.current[i] = el
                }}
                type="button"
                className={`painting${a > 0.5 ? ' is-dim' : ' is-lit'}${a > 2.4 ? ' is-gone' : ''}`}
                style={{
                  // Distance from the centre drives the arc (see preview.html cLayout).
                  ['--o' as string]: o,
                  ['--a' as string]: Math.min(a, 1),
                  ['--a2' as string]: Math.min(a, 2.2),
                  ['--far' as string]: Math.max(a - 1, 0),
                  ['--s' as string]: s,
                  zIndex: 100 - Math.round(a * 10),
                }}
                tabIndex={i === index ? 0 : -1}
                data-cursor={i === index ? 'Open' : undefined}
                aria-hidden={a > 2.4 || undefined}
                aria-label={`${p.title}, ${p.role}. ${i === index ? 'Open exhibit' : 'Show this project'}`}
                onClick={() => {
                  if (justDragged.current) return
                  if (i === index) onOpen(i)
                  else go(i)
                }}
              >
                <span className="lamp" aria-hidden />
                <span className="frame">
                  <span className="mat">
                    <span className="bevel">
                      <img src={p.image} alt="" width={500} height={500} draggable={false} />
                    </span>
                  </span>
                  <span className="glass" aria-hidden />
                  <span className="wash" aria-hidden />
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="placard-row">
        <button type="button" className="ctrl" onClick={() => go(index - 1)}>
          <ArrowLeftIcon size={20} weight="bold" aria-hidden />
          <span className="sr-only">Previous project</span>
        </button>
        <div className="placard-wrap">
          <div className="placard">
            <Placard project={project} onEnter={() => onOpen(index)} />
          </div>
          <span className="count" aria-live="polite">
            <span className="sr-only">Project </span>
            {index + 1} of {N}
            <span className="sr-only">: {project.title}</span>
          </span>
        </div>
        <button type="button" className="ctrl" onClick={() => go(index + 1)}>
          <ArrowRightIcon size={20} weight="bold" aria-hidden />
          <span className="sr-only">Next project</span>
        </button>
      </div>
    </div>
  )
}
