import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { ROOMS, SITE, type RoomId } from '../data/site'
import { useLenis } from '../motion/lenis-context'
import { scrollToHash } from '../motion/scrollToHash'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Below 900px the rooms move into a sheet. Native <dialog> + showModal() gives the focus trap,
 * Esc, inert page and focus return for free; Motion only animates it in and out.
 */
export function MobileMenu({ active }: { active: RoomId | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pendingHash = useRef<string | null>(null)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const titleId = useId()

  // Open: show the modal and freeze page scroll. Closing waits for the exit animation (below).
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    dialog.showModal()
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
      lenis?.start()
    }
  }, [open, lenis])

  const finishClose = () => {
    dialogRef.current?.close()
    const hash = pendingHash.current
    pendingHash.current = null
    if (hash) requestAnimationFrame(() => scrollToHash(hash, lenis))
  }

  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    e.stopPropagation()
    pendingHash.current = hash
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-pill border border-rule bg-wall text-[0.875rem] font-medium text-ink transition-[transform,background-color] duration-[var(--dur-fast)] hover:bg-plinth active:scale-[0.97] min-[480px]:h-10 min-[480px]:w-auto min-[480px]:px-4 min-[480px]:before:absolute min-[480px]:before:-inset-y-1 min-[480px]:before:inset-x-0 min-[480px]:before:content-[''] min-[901px]:hidden"
      >
        <ListIcon size={18} weight="bold" aria-hidden />
        {/* Icon only on small phones so the wordmark fits; the name stays for screen readers. */}
        <span className="max-[479px]:sr-only">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(e) => {
          // Esc: run the exit animation instead of vanishing.
          e.preventDefault()
          setOpen(false)
        }}
        // Some browsers close on a second Esc regardless of preventDefault; keep state in sync.
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Click on the backdrop (the dialog box itself, outside the panel).
          if (e.target === e.currentTarget) setOpen(false)
        }}
        className="m-0 ml-auto h-dvh max-h-none w-[min(88vw,380px)] max-w-none overflow-visible bg-transparent p-0 text-ink backdrop:bg-transparent"
      >
        <AnimatePresence onExitComplete={finishClose}>
          {open && (
            <>
              <motion.div
                key="scrim"
                aria-hidden
                className="fixed inset-0 -z-10 bg-[#0e1110]/45"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                key="panel"
                className="flex h-full flex-col border-l border-rule bg-plinth px-6 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.42, ease: EASE }}
              >
                <div className="flex h-12 items-center justify-between">
                  <p id={titleId} className="font-mono text-placard uppercase tracking-[0.06em] text-ink-2">
                    Rooms
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex size-11 items-center justify-center rounded-pill border border-rule text-ink transition-colors duration-[var(--dur-fast)] hover:bg-wall"
                  >
                    <XIcon size={18} weight="bold" aria-hidden />
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>

                <nav aria-label="Rooms" className="mt-8">
                  <ul className="space-y-1">
                    {ROOMS.map((room, i) => {
                      const on = active === room.id
                      return (
                        <motion.li
                          key={room.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.38, delay: 0.12 + i * 0.05, ease: EASE }}
                        >
                          <a
                            href={`#${room.id}`}
                            aria-current={on ? 'location' : undefined}
                            onClick={(e) => go(e, `#${room.id}`)}
                            className="flex min-h-14 items-center gap-4 border-b border-rule py-3 text-ink no-underline"
                          >
                            <span
                              aria-hidden
                              className={`grid size-7 shrink-0 place-items-center border-[1.5px] font-mono text-[0.78rem] font-medium ${
                                on ? 'border-accent bg-accent text-accent-ink' : 'border-ink'
                              }`}
                            >
                              {room.sign}
                            </span>
                            <span className="font-display text-h3 font-bold tracking-[-0.03em]">{room.label}</span>
                          </a>
                        </motion.li>
                      )
                    })}
                  </ul>
                </nav>

                <motion.a
                  href={SITE.cv}
                  target="_blank"
                  rel="noopener"
                  className="mt-auto inline-flex h-12 items-center justify-center rounded-pill border border-ink font-semibold text-ink no-underline transition-colors duration-[var(--dur-fast)] hover:bg-ink hover:text-wall"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  Download CV
                  <span className="sr-only"> (opens in a new tab)</span>
                </motion.a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </dialog>
    </>
  )
}
