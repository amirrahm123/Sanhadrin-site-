import { useCallback, useEffect, useRef, useState } from 'react'
import { buildSlotPreviewUrl } from '../../lib/cloudinary'
import {
  deleteGalleryImage,
  fetchGalleryFolders,
  uploadCategoryImage,
} from '../../lib/adminApi'
import type { FolderPhoto, GalleryFolderMap } from '../../lib/adminApi'
import { fileToDownscaledDataUrl, ImageTooLargeError } from '../../lib/imageResize'
import { GALLERY_CATEGORIES, type GalleryCategory } from '../../data/galleryData'
import { slotGuidance } from '../../data/photoSlots'

type PushToast = (kind: 'ok' | 'err', msg: string) => void

/**
 * Per-category gallery manager: one section per named category (gallery/<id>
 * Cloudinary folder), each listing its live photos with direct multi-upload and
 * per-photo removal. This is SEPARATE from the flat homepage-strip pool
 * (GalleryManager, tag `sandrine_gallery`) — category photos live in folders and
 * carry no gallery tag, so the two never mix.
 *
 * `/api/gallery-folders` is edge-cached (~30s), so after each change we update
 * local state optimistically — the admin sees the result at once and the public
 * grids catch up as the cache expires.
 */
export function GalleryCategoriesManager({ pushToast }: { pushToast: PushToast }) {
  const [folders, setFolders] = useState<GalleryFolderMap>({})
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setFolders(await fetchGalleryFolders())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Optimistic mutations on the local map: prepend newest-first after an upload,
  // filter after a removal — matching the public grid's ordering.
  const onUploaded = useCallback((categoryId: string, added: FolderPhoto[]) => {
    setFolders((prev) => ({ ...prev, [categoryId]: [...added, ...(prev[categoryId] ?? [])] }))
  }, [])

  const onRemoved = useCallback((categoryId: string, publicId: string) => {
    setFolders((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? []).filter((p) => p.publicId !== publicId),
    }))
  }, [])

  return (
    <section className="mt-12 border-t border-stone pt-8">
      <div>
        <h2 className="font-serif text-xl text-gold">גלריות לפי קטגוריה</h2>
        <p className="mt-1 text-sm text-muted">
          כל קטגוריה בעמוד הגלריה מנהלת את התמונות שלה כאן. ניתן להעלות כמה תמונות יחד ולהסיר תמונות —
          השינויים מופיעים באתר תוך רגע.
        </p>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">טוען…</p>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {GALLERY_CATEGORIES.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              photos={folders[category.id] ?? []}
              onUploaded={onUploaded}
              onRemoved={onRemoved}
              pushToast={pushToast}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function CategorySection({
  category,
  photos,
  onUploaded,
  onRemoved,
  pushToast,
}: {
  category: GalleryCategory
  photos: FolderPhoto[]
  onUploaded: (categoryId: string, added: FolderPhoto[]) => void
  onRemoved: (categoryId: string, publicId: string) => void
  pushToast: PushToast
}) {
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const guidance = slotGuidance(category.ratio)

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = '' // allow re-picking the same file(s) later
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      if (files.length > 0) pushToast('err', 'יש לבחור קובצי תמונה')
      return
    }

    setUploading(true)
    const added: FolderPhoto[] = []
    let failed = 0
    let tooLarge = 0
    for (const file of imageFiles) {
      try {
        const dataUrl = await fileToDownscaledDataUrl(file)
        const up = await uploadCategoryImage(dataUrl, category.id)
        if (!up) throw new Error('upload')
        added.push({ publicId: up.publicId, width: up.width, height: up.height })
      } catch (err) {
        failed += 1
        if (err instanceof ImageTooLargeError) tooLarge += 1
      }
    }
    if (added.length > 0) onUploaded(category.id, added)
    setUploading(false)

    if (added.length > 0 && failed === 0) {
      pushToast('ok', added.length === 1 ? 'התמונה נוספה' : `${added.length} תמונות נוספו`)
    } else if (added.length > 0 && failed > 0) {
      pushToast('err', `${added.length} נוספו, ${failed} נכשלו`)
    } else if (tooLarge > 0 && tooLarge === failed) {
      pushToast('err', 'התמונה גדולה מדי — נסו תמונה קטנה יותר')
    } else {
      pushToast('err', 'ההעלאה נכשלה — נסו שוב (מומלץ JPG/PNG)')
    }
  }

  async function onRemove(publicId: string) {
    if (!window.confirm('להסיר את התמונה מהקטגוריה? הפעולה בלתי הפיכה.')) return
    setRemoving(publicId)
    // deleteGalleryImage destroys the asset by public_id (works for any folder).
    const ok = await deleteGalleryImage(publicId)
    setRemoving(null)
    if (ok) {
      onRemoved(category.id, publicId)
      pushToast('ok', 'התמונה הוסרה')
    } else {
      pushToast('err', 'ההסרה נכשלה — נסו שוב')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg text-emerald">{category.title}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {guidance.title} · {guidance.ratioLabel}
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

      <div className="mt-4">
        {photos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone px-4 py-8 text-center text-sm text-muted">
            אין עדיין תמונות בקטגוריה. לחצו על «הוסף תמונות» כדי להעלות.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((img) => (
              <div
                key={img.publicId}
                className="group relative overflow-hidden rounded-2xl border border-stone bg-stone/40 shadow-soft"
                style={{ aspectRatio: category.ratio }}
              >
                {/* Rendered at the category's real ratio with object-cover, so this
                    thumbnail previews the live grid crop exactly. */}
                <img
                  src={buildSlotPreviewUrl(img.publicId, 480)}
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
    </div>
  )
}
