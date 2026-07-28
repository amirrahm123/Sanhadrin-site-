import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingContact } from './FloatingContact'
import { ScrollToTop } from './ScrollToTop'
import { StructuredData } from './StructuredData'
import { SlotsProvider } from '../lib/slots'
import { GalleryFoldersProvider } from '../lib/galleryFolders'

/**
 * Shared shell wrapping every route: header, footer and the floating WhatsApp
 * CTA stay mounted while the routed page renders into <Outlet/>. SlotsProvider
 * fetches admin-assigned photos (client-side) so any slotted ImagePlaceholder
 * swaps them in; GalleryFoldersProvider fetches each gallery category's live
 * Cloudinary folder once and shares it across routes. With neither, the site
 * renders exactly as designed (placeholders).
 */
export function Layout() {
  return (
    <SlotsProvider>
      <GalleryFoldersProvider>
        <div className="min-h-screen bg-cream">
          <StructuredData />
          <ScrollToTop />
          {/* Skip link — first thing in the tab order, so keyboard users can
              jump the logo + nav + social + CTA on every page (WCAG 2.4.1).
              Off-screen until focused, then pinned over the fixed header
              (z above its z-50). */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-emerald focus:px-6 focus:py-3 focus:text-base focus:font-medium focus:text-cream focus:shadow-card"
          >
            דילוג לתוכן הראשי
          </a>
          <Header />
          {/* tabIndex=-1 so the skip link and the route-change focus reset can
              move focus here; outline-none because it's a container, not a
              control — the visible focus stays on real interactive elements. */}
          <main id="main-content" tabIndex={-1} className="focus:outline-none">
            <Outlet />
          </main>
          <Footer />
          <FloatingContact />
        </div>
      </GalleryFoldersProvider>
    </SlotsProvider>
  )
}
