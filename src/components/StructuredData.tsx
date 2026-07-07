import { Head } from 'vite-react-ssg'
import { SITE } from '../data/site'
import { CONTACT } from '../data/sections'

/**
 * Site-wide LocalBusiness / EventVenue JSON-LD (rendered on every page via the
 * Layout). NAP, hours and sameAs come from the CONTACT config; geo is emitted
 * only once real coordinates are filled into SITE.geo.
 */
export function StructuredData() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EventVenue'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    alternateName: SITE.nameLatin,
    url: SITE.url,
    telephone: CONTACT.phoneIntl,
    image: SITE.url + SITE.ogImage,
    priceRange: '₪₪₪',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.addressFull,
      addressLocality: CONTACT.addressLocality,
      postalCode: CONTACT.postalCode,
      addressRegion: CONTACT.addressRegion,
      addressCountry: 'IL',
    },
    areaServed: CONTACT.areaServed,
    sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.googleBusiness],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '10:00',
        closes: '21:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '09:30',
        closes: '13:00',
      },
    ],
  }

  // Only include geo once real coordinates are provided (never guessed).
  if (SITE.geo) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    }
  }

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  )
}
