import { useMemo, type CSSProperties } from 'react'

/**
 * A few specks drifting slowly through the spotlight cone. CSS keyframes (transform and
 * opacity only); paused while the hall is off screen via the parent's data-inview.
 * Not rendered at all with reduced motion.
 */
export function DustMotes({ count = 16 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${12 + Math.random() * 76}%`,
        top: `${10 + Math.random() * 80}%`,
        size: `${1 + Math.random() * 1.8}px`,
        dx: `${(Math.random() - 0.5) * 60}px`,
        dy: `${-20 - Math.random() * 50}px`,
        dur: `${10 + Math.random() * 10}s`,
        delay: `${-Math.random() * 20}s`,
      })),
    [count],
  )

  return (
    <div className="h-dust" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              '--dx': m.dx,
              '--dy': m.dy,
              '--dur': m.dur,
              '--delay': m.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
