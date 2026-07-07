import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './components/Layout'

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
      // /bar-mitzvah, /bat-mitzvah, /henna added in Phase 3.
      { path: 'halls', lazy: () => import('./pages/Halls') },
      { path: 'culinary', lazy: () => import('./pages/Culinary') },
      { path: 'gallery', lazy: () => import('./pages/Gallery') },
      { path: 'contact', lazy: () => import('./pages/Contact') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
