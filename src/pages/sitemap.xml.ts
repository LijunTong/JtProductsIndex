import type { APIRoute } from 'astro'
import { products } from '../data/products'
import { withBase } from '../lib/url'

const paths = ['/', ...products.map((product) => `/${product.slug}/`)]

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://lijuntong.github.io')
  const urls = paths
    .map((path) => {
      const loc = new URL(withBase(path), origin).href
      return `  <url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
