import { motion, type MotionValue } from 'motion/react'

/*
 * Stanchions in two drawings that share one geometry (SVG user units, 640 wide):
 *  - <Stanchions>        the posts and rope, standing upright; ground line at y = 300.
 *  - <StanchionShadows>  their shadows in plan view, laid on the floor plane; y = distance
 *                        toward the viewer from the foot line, x as in the upright drawing.
 *
 * The shadows come from the one light the visitor can see: the track spotlight above the
 * portrait. Seen from the rope it is high overhead, a little behind (on the wall side) and a
 * little right of the rope's centre (the rope is centred on the portrait in projection, not in
 * the room). Proportions are a real gallery's: ceiling ~4.5x the stanchion height, track slightly
 * behind the rope. For a point h units tall at x, the shadow lands at
 *     x + (x - LIGHT.x) * h / (LIGHT.up - h),    LIGHT.back * h / (LIGHT.up - h) toward the viewer
 * so the posts' shadows fan outward and slightly forward from their feet, and the rope's shadow
 * is a shallow curve whose ends meet the post shadows at ring height. The floor plane's
 * perspective then foreshortens all of it like a real shadow.
 */

const POSTS = [46, 594] as const
const ROPE = 'M60 90 C 210 216, 430 216, 580 90'
const RING_X = [60, 580] as const // where the rope hooks on
const HOOK_H = 210 // rope ends hang from the receiver rings
const SAG_H = 115.5 // lowest point of the rope (x ~ 320)
const POST_TOP_H = 255 // top of the ball finial

const LIGHT = { x: 410, back: 150, up: 1150 }

/** Where a point at (x, height h) lands on the floor. */
function onFloor(x: number, h: number) {
  const k = h / (LIGHT.up - h)
  return { x: x + (x - LIGHT.x) * k, y: LIGHT.back * k }
}

/** A strip from the foot to the shadow of the top, widening a little (penumbra). */
function postShadow(x: number) {
  const tip = onFloor(x, POST_TOP_H)
  const ring = onFloor(x, HOOK_H - 5)
  const len = Math.hypot(tip.x - x, tip.y)
  const ux = (tip.x - x) / len
  const uy = tip.y / len
  const nx = -uy
  const ny = ux
  const w0 = 6
  const w1 = 8.5
  const pts = [
    [x + nx * w0, ny * w0],
    [tip.x + nx * w1, tip.y + ny * w1],
    [tip.x - nx * w1, tip.y - ny * w1],
    [x - nx * w0, -ny * w0],
  ]
  const angle = (Math.atan2(uy, ux) * 180) / Math.PI
  return { d: `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')} Z`, tip, ring, angle }
}

const ropeShadow = (() => {
  const a = onFloor(RING_X[0], HOOK_H)
  const b = onFloor(RING_X[1], HOOK_H)
  const m = onFloor(320, SAG_H)
  // quadratic through a, m, b (control chosen so the curve passes m at t = 0.5)
  const cx = 2 * m.x - (a.x + b.x) / 2
  const cy = 2 * m.y - (a.y + b.y) / 2
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
})()

