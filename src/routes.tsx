import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './components/Layout'

/**
 * Route table. Each page is a `lazy()` chunk (per-route code splitting) whose
 * module exports `Component`. Slugs here are the single source of truth — the
 * sitemap generator and the nav both derive from this list.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/Layout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home') },
    ],
  },
]
