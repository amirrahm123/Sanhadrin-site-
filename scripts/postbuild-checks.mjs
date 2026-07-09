// Post-build safety net over dist/. Fails the build (exit 1) if either:
//   1. a server secret (or its env-var name) leaked into the client bundle, or
//   2. the admin surface stopped being isolated from the public site
//      (indexable, in the sitemap, or no longer a separate lazy chunk).
// Runs after gen-sitemap so sitemap.xml + robots.txt exist.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const problems = []

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

// ── 1. No server secrets in the shipped client bundle ──────────────────────
// Env-var NAMES that must only ever exist server-side, plus the Cloudinary
// secret field name. If any appears in dist, something server-only got bundled.
const FORBIDDEN_MARKERS = [
  'CLOUDINARY_API_SECRET',
  'ADMIN_SESSION_SECRET',
  'ADMIN_PASSWORD',
  'ADMIN_USERNAME',
  'BLOB_READ_WRITE_TOKEN',
  'api_secret',
]

// The actual secret VALUES, when present in this build's environment — the real
// leak we most want to catch. Only check reasonably long values to avoid noise.
const SECRET_ENV_KEYS = [
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_API_KEY',
  'ADMIN_SESSION_SECRET',
  'ADMIN_PASSWORD',
  'BLOB_READ_WRITE_TOKEN',
]
const secretValues = SECRET_ENV_KEYS.map((k) => process.env[k]).filter(
  (v) => typeof v === 'string' && v.length >= 8,
)

const scanned = walk(DIST).filter((f) => /\.(js|mjs|css|html|json|txt|xml)$/.test(f))
for (const file of scanned) {
  const text = readFileSync(file, 'utf8')
  for (const marker of FORBIDDEN_MARKERS) {
    if (text.includes(marker)) problems.push(`secret marker "${marker}" leaked into ${file}`)
  }
  for (const value of secretValues) {
    if (text.includes(value)) problems.push(`a literal secret VALUE leaked into ${file}`)
  }
}

// ── 2. Admin surface stays isolated from the public site ───────────────────
const adminHtmlPath = join(DIST, 'admin.html')
if (!existsSync(adminHtmlPath)) {
  problems.push('dist/admin.html is missing')
} else {
  const adminHtml = readFileSync(adminHtmlPath, 'utf8')
  if (!/noindex/i.test(adminHtml)) problems.push('admin.html is missing a noindex robots directive')
}

// Admin code must be a separate lazy chunk, never inlined into public pages.
const assetsDir = join(DIST, 'assets')
if (!existsSync(assetsDir) || !readdirSync(assetsDir).some((f) => /^Admin-.*\.js$/.test(f))) {
  problems.push('expected a separate Admin-*.js chunk (admin no longer code-split)')
}

// Admin must never appear in the sitemap, and robots must disallow it.
const sitemapPath = join(DIST, 'sitemap.xml')
if (existsSync(sitemapPath) && /admin/i.test(readFileSync(sitemapPath, 'utf8'))) {
  problems.push('sitemap.xml references /admin')
}
const robotsPath = join(DIST, 'robots.txt')
if (existsSync(robotsPath) && !/Disallow:\s*\/admin/i.test(readFileSync(robotsPath, 'utf8'))) {
  problems.push('robots.txt no longer disallows /admin')
}

// ── Report ─────────────────────────────────────────────────────────────────
if (problems.length > 0) {
  console.error('[postbuild-checks] FAILED:')
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}
console.log(
  `[postbuild-checks] ok — no secret leaks in ${scanned.length} files; admin surface isolated (noindex, code-split, out of sitemap/robots)`,
)
