import type { APIRoute } from 'astro'
import { withBase } from '../lib/url'

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://lijuntong.github.io')
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL(withBase('/sitemap.xml'), origin).href}
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
