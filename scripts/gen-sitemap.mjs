// Post-build: derive sitemap.xml + robots.txt from the pre-rendered pages'
// canonical URLs. Reading canonicals straight from dist means the sitemap can
// never drift from what was actually built, and it picks up SITE.url
// automatically (pages without a canonical, e.g. 404.html, are skipped).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const canonicalRe = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i

const urls = []
for (const file of readdirSync(DIST)) {
  if (!file.endsWith('.html')) continue
  const html = readFileSync(join(DIST, file), 'utf8')
  const m = html.match(canonicalRe)
  if (m) urls.push(m[1])
}

urls.sort((a, b) => a.length - b.length || a.localeCompare(b))

if (urls.length === 0) {
  console.warn('[gen-sitemap] no canonical URLs found in dist — skipping')
  process.exit(0)
}

const lastmod = new Date().toISOString().slice(0, 10)
const body = urls
  .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

const origin = new URL(urls[0]).origin
const robots = `# https://www.robotstxt.org/robotstxt.html\nUser-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
writeFileSync(join(DIST, 'robots.txt'), robots)

console.log(`[gen-sitemap] wrote sitemap.xml (${urls.length} urls) + robots.txt @ ${origin}`)
