import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingContact } from './FloatingContact'
import { ScrollToTop } from './ScrollToTop'

/**
 * Shared shell wrapping every route: header, footer and the floating WhatsApp
 * CTA stay mounted while the routed page renders into <Outlet/>.
 */
export function Layout() {
  return (
    <div className="min-h-screen bg-cream">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  )
}
