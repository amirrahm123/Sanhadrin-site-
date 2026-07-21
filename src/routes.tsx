import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './components/Layout'
import { GALLERY_CATEGORIES, galleryPath } from './data/galleryData'

/**
 * Route table. Each page is a `lazy()` chunk (per-route code splitting) whose
 * module exports `Component`. Slugs here are the single source of truth; the
 * sitemap generator derives paths from the built output.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/Layout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'weddings', lazy: () => import('./pages/Weddings') },
      { path: 'bar-bat-mitzvah', lazy: () => import('./pages/BarBatMitzvah') },
      { path: 'henna', lazy: () => import('./pages/Henna') },
      { path: 'halls', lazy: () => import('./pages/Halls') },
      { path: 'culinary', lazy: () => import('./pages/Culinary') },
      { path: 'gallery', lazy: () => import('./pages/Gallery') },
      // One dedicated page per gallery category. getStaticPaths enumerates the
      // slugs (from galleryData — the single source of truth) so the build
      // pre-renders /gallery/<slug> for each; the :slug route itself is dynamic
      // and filtered out of SSG output.
      {
        path: 'gallery/:slug',
        lazy: () => import('./pages/GalleryCategory'),
        getStaticPaths: () => GALLERY_CATEGORIES.map((c) => galleryPath(c.id)),
      },
      // Pre-rendered 404.html (Vercel serves it for unknown paths) + SPA fallback.
      { path: '404', lazy: () => import('./pages/NotFound') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
  // Standalone admin dashboard — deliberately OUTSIDE the public Layout (no
  // header/footer/contact chrome) and its own lazy chunk, so public routes
  // never load any admin code. noindex is set in the page's <Head>.
  { path: '/admin', lazy: () => import('./pages/Admin') },
]
