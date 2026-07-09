// Browser-only: downscale a chosen image before upload so the request stays
// small (well under Vercel's body limit) and consistent. Cloudinary re-encodes
// and optimises on delivery anyway, so a 2000px JPEG master is plenty.

export async function fileToDownscaledDataUrl(
  file: File,
  maxEdge = 2000,
  quality = 0.85,
): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('canvas_unavailable')
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  // JPEG keeps the upload payload small.
  return canvas.toDataURL('image/jpeg', quality)
}
