import { useCallback, useEffect, useRef, useState } from 'react'
import { PHOTO_SLOTS, SLOT_GROUPS } from '../../data/photoSlots'
import type { PhotoSlot, SlotMap, SlotOverride } from '../../data/photoSlots'
import { buildThumbUrl } from '../../lib/cloudinary'
import { fetchSlots, logout, removeSlot, setSlot, uploadImage } from '../../lib/adminApi'
import { fileToDownscaledDataUrl, ImageTooLargeError } from '../../lib/imageResize'
import { GalleryManager } from './GalleryManager'

type ToastKind = 'ok' | 'err'
type Toast = { id: number; kind: ToastKind; msg: string }
type PushToast = (kind: ToastKind, msg: string) => void

/**
 * The photo-management dashboard: every managed slot grouped by page, each with
 * a live thumbnail and upload / replace / remove. All mutations go through the
 * auth-guarded admin API; on success the slot map is refetched so the thumbnail
 * reflects reality.
 */
export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [slots, setSlots] = useState<SlotMap>({})
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  const refresh = useCallback(async () => {
    setSlots(await fetchSlots())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const pushToast: PushToast = useCallback((kind, msg) => {
    const id = (toastId.current += 1)
    setToasts((t) => [...t, { id, kind, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  async function onLogoutClick() {
    await logout()
    onLogout()
  }

  return (
    <div className="mx-auto max-w-content px-5 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4 border-b border-stone pb-5">
        <div>
          <h1 className="font-serif text-2xl text-emerald md:text-3xl">ניהול תמונות האתר</h1>
          <p className="mt-1 text-sm text-muted">אחוזת סנדרין</p>
        </div>
        <button
          type="button"
          onClick={onLogoutClick}
          className="rounded-full border border-stone px-5 py-2 text-sm font-semibold text-emerald transition-colors hover:bg-stone/50"
        >
          יציאה
        </button>
      </header>

      <p className="mt-5 rounded-2xl bg-emerald/5 px-4 py-3 text-sm text-emerald">
        השינויים מופיעים באתר תוך רגע (ייתכן שיהיה צורך לרענן את הדף). תמונה שתוסר תחזיר את עיצוב
        ברירת המחדל לאותו מקום.
      </p>

      {SLOT_GROUPS.map((group) => {
        const groupSlots = PHOTO_SLOTS.filter((s) => s.group === group)
        if (groupSlots.length === 0) return null
        return (
          <section key={group} className="mt-10">
            <h2 className="mb-4 font-serif text-xl text-gold">{group}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {groupSlots.map((slot) => (
                <SlotCard
                  key={slot.key}
                  slot={slot}
                  override={slots[slot.key]}
                  onChanged={refresh}
                  pushToast={pushToast}
                />
              ))}
            </div>
          </section>
        )
      })}

      <GalleryManager pushToast={pushToast} />

      <ToastStack toasts={toasts} />
    </div>
  )
}

function SlotCard({
  slot,
  override,
  onChanged,
  pushToast,
}: {
  slot: PhotoSlot
  override?: SlotOverride
  onChanged: () => Promise<void>
  pushToast: PushToast
}) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasImage = !!override?.publicId

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file later
    if (!file) return
    if (!file.type.startsWith('image/')) {
      pushToast('err', 'יש לבחור קובץ תמונה')
      return
    }
    setBusy(true)
    try {
      const dataUrl = await fileToDownscaledDataUrl(file)
      const up = await uploadImage(dataUrl, 'slot')
      if (!up) throw new Error('upload')
      const ok = await setSlot(slot.key, up.publicId)
      if (!ok) throw new Error('set')
      pushToast('ok', 'התמונה עודכנה')
      await onChanged()
    } catch (err) {
      pushToast(
        'err',
        err instanceof ImageTooLargeError
          ? 'התמונה גדולה מדי — נסו תמונה קטנה יותר'
          : 'העלאה נכשלה — נסו שוב (מומלץ JPG/PNG)',
      )
    } finally {
      setBusy(false)
    }
  }

  async function onRemove() {
    setBusy(true)
    try {
      const ok = await removeSlot(slot.key)
      if (!ok) throw new Error('remove')
      pushToast('ok', 'התמונה הוסרה')
      await onChanged()
    } catch {
      pushToast('err', 'ההסרה נכשלה — נסו שוב')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone bg-ivory shadow-soft">
      <div className="relative aspect-square bg-stone/40">
        {hasImage ? (
          <img
            src={buildThumbUrl(override!.publicId)}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-muted">
            אין תמונה — מוצג עיצוב ברירת המחדל
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/70 text-sm font-medium text-emerald">
            מעבד…
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <p className="text-sm font-medium leading-snug text-ink">{slot.label}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-full bg-emerald px-4 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-emerald-deep disabled:opacity-60"
          >
            {hasImage ? 'החלף תמונה' : 'העלה תמונה'}
          </button>
          {hasImage && (
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="rounded-full border border-stone px-4 py-1.5 text-xs font-semibold text-emerald transition-colors hover:bg-stone/50 disabled:opacity-60"
            >
              הסר
            </button>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  )
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`rounded-full px-5 py-2.5 text-sm font-medium shadow-card ${
            t.kind === 'ok' ? 'bg-emerald text-cream' : 'bg-red-700 text-white'
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
