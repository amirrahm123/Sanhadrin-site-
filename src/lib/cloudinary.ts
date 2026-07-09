// Client-side Cloudinary gallery integration.
//
// Listing is done by our own `/api/gallery` serverless function (Cloudinary
// Admin API, secret kept server-side) because this account has the keyless
// image/list delivery endpoint locked. The browser only ever sees trimmed
// metadata + public delivery URLs — no API key. The manager curates the gallery
// from Cloudinary's Media Library by tagging photos `sandrine_gallery`; because
// the list is fetched at runtime in the browser, changes appear without a
// rebuild. Delivery URLs (f_auto/q_auto/...) are still built here from the
// public cloudName, which is fine to expose.
import { useEffect, useState } from 'react'
import { SITE } from '../data/site'

// Must match the tile shapes ImagePlaceholder supports.
export type Ratio = '16/9' | '4/5' | '1/1' | '3/2' | '21/9'

// Hebrew alt text for every gallery photo (no per-image captions by design).
export const GALLERY_IMAGE_ALT = 'תמונה מגלריית אחוזת סנדרין'

// A single asset as returned by the list-by-tag JSON endpoint.
type CloudinaryResource = {
  public_id: string
  format: string
  width: number
  height: number
  created_at: string
}

export type GalleryImage = {
  publicId: string
  src: string
  srcSet: string
  ratio: Ratio
}

// Nearest standard tile shape for a photo's real pixel aspect ratio, so images
// slot into the existing masonry without being distorted (object-cover crops
// the small remainder).
const RATIO_VALUES: [Ratio, number][] = [
  ['4/5', 4 / 5],
  ['1/1', 1],
  ['3/2', 3 / 2],
  ['16/9', 16 / 9],
  ['21/9', 21 / 9],
]

export function ratioFromDimensions(width?: number, height?: number): Ratio {
  if (!width || !height) return '1/1'
  const aspect = width / height
  let best: Ratio = '1/1'
  let bestDelta = Infinity
  for (const [ratio, value] of RATIO_VALUES) {
    const delta = Math.abs(aspect - value)
    if (delta < bestDelta) {
      bestDelta = delta
      best = ratio
    }
  }
  return best
}

// f_auto (webp/avif) + q_auto (auto compression) + c_limit,w_* (cap width,
// never upscale) — auto optimise-on-delivery, matching the ~1200px intrinsic
// size the tiles already reserve.
function deliveryUrl(publicId: string, format: string, width: number): string {
  const { cloudName } = SITE.cloudinary
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}.${format}`
}

export type GalleryState =
  | { status: 'loading' }
  | { status: 'ready'; images: GalleryImage[] }
  | { status: 'empty' }
  | { status: 'error' }

/**
 * Fetches the gallery folder's images client-side, newest first.
 *
 * Runs only in the browser (useEffect) so the live Cloudinary folder is always
 * reflected without a redeploy. During SSG / first paint the `loading` state is
 * returned, which the gallery renders as the designed placeholder tiles — good
 * for SEO and never looks broken. On empty folder or any fetch/parse error it
 * resolves to `empty` / `error`, and callers keep showing the placeholders.
 */
export function useCloudinaryGallery(): GalleryState {
  const [state, setState] = useState<GalleryState>({ status: 'loading' })

  useEffect(() => {
    // Our serverless function lists the folder via the Admin API (secret stays
    // server-side) and returns trimmed, newest-first resources.
    const listUrl = '/api/gallery'
    let cancelled = false

    fetch(listUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { resources?: CloudinaryResource[] }) => {
        if (cancelled) return
        const resources = data.resources ?? []
        if (resources.length === 0) {
          setState({ status: 'empty' })
          return
        }
        const images = resources
          .slice()
          // Newest first.
          .sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0))
          .map(
            (r): GalleryImage => ({
              publicId: r.public_id,
              src: deliveryUrl(r.public_id, r.format, 1200),
              srcSet: `${deliveryUrl(r.public_id, r.format, 600)} 600w, ${deliveryUrl(
                r.public_id,
                r.format,
                1200,
              )} 1200w`,
              ratio: ratioFromDimensions(r.width, r.height),
            }),
          )
        setState({ status: 'ready', images })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
