import { Instagram, Facebook, Phone, MapPin } from 'lucide-react'
import { NAV_ITEMS, BRAND, CONTACT, FOOTER } from '../data/sections'

export function Footer() {
  return (
    <footer className="grain relative bg-emerald-deep text-cream">
      <div className="hairline opacity-60" />
      <div className="relative z-10 mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <a href="#home" className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold text-cream">{BRAND.he}</span>
              <span className="latin text-xs font-medium uppercase text-gold">{BRAND.latin}</span>
            </a>
            <p className="latin mt-1 text-lg italic text-gold-soft">{BRAND.tagline}</p>
            <div className="mt-3 flex items-center gap-3">
              <SocialLink href={CONTACT.instagram} label="Instagram">
                <Instagram size={18} />
              </SocialLink>
              <SocialLink href={CONTACT.facebook} label="Facebook">
                <Facebook size={18} />
              </SocialLink>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">ניווט</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-cream/75 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">צרו קשר</h4>
            <ul className="flex flex-col gap-3 text-sm text-cream/80">
              <li>
                <a href={`tel:${CONTACT.phoneIntl}`} className="flex items-center gap-2.5 hover:text-gold">
                  <Phone size={16} className="text-gold" />
                  <span dir="ltr">{CONTACT.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="text-gold" />
                {CONTACT.location}
              </li>
            </ul>
            <a
              href="#"
              className="mt-5 inline-block text-sm text-cream/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              {FOOTER.crossLink}
            </a>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-cream/10" />

        <div className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-start">
          <p className="text-xs text-cream/60">{FOOTER.seoLine}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-cream/50">
            <span>{FOOTER.disclaimer}</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="transition-colors hover:text-gold">
              {FOOTER.accessibility}
            </a>
            <span className="hidden md:inline">·</span>
            <span>© {BRAND.he}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/5 text-cream/80 transition-colors hover:bg-gold hover:text-emerald-deep"
    >
      {children}
    </a>
  )
}
