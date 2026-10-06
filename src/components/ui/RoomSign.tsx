import type { ReactNode } from 'react'

/**
 * Museum wayfinding sign: a boxed room number and the room's name. It is the room's heading
 * (an h2), so screen-reader users get the same route through the exhibition. Rooms with their
 * own big title pass as="p" and keep a single heading.
 */
export function RoomSign({
  sign,
  id,
  as: Tag = 'h2',
  children,
}: {
  sign: string
  id?: string
  as?: 'h2' | 'p'
  children: ReactNode
}) {
  return (
    <Tag id={id} className="mb-[18px] inline-flex items-center gap-2.5 font-mono text-[0.78rem] font-normal tracking-normal text-ink-2">
      <span
        aria-hidden
        className="grid size-7 place-items-center border-[1.5px] border-ink font-medium text-ink"
      >
        {sign}
      </span>
      <span>
        <span className="sr-only">Room {sign}: </span>
        {children}
      </span>
    </Tag>
  )
}
