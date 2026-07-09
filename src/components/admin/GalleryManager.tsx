import { useCallback, useEffect, useRef, useState } from 'react'
import { buildThumbUrl } from '../../lib/cloudinary'
import { deleteGalleryImage, fetchGallery, uploadImage } from '../../lib/adminApi'
import type { GalleryItem } from '../../lib/adminApi'
import { fileToDownscaledDataUrl } from '../../lib/imageResize'

type PushToast = (kind: 'ok' | 'err', msg: string) => void

/**
 * Gallery manager: the tag-based public gallery (`sandrine_gallery`), not a slot.
 * Lists the current photos, supports bulk upload, and per-photo removal. All
 * mutations go through the auth-guarded admin API.
 *
 * `/api/gallery` is edge-cached (~5 min), so instead of refetching after each
 * change we update local state optimistically — the admin sees the result at
 * once, and the public gallery catches up as the edge cache expires.
 */
export function GalleryManager({ pushToast }: { pushToast: PushToast }) {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setImages(await fetchGallery())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = '' // allow re-picking the same file(s) later
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      if (files.length > 0) pushToast('err', 'יש לבחור קובצי תמונה')
      return
    }

    setUploading(true)
    const added: GalleryItem[] = []
    let failed = 0
    for (const file of imageFiles) {
      try {
        const dataUrl = await fileToDownscaledDataUrl(file)
        const up = await uploadImage(dataUrl, 'gallery')
        if (!up) throw new Error('upload')
        added.push({ publicId: up.publicId, width: up.width, height: up.height })
      } catch {
        failed += 1
      }
    }
    // Prepend newest-first, matching the public gallery's ordering.
    if (added.length > 0) setImages((prev) => [...added, ...prev])
    setUploading(false)

    if (added.length > 0 && failed === 0) {
      pushToast('ok', added.length === 1 ? 'התמונה נוספה לגלריה' : `${added.length} תמונות נוספו לגלריה`)
    } else if (added.length > 0 && failed > 0) {
      pushToast('err', `${added.length} נוספו, ${failed} נכשלו`)
    } else {
      pushToast('err', 'ההעלאה נכשלה — נסו שוב (מומלץ JPG/PNG)')
    }
  }

  async function onRemove(publicId: string) {
    if (!window.confirm('להסיר את התמונה מהגלריה? הפעולה בלתי הפיכה.')) return
    const prev = images
    // Optimistic removal; restore on failure.
    setImages((imgs) => imgs.filter((i) => i.publicId !== publicId))
    setRemoving(publicId)
    const ok = await deleteGalleryImage(publicId)
    setRemoving(null)
    if (ok) {
      pushToast('ok', 'התמונה הוסרה מהגלריה')
    } else {
      setImages(prev)
      pushToast('err', 'ההסרה נכשלה — נסו שוב')
    }
  }

  return (
    <section className="mt-12 border-t border-stone pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-gold">ניהול הגלריה</h2>
          <p className="mt-1 text-sm text-muted">
            התמונות שמופיעות בעמוד הגלריה. ניתן להעלות כמה תמונות יחד.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-emerald px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-emerald-deep disabled:opacity-60"
        >
          {uploading ? 'מעלה…' : 'הוסף תמונות'}
        </button>
      </div>

      <div className="mt-5">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted">טוען…</p>
        ) : images.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone px-4 py-10 text-center text-sm text-muted">
            אין עדיין תמונות בגלריה. לחצו על «הוסף תמונות» כדי להעלות.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.publicId}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-stone bg-stone/40 shadow-soft"
              >
                <img
                  src={buildThumbUrl(img.publicId)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => onRemove(img.publicId)}
                  disabled={removing === img.publicId}
                  className="absolute left-2 top-2 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-red-700 shadow-card transition hover:bg-white disabled:opacity-60"
                >
                  {removing === img.publicId ? '…' : 'הסר'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFiles}
      />
    </section>
  )
}
