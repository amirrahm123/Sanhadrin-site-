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
      { path: 'bar-mitzvah', lazy: () => import('./pages/BarMitzvah') },
      { path: 'bat-mitzvah', lazy: () => import('./pages/BatMitzvah') },
      { path: 'henna', lazy: () => import('./pages/Henna') },
      { path: 'halls', lazy: () => import('./pages/Halls') },
      { path: 'culinary', lazy: () => import('./pages/Culinary') },
      { path: 'gallery', lazy: () => import('./pages/Gallery') },
      { path: 'contact', lazy: () => import('./pages/Contact') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
