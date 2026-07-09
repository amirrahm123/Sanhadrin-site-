// Browser-only: downscale a chosen image before upload so the request stays
// small (well under Vercel's serverless body limit) and consistent. Cloudinary
// re-encodes and optimises on delivery anyway, so a downscaled JPEG master is
// plenty.

// The whole JSON body must clear Vercel's ~4.5 MB serverless request cap, and
// the base64 data-URI string dominates it. Keep the encoded string under this
// so the server's own cap (MAX_DATAURL_LEN in api/admin/upload.ts) is never the
// thing that rejects a normal photo.
export const MAX_DATAURL_LEN = 3_500_000

// Thrown when even the most aggressive downscale can't get under the budget
// (e.g. a truly enormous source). Callers surface a "too large" message.
export class ImageTooLargeError extends Error {
  constructor() {
    super('image_too_large')
    this.name = 'ImageTooLargeError'
  }
}

function encodeJpeg(bitmap: ImageBitmap, maxEdge: number, quality: number): string {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas_unavailable')
  ctx.drawImage(bitmap, 0, 0, w, h)
  // JPEG keeps the upload payload small.
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * Downscale + re-encode `file` to a JPEG data-URL guaranteed to be under
 * MAX_DATAURL_LEN. Tries decreasing quality first (cheap, preserves size), then
 * smaller dimensions, and only throws ImageTooLargeError if nothing fits.
 */
export async function fileToDownscaledDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    for (const maxEdge of [2000, 1600, 1200, 900]) {
      for (const quality of [0.85, 0.72, 0.6]) {
        const dataUrl = encodeJpeg(bitmap, maxEdge, quality)
        if (dataUrl.length <= MAX_DATAURL_LEN) return dataUrl
      }
    }
    throw new ImageTooLargeError()
  } finally {
    bitmap.close()
  }
}