/** Upright posts and rope. `shine` slides the chrome highlights as the viewpoint moves. */
export function Stanchions({ shine }: { shine?: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMax meet" className="h-rope-svg" aria-hidden focusable="false">
      <defs>
        {/* polished chrome tube: dark edges, a hard specular band, a soft environment reflection */}
        <linearGradient id="st-tube" x1="0" x2="1">
          <stop offset="0" style={{ stopColor: 'var(--steel-lo)' }} />
          <stop offset=".16" style={{ stopColor: 'var(--steel)' }} />
          <stop offset=".3" style={{ stopColor: 'var(--steel-hi)' }} />
          <stop offset=".4" style={{ stopColor: 'var(--steel)' }} />
          <stop offset=".68" style={{ stopColor: 'var(--steel-lo)' }} />
          <stop offset=".82" style={{ stopColor: 'var(--steel)' }} />
          <stop offset="1" style={{ stopColor: 'var(--steel-lo)' }} />
        </linearGradient>
        <radialGradient id="st-ball" cx=".36" cy=".32" r=".72">
          <stop offset="0" style={{ stopColor: 'var(--steel-hi)' }} />
          <stop offset=".35" style={{ stopColor: 'var(--steel)' }} />
          <stop offset=".85" style={{ stopColor: 'var(--steel-lo)' }} />
          <stop offset="1" style={{ stopColor: 'var(--steel)' }} />
        </radialGradient>
        {/* weighted base: lit dome top, bright rim, dark underside */}
        <radialGradient id="st-base-top" cx=".42" cy=".3" r=".75">
          <stop offset="0" style={{ stopColor: 'var(--steel-hi)' }} />
          <stop offset=".55" style={{ stopColor: 'var(--steel)' }} />
          <stop offset="1" style={{ stopColor: 'var(--steel-lo)' }} />
        </radialGradient>
        <linearGradient id="st-base-side" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--steel-hi)' }} />
          <stop offset=".5" style={{ stopColor: 'var(--steel)' }} />
          <stop offset="1" style={{ stopColor: 'var(--steel-lo)' }} />
        </linearGradient>
      </defs>

      {POSTS.map((x) => (
        <g key={x} className="st-post">
          {/* base */}
          <ellipse cx={x} cy="292" rx="38" ry="8" fill="var(--steel-lo)" />
          <rect x={x - 38} y="285" width="76" height="7" fill="url(#st-base-side)" />
          <ellipse cx={x} cy="285" rx="38" ry="8" fill="url(#st-base-top)" />
          <ellipse cx={x} cy="284.2" rx="37" ry="7.4" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth=".8" />
          <ellipse cx={x} cy="283" rx="20" ry="4.6" fill="url(#st-base-top)" />
          {/* collar where the tube meets the base */}
          <rect x={x - 8} y="275" width="16" height="8" rx="1.5" fill="url(#st-tube)" />
          <ellipse cx={x} cy="275" rx="8" ry="1.8" fill="var(--steel-hi)" opacity=".7" />

          {/* tube */}
          <rect x={x - 6} y="70" width="12" height="206" fill="url(#st-tube)" />
          {/* hard specular line + warm reflection of the spotlight; both slide with the view */}
          <motion.rect x={x - 3.2} y="72" width="1.6" height="202" fill="#fff" opacity=".7" style={{ x: shine }} />
          <motion.rect x={x + 2.4} y="72" width="1.2" height="202" fill="#ffd9a0" opacity=".3" style={{ x: shine }} />

          {/* rope receiver ring */}
          <rect x={x - 9.5} y="82" width="19" height="11" rx="3" fill="url(#st-tube)" />
          <rect x={x - 9.5} y="87" width="19" height="1" fill="var(--steel-lo)" opacity=".7" />
          {/* neck + ball finial */}
          <rect x={x - 4} y="64" width="8" height="8" fill="url(#st-tube)" />
          <rect x={x - 7} y="66" width="14" height="4" rx="1.5" fill="url(#st-tube)" />
          <circle cx={x} cy="55" r="11" fill="url(#st-ball)" />
          <ellipse cx={x - 4} cy="50" rx="3" ry="2.2" fill="#fff" opacity=".75" />
        </g>
      ))}

      {/* velvet rope: dark body, lit upper core, soft sheen (reads as a round, matte cord) */}
      <path d={ROPE} fill="none" stroke="var(--velvet)" strokeWidth="15" strokeLinecap="round" />
      <path d={ROPE} fill="none" stroke="#000" strokeOpacity=".32" strokeWidth="15" strokeLinecap="round" />
      <path d={ROPE} transform="translate(0 -2)" fill="none" stroke="var(--velvet)" strokeWidth="9" strokeLinecap="round" />
      <path d={ROPE} transform="translate(0 -4)" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="2.5" strokeLinecap="round" />

      {/* chrome end caps with snap hooks into the receiver rings */}
      {[
        { x: 60, dir: -1 },
        { x: 580, dir: 1 },
      ].map(({ x, dir }) => (
        <g key={x}>
          <rect x={x - 8 + dir * -2} y="83" width="16" height="15" rx="4" fill="url(#st-tube)" />
          <path
            d={`M${x + dir * 6} 86 q ${dir * 5} -3 ${dir * 8} 1`}
            fill="none"
            stroke="var(--steel)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  )
}

/** The stanchions' shadows in plan view, for the floor plane (see the geometry note above). */
export function StanchionShadows() {
  const posts = POSTS.map(postShadow)
  return (
    <svg viewBox="0 -60 640 360" className="h-rope-shadow" aria-hidden focusable="false">
      <defs>
        <radialGradient id="sh-ao">
          <stop offset="0" stopColor="#000" stopOpacity="1" />
          <stop offset=".5" stopColor="#000" stopOpacity=".6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {/* each post shadow: darkest at the foot, lighter toward the tip */}
        {posts.map((p, i) => (
          <linearGradient
            key={i}
            id={`sh-post-${i}`}
            gradientUnits="userSpaceOnUse"
            x1={POSTS[i]}
            y1="0"
            x2={p.tip.x}
            y2={p.tip.y}
          >
            <stop offset="0" stopColor="#000" stopOpacity="1" />
            <stop offset="1" stopColor="#000" stopOpacity=".45" />
          </linearGradient>
        ))}
        {/* the rope is lowest in the middle: its shadow is darkest and sharpest there */}
        <linearGradient id="sh-rope" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="640" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity=".5" />
          <stop offset=".5" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#000" stopOpacity=".5" />
        </linearGradient>
        {/* blur regions in user space, large enough that nothing clips to a box */}
        <filter id="sh-near" filterUnits="userSpaceOnUse" x="-300" y="-100" width="1240" height="460">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="sh-far" filterUnits="userSpaceOnUse" x="-300" y="-100" width="1240" height="460">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>

      {/* cast by the spotlight */}
      <g className="sh-cast">
        <path d={ropeShadow} fill="none" stroke="url(#sh-rope)" strokeWidth="11" strokeLinecap="round" filter="url(#sh-far)" />
        {posts.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill={`url(#sh-post-${i})`} filter="url(#sh-near)" />
            {/* ring and ball finial throw slightly wider blobs along the same line */}
            <ellipse
              cx={p.ring.x}
              cy={p.ring.y}
              rx="11"
              ry="8"
              fill="#000"
              opacity=".55"
              transform={`rotate(${p.angle.toFixed(1)} ${p.ring.x.toFixed(1)} ${p.ring.y.toFixed(1)})`}
              filter="url(#sh-far)"
            />
            <ellipse
              cx={p.tip.x}
              cy={p.tip.y}
              rx="14"
              ry="11"
              fill="#000"
              opacity=".5"
              transform={`rotate(${p.angle.toFixed(1)} ${p.tip.x.toFixed(1)} ${p.tip.y.toFixed(1)})`}
              filter="url(#sh-far)"
            />
          </g>
        ))}
      </g>

      {/* contact shadow: the weighted base pressing on the floor, centred under it */}
      <g className="sh-ao">
        {POSTS.map((x) => (
          <g key={x}>
            <circle cx={x} cy="0" r="56" fill="url(#sh-ao)" opacity=".4" />
            <circle cx={x} cy="0" r="41" fill="url(#sh-ao)" />
          </g>
        ))}
      </g>
    </svg>
  )
}
