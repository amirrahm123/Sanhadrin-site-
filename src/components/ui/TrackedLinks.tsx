import type { ReactNode } from 'react'
import { CONTACT } from '../../data/sections'
import { track } from '../../lib/track'

/** International tel: href, e.g. tel:+97246222221 */
export const TEL_HREF = `tel:${CONTACT.phoneIntl}`

/** wa.me link with the prefilled Hebrew message. */
export const WHATSAPP_HREF = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  CONTACT.whatsappMessage,
)}`

/**
 * Click-to-call link that pushes a `phone_click` event to the dataLayer.
 * `location` identifies where on the site it was clicked.
 */
export function PhoneLink({
  location,
  className,
  children,
}: {
  location: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={TEL_HREF}
      className={className}
      onClick={() => track('phone_click', { link_location: location })}
    >
      {children}
    </a>
  )
}

/**
 * WhatsApp link (new tab) that pushes a `whatsapp_click` event to the dataLayer.
 */
export function WhatsAppLink({
  location,
  className,
  ariaLabel,
  children,
}: {
  location: string
  className?: string
  ariaLabel?: string
  children: ReactNode
}) {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      onClick={() => track('whatsapp_click', { link_location: location })}
    >
      {children}
    </a>
  )
}
