// Behaviour follows 21st.dev "Modal" (ddoemonn): focus trap, scroll lock, Esc and backdrop
// dismissal, title and description slots, built on native <dialog> + showModal(). The card opens
// from its centre like 21st.dev "Center Morph Modal" (starc007), and the record is laid out in
// labelled sections that come in one after another, after "Project Detail View" (kavikatiyar).
// Restyled as a museum catalogue entry: the work on a lit wall plate with its plate number, the
// object record (role, medium, status), the links that exist for it, and a walk to the previous
// or next exhibit without closing the card.
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, XIcon } from '@phosphor-icons/react'
import { ButtonLink } from '../components/ui/Button'
import type { Project } from '../data/types'
import { useLenis } from '../motion/lenis-context'
import { useReducedMotion } from '../motion/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1] as const
const pad = (n: number) => String(n).padStart(2, '0')

interface Props {
  projects: Project[]
  /** Index of the project to show, or null when closed */
  index: number | null
  onClose: () => void
  /** Walk to the previous (-1) or next (1) exhibit */
  onStep: (dir: -1 | 1) => void
}

export function ExhibitDialog({ projects, index, onClose, onStep }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const lenis = useLenis()
  const reduced = useReducedMotion()
  // Keep the last project on screen while the exit animation plays.
  const [shown, setShown] = useState<number | null>(index)
  if (index !== null && index !== shown) setShown(index)
  const open = index !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return
    // The element that opened the dialog gets focus back once it has closed.
    opener.current = document.activeElement as HTMLElement | null
    if (!dialog.open) dialog.showModal()
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
      lenis?.start()
    }
  }, [open, lenis])

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowLeft') onStep(-1)
    else if (e.key === 'ArrowRight') onStep(1)
    else return
    e.preventDefault()
  }

  const n = projects.length
  const p = shown === null ? null : projects[shown]
  const prev = shown === null ? null : projects[(shown - 1 + n) % n]
  const next = shown === null ? null : projects[(shown + 1) % n]

  // Sections of the record rise in one after another.
  const list: Variants = {
    show: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: reduced ? 0 : 0.12 } },
  }
  const item: Variants = reduced
    ? { hidden: {}, show: {} }
    : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }

  return (
    <dialog
      ref={ref}
      aria-labelledby="ex-title"
      aria-describedby="ex-desc"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClose={() => open && onClose()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={onKeyDown}
      // Lenis is paused while the card is open and would swallow every swipe and wheel; this lets
      // the card itself scroll (phones, short screens).
      data-lenis-prevent
      className="exhibit"
    >
      <AnimatePresence
        onExitComplete={() => {
          ref.current?.close()
          opener.current?.focus({ preventScroll: true })
        }}
      >
        {open && p && shown !== null && (
          <motion.div
            key="card"
            className="ex-card"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, clipPath: 'inset(8% 6% 8% 6% round 10px)' }}
            animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <button type="button" className="ex-close" onClick={onClose}>
              <XIcon size={16} weight="bold" aria-hidden />
              <span className="sr-only">Close exhibit</span>
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={p.key}
                className="ex-entry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3 }}
              >
                <div className="ex-wall">
                  <span className="ex-spot" aria-hidden />
                  <motion.span
                    className="ex-piece"
                    initial={reduced ? false : { y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
                  >
                    <span className="ex-frame">
                      <img src={p.image} alt={p.imageAlt} width={500} height={500} />
                    </span>
                  </motion.span>
                  <span className="ex-plate">
                    <span>
                      Plate {pad(shown + 1)} of {pad(n)}
                    </span>
                    {p.links.site && (
                      <span className="ex-live">
                        <i aria-hidden /> Live
                      </span>
                    )}
                  </span>
                </div>

                <motion.div className="ex-body" variants={list} initial="hidden" animate="show">
                  <motion.p className="ex-kicker" variants={item}>
                    {p.type} <span aria-hidden>&middot;</span> {p.when}
                  </motion.p>
                  <motion.h3 id="ex-title" variants={item}>
                    {p.title}
                  </motion.h3>
                  <motion.p id="ex-desc" className="ex-desc" variants={item}>
                    {p.description}
                  </motion.p>

                  <motion.dl className="ex-record" variants={item}>
                    <div>
                      <dt>Role</dt>
                      <dd>{p.role}</dd>
                    </div>
                    <div>
                      <dt>Medium</dt>
                      <dd>
                        <ul className="ex-chips">
                          {p.tools.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </motion.dl>

                  <motion.div className="ex-actions" variants={item}>
                    {p.links.site && (
                      <ButtonLink href={p.links.site} target="_blank" rel="noopener noreferrer">
                        View site
                        <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ButtonLink>
                    )}
                    {p.links.code && (
                      <ButtonLink
                        variant={p.links.site ? 'ghost' : 'primary'}
                        href={p.links.code}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View source on {p.links.codeLabel}
                        <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ButtonLink>
                    )}
                    {p.links.demo && (
                      <ButtonLink variant="ghost" href={p.links.demo} target="_blank" rel="noopener noreferrer">
                        Watch demo
                        <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ButtonLink>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <nav className="ex-nav" aria-label="Other exhibits">
              <button type="button" onClick={() => onStep(-1)}>
                <ArrowLeftIcon size={16} weight="bold" aria-hidden />
                <span className="ex-nav-k">Previous</span>
                <span className="ex-nav-t">{prev?.title}</span>
              </button>
              <button type="button" onClick={() => onStep(1)}>
                <span className="ex-nav-k">Next</span>
                <span className="ex-nav-t">{next?.title}</span>
                <ArrowRightIcon size={16} weight="bold" aria-hidden />
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
