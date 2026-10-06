import { useState } from 'react'
import { motion } from 'motion/react'
import { WordCycle } from '../components/ui/WordCycle'
import { ROOMS, type RoomId } from '../data/site'
import { useActiveRoom } from '../hooks/useActiveRoom'
import { ThemeToggle } from '../theme/ThemeToggle'
import { MobileMenu } from './MobileMenu'

const ROOM_IDS = ROOMS.map((r) => r.id)
const BRAND_WORDS = ['Portfolio', 'Exhibition'] as const

/** Sticky 64px nav: wordmark, rooms with a sliding viridian underline, gallery lighting. */
export function Nav() {
  const active = useActiveRoom<RoomId>(ROOM_IDS)
  // Hover or keyboard focus holds the wordmark still (moving content needs a way to pause).
  const [holdBrand, setHoldBrand] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-[var(--nav-bg)] backdrop-blur-[14px]">
      <div className="mx-auto flex h-[var(--nav-h)] max-w-[1320px] items-center gap-4 px-[var(--gut)] min-[901px]:gap-6">
        <a
          href="#top"
          aria-label="RvL's Portfolio, back to the entrance"
          className="mr-auto whitespace-nowrap font-display text-[1.0625rem] tracking-[-0.035em] text-ink no-underline min-[480px]:text-xl"
          onPointerEnter={() => setHoldBrand(true)}
          onPointerLeave={() => setHoldBrand(false)}
          onFocus={() => setHoldBrand(true)}
          onBlur={() => setHoldBrand(false)}
        >
          <span className="font-extrabold">RvL&rsquo;s</span>{' '}
          <WordCycle words={BRAND_WORDS} paused={holdBrand} className="font-medium text-ink-2" />
        </a>

        <nav aria-label="Rooms" className="hidden min-[901px]:block">
          <ul className="flex gap-[26px]">
            {ROOMS.map((room) => {
              const on = active === room.id
              return (
                <li key={room.id}>
                  <a
                    href={`#${room.id}`}
                    aria-current={on ? 'location' : undefined}
                    className="group relative block py-2.5 text-[0.95rem] font-medium text-ink-2 no-underline transition-colors duration-[var(--dur-fast)] hover:text-ink aria-[current]:text-ink"
                  >
                    {room.label}
                    {/* Hover hint */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-1.5 h-0.5 origin-left scale-x-0 bg-accent/40 transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-x-100"
                    />
                    {/* Active room: one underline that glides between links */}
                    {on && (
                      <motion.span
                        layoutId="nav-underline"
                        aria-hidden
                        className="absolute inset-x-0 bottom-1.5 h-0.5 bg-accent"
                        transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <ThemeToggle />
        <MobileMenu active={active} />
      </div>
    </header>
  )
}
