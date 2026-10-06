import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

const BASE =
  'inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-pill border px-6 text-[0.98rem] font-semibold no-underline ' +
  'transition-[transform,background-color,color,filter] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-[0.97] ' +
  'motion-reduce:active:scale-100'

const VARIANTS: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-accent-ink hover:brightness-110',
  ghost: 'border-ink bg-transparent text-ink hover:bg-ink hover:text-wall',
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  children: ReactNode
}

/** Pill link-button (DESIGN.md section 4: pill for interactive controls only). */
export function ButtonLink({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <a className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
