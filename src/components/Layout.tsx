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
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
          <FloatingContact />
        </div>
      </GalleryFoldersProvider>
    </SlotsProvider>
  )
}
