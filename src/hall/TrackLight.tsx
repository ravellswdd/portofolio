import { motion, type MotionValue } from 'motion/react'

/**
 * Ceiling track spotlight aimed at the portrait: stem, knuckle, angled can and a lens that
 * glows with the same intensity as the light it throws. Drawn in SVG so it keeps its
 * proportions at every size; colours come from the hall tokens.
 */
export function TrackLight({ glow }: { glow: MotionValue<number> | number }) {
  return (
    <svg viewBox="0 0 64 92" className="h-fix-svg" aria-hidden focusable="false">
      <defs>
        <linearGradient id="tl-can" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--steel-lo)' }} />
          <stop offset=".38" style={{ stopColor: 'var(--steel-hi)' }} />
          <stop offset=".62" style={{ stopColor: 'var(--steel)' }} />
          <stop offset="1" style={{ stopColor: 'var(--steel-lo)' }} />
        </linearGradient>
        <radialGradient id="tl-lens" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".55" stopColor="#ffe2a8" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* adapter in the track */}
      <rect x="22" y="0" width="20" height="7" rx="1.5" fill="var(--post)" />
      {/* stem */}
      <rect x="30" y="6" width="4" height="18" fill="url(#tl-can)" />
      {/* knuckle */}
      <circle cx="32" cy="27" r="5" fill="url(#tl-can)" stroke="var(--steel-lo)" strokeWidth=".6" />
      {/* can, tilted toward the wall */}
      <g transform="rotate(-14 32 27)">
        <rect x="20" y="30" width="24" height="44" rx="5" fill="url(#tl-can)" />
        <rect x="20" y="30" width="24" height="5" rx="2" fill="var(--steel-lo)" opacity=".55" />
        {/* cooling fins */}
        {[40, 45, 50].map((y) => (
          <rect key={y} x="20" y={y} width="24" height="1.2" fill="var(--steel-lo)" opacity=".5" />
        ))}
        {/* bezel + lens */}
        <ellipse cx="32" cy="74" rx="12" ry="3.4" fill="var(--steel-lo)" />
        <motion.ellipse cx="32" cy="74.4" rx="10" ry="2.6" fill="url(#tl-lens)" style={{ opacity: glow }} />
      </g>
    </svg>
  )
}
