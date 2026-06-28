import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Garden } from './components/Garden'
import { Halls } from './components/Halls'
import { Weddings } from './components/Weddings'
import { Culinary } from './components/Culinary'
import { Gallery } from './components/Gallery'
import { ContactForm } from './components/ContactForm'
import { Footer } from './components/Footer'
import { FloatingContact } from './components/FloatingContact'

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Hero />
        <About />
        <Garden />
        <Halls />
        <Weddings />
        <Culinary />
        <Gallery />
        <ContactForm />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  )
}
