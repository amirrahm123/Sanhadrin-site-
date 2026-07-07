import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Garden } from '../components/Garden'
import { Halls } from '../components/Halls'
import { Weddings } from '../components/Weddings'
import { Culinary } from '../components/Culinary'
import { Gallery } from '../components/Gallery'
import { ContactForm } from '../components/ContactForm'

export function Component() {
  return (
    <>
      <Hero />
      <About />
      <Garden />
      <Halls />
      <Weddings />
      <Culinary />
      <Gallery />
      <ContactForm />
    </>
  )
}
