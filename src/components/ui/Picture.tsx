import type { ImgHTMLAttributes } from 'react'
import { IMAGES, type ImageKey } from '../../data/images'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  image: ImageKey
  /** Rendered width hint for the browser, e.g. "(max-width: 900px) 78vw, 380px" */
  sizes: string
  alt: string
  /** Above the fold: load eagerly with high priority */
  priority?: boolean
}

/** AVIF with WebP fallback at three widths, with intrinsic size so it never shifts layout. */
export function Picture({ image, sizes, alt, priority = false, ...img }: Props) {
  const src = IMAGES[image]
  return (
    <picture>
      <source type="image/avif" srcSet={src.avif} sizes={sizes} />
      <source type="image/webp" srcSet={src.webp} sizes={sizes} />
      <img
        src={src.src}
        width={src.width}
        height={src.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        {...img}
      />
    </picture>
  )
}
