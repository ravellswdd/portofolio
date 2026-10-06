import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE } from './src/data/site'

/**
 * The public address of the site, for the canonical link, og:url and absolute image URLs (social
 * cards need them). Set SITE_URL to a custom domain; on Vercel the production domain is used
 * automatically. Without either, those tags are left out and the image URL stays relative.
 */
function siteUrl() {
  // Node's process, read through globalThis so the config needs no @types/node.
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {}
  const raw = env.SITE_URL ?? (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  return raw.replace(/\/+$/, '')
}

/** SEO tags that depend on the site's address, plus the Person structured data. */
function seo(): Plugin {
  return {
    name: 'rvl-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const url = siteUrl()
        const person = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE.name,
          ...(url ? { url: `${url}/` } : {}),
          jobTitle: 'Developer',
          affiliation: { '@type': 'CollegeOrUniversity', name: 'BINUS University' },
          knowsAbout: ['Python', 'LLM APIs', 'Machine learning', 'React', 'TypeScript'],
          sameAs: [SITE.linkedin, SITE.github, SITE.instagram],
        }
        const tags = [
          ...(url ? [`<link rel="canonical" href="${url}/" />`, `<meta property="og:url" content="${url}/" />`] : []),
          `<script type="application/ld+json">${JSON.stringify(person)}</script>`,
        ]
        return html.replaceAll('%SITE_URL%', url).replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
})
