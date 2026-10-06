let cached: string | null = null

/**
 * Plaster texture for the entrance wall: faint blotches plus fine grain on white, multiplied over
 * --hall-wall so it works in both lighting modes. Generated once (256 px tile, a few KB as PNG).
 */
export function plasterTexture() {
  if (cached) return cached
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  if (!g) return ''

  g.fillStyle = '#fff'
  g.fillRect(0, 0, size, size)
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 20 + Math.random() * 60
    const gr = g.createRadialGradient(x, y, 0, x, y, r)
    gr.addColorStop(0, 'rgba(0,0,0,.012)')
    gr.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, size, size)
  }
  const d = g.getImageData(0, 0, size, size)
  for (let i = 0; i < d.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16
    d.data[i] += n
    d.data[i + 1] += n
    d.data[i + 2] += n
  }
  g.putImageData(d, 0, 0)

  cached = `url(${c.toDataURL('image/webp', 0.85)})`
  return cached
}
