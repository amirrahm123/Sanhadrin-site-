import { useCallback, useEffect, useRef, useState } from 'react'
import { PHOTO_SLOTS, SLOT_GROUPS, slotGuidance, slotOrientation, orientationOfAspect, orientationLabel } from '../../data/photoSlots'
import type { PhotoSlot, SlotMap, SlotOverride } from '../../data/photoSlots'
import { buildSlotPreviewUrl } from '../../lib/cloudinary'
import { fetchSlots, logout, removeSlot, setSlot, uploadImage } from '../../lib/adminApi'
import { fileToDownscaledDataUrl, ImageTooLargeError } from '../../lib/imageResize'
import { GalleryManager } from './GalleryManager'

type ToastKind = 'ok' | 'err'
type Toast = { id: number; kind: ToastKind; msg: string }
type PushToast = (kind: ToastKind, msg: string) => void

/** Default focal point for a slot: the manager's saved point, else the slot's
 *  design-tuned default, else centered. Keeps the dashboard preview in lockstep
 *  with what ImagePlaceholder renders on the live site. */
function effectiveFocus(slot: PhotoSlot, override?: SlotOverride): string {
  return override?.objectPosition ?? slot.focus ?? '50% 50%'
}

/** Parse a '<x>% <y>%' object-position into {x,y} numbers (fallback centered). */
function parseFocus(pos: string): { x: number; y: number } {
  const m = /^(\d{1,3})% (\d{1,3})%$/.exec(pos)
  if (!m) return { x: 50, y: 50 }
  return { x: Number(m[1]), y: Number(m[2]) }
}

const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/**
 * The photo-management dashboard: every managed slot grouped by page. Each slot
 * shows a live thumbnail rendered at its REAL container ratio (with the saved
 * focal point applied, so it matches the site), plain-language guidance about
 * the best photo shape, and upload / adjust-focus / remove actions. Uploads open
 * a live crop preview so the manager sees exactly how the photo will look — and
 * can drag the focal point — before confirming. All mutations go through the
 * auth-guarded admin API; on success the slot map is updated optimistically.
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

  // Optimistic, immediate slot update after a successful mutation — the admin
  // sees the change at once instead of waiting on a refetch. Pass null to clear
  // a slot (removal). We deliberately don't refetch here: local state is
  // authoritative post-mutation, and a failed reconcile fetch returns {} which
  // would wipe the whole grid.
  const applyOverride = useCallback((key: string, override: SlotOverride | null) => {
    setSlots((prev) => {
      const next = { ...prev }
      if (override) next[key] = override
      else delete next[key]
      return next
    })
  }, [])

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
        השינויים מופיעים באתר תוך רגע (ייתכן שיהיה צורך לרענן את הדף). לכל מקום מוצגת המלצה על צורת
        התמונה, ולפני השמירה תראו תצוגה מקדימה מדויקת — ותוכלו לגרור כדי לבחור איזה חלק מהתמונה יישאר
        בפריים. תמונה שתוסר תחזיר את עיצוב ברירת המחדל לאותו מקום.
      </p>

      {SLOT_GROUPS.map((group) => {
        const groupSlots = PHOTO_SLOTS.filter((s) => s.group === group)
        if (groupSlots.length === 0) return null
        return (
          <section key={group} className="mt-10">
            <h2 className="mb-4 font-serif text-xl text-gold">{group}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupSlots.map((slot) => (
                <SlotCard
                  key={slot.key}
                  slot={slot}
                  override={slots[slot.key]}
                  onApply={(override) => applyOverride(slot.key, override)}
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

// An in-flight crop session: either a freshly picked file (data URL, needs
// upload on confirm) or an existing photo (adjust its focal point only).
type CropSession =
  | { mode: 'upload'; imageSrc: string; dataUrl: string; initial: string }
  | { mode: 'adjust'; imageSrc: string; publicId: string; initial: string }

function SlotCard({
  slot,
  override,
  onApply,
  pushToast,
}: {
  slot: PhotoSlot
  override?: SlotOverride
  onApply: (override: SlotOverride | null) => void
  pushToast: PushToast
}) {
  const [busy, setBusy] = useState(false)
  const [session, setSession] = useState<CropSession | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasImage = !!override?.publicId
  const guidance = slotGuidance(slot.ratio)
  const focus = effectiveFocus(slot, override)

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
      // Open the crop preview instead of uploading immediately — the manager
      // confirms (and can adjust the focal point) after seeing the real crop.
      setSession({ mode: 'upload', imageSrc: dataUrl, dataUrl, initial: slot.focus ?? '50% 50%' })
    } catch (err) {
      pushToast(
        'err',
        err instanceof ImageTooLargeError
          ? 'התמונה גדולה מדי — נסו תמונה קטנה יותר'
          : 'טעינת התמונה נכשלה — נסו שוב (מומלץ JPG/PNG)',
      )
    } finally {
      setBusy(false)
    }
  }

  function onAdjust() {
    if (!override?.publicId) return
    setSession({
      mode: 'adjust',
      imageSrc: buildSlotPreviewUrl(override.publicId, 900),
      publicId: override.publicId,
      initial: focus,
    })
  }

  // Confirm from the crop modal: upload (new file) or reuse the existing photo,
  // then persist the chosen focal point. Keeps the modal open + busy until done.
  async function onConfirm(objectPosition: string) {
    if (!session) return
    setBusy(true)
    try {
      const publicId =
        session.mode === 'upload'
          ? (await uploadImage(session.dataUrl, 'slot'))?.publicId
          : session.publicId
      if (!publicId) throw new Error('upload')
      const ok = await setSlot(slot.key, publicId, { alt: override?.alt, objectPosition })
      if (!ok) throw new Error('set')
      onApply({ publicId, ...(override?.alt ? { alt: override.alt } : {}), objectPosition })
      setSession(null)
      pushToast('ok', session.mode === 'upload' ? 'התמונה עודכנה' : 'המיקוד עודכן')
    } catch {
      pushToast('err', 'השמירה נכשלה — נסו שוב')
    } finally {
      setBusy(false)
    }
  }

  async function onRemove() {
    setBusy(true)
    try {
      const ok = await removeSlot(slot.key)
      if (!ok) throw new Error('remove')
      onApply(null)
      pushToast('ok', 'התמונה הוסרה')
    } catch {
      pushToast('err', 'ההסרה נכשלה — נסו שוב')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone bg-ivory shadow-soft">
      {/* Thumbnail at the slot's REAL aspect ratio, with the live focal point —
          so this preview matches the public site exactly. */}
      <div className="relative bg-stone/40" style={{ aspectRatio: slot.ratio }}>
        {hasImage ? (
          <img
            src={buildSlotPreviewUrl(override!.publicId, 640)}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: focus }}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-muted">
            אין תמונה — מוצג עיצוב ברירת המחדל
          </div>
        )}
        {busy && !session && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/70 text-sm font-medium text-emerald">
            מעבד…
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <p className="text-sm font-medium leading-snug text-ink">{slot.label}</p>

        {/* Plain-language guidance derived from the slot's real container ratio. */}
        <div className="rounded-xl bg-emerald/5 px-3 py-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald">
            <OrientationIcon orientation={guidance.orientation} />
            {guidance.title}
          </p>
          <p className="mt-1 text-[0.7rem] leading-snug text-muted">{guidance.hint}</p>
          <p className="mt-0.5 text-[0.7rem] text-muted/80">{guidance.ratioLabel}</p>
        </div>

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
              onClick={onAdjust}
              disabled={busy}
              className="rounded-full border border-emerald/40 px-4 py-1.5 text-xs font-semibold text-emerald transition-colors hover:bg-emerald/5 disabled:opacity-60"
            >
              כוונון מיקוד
            </button>
          )}
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

      {session && (
        <CropModal
          slot={slot}
          session={session}
          busy={busy}
          onConfirm={onConfirm}
          onCancel={() => !busy && setSession(null)}
        />
      )}
    </div>
  )
}

/**
 * Full-screen crop preview. Shows the chosen photo inside a box at the slot's
 * exact container ratio using the same object-cover the live site uses, with a
 * draggable focal point (object-position). Warns when the photo's orientation
 * doesn't match the slot's. Confirm persists; cancel discards.
 */
function CropModal({
  slot,
  session,
  busy,
  onConfirm,
  onCancel,
}: {
  slot: PhotoSlot
  session: CropSession
  busy: boolean
  onConfirm: (objectPosition: string) => void
  onCancel: () => void
}) {
  const [pos, setPos] = useState(() => parseFocus(session.initial))
  // Natural aspect of the loaded photo → orientation-mismatch warning.
  const [photoAspect, setPhotoAspect] = useState<number | null>(null)
  const guidance = slotGuidance(slot.ratio)
  const slotOrient = slotOrientation(slot.ratio)
  const objectPosition = `${pos.x}% ${pos.y}%`

  const mismatch =
    photoAspect != null && orientationOfAspect(photoAspect) !== slotOrient && slotOrient !== 'square'
      ? orientationOfAspect(photoAspect)
      : null

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="תצוגה מקדימה וכוונון מיקוד"
      onClick={() => !busy && onCancel()}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-ivory p-5 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-lg text-emerald">תצוגה מקדימה: {slot.label}</h3>
        <p className="mt-1 text-xs text-muted">
          כך תיראה התמונה במקום הזה באתר. גררו את הנקודה כדי לבחור איזה חלק יישאר בפריים.
        </p>

        <div className="mt-4">
          <FocalPointPicker
            imageSrc={session.imageSrc}
            ratio={slot.ratio}
            pos={pos}
            onChange={setPos}
            onAspect={setPhotoAspect}
          />
        </div>

        {mismatch && (
          <p className="mt-3 rounded-xl bg-gold/10 px-3 py-2 text-xs leading-snug text-emerald">
            ⚠️ העליתם תמונה {orientationLabel(mismatch)}, אבל המקום הזה מתאים לתמונה{' '}
            {orientationLabel(slotOrient)}. ייתכן חיתוך משמעותי — גררו את הנקודה כדי לשמור על החלק
            החשוב, או בחרו תמונה מתאימה יותר.
          </p>
        )}

        <div className="mt-3 rounded-xl bg-emerald/5 px-3 py-2 text-xs leading-snug text-muted">
          <span className="font-semibold text-emerald">{guidance.title}.</span> {guidance.hint}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-stone px-5 py-2 text-sm font-semibold text-emerald transition-colors hover:bg-stone/50 disabled:opacity-60"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={() => onConfirm(objectPosition)}
            disabled={busy}
            className="rounded-full bg-emerald px-6 py-2 text-sm font-semibold text-cream transition-colors hover:bg-emerald-deep disabled:opacity-60"
          >
            {busy ? 'שומר…' : session.mode === 'upload' ? 'שמור תמונה' : 'שמור מיקוד'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * The interactive crop box: the photo shown at `ratio` with object-cover, and a
 * draggable reticle that sets object-position. Click or drag anywhere to move
 * the focal point to that spot; arrow keys nudge it for fine control.
 */
function FocalPointPicker({
  imageSrc,
  ratio,
  pos,
  onChange,
  onAspect,
}: {
  imageSrc: string
  ratio: string
  pos: { x: number; y: number }
  onChange: (pos: { x: number; y: number }) => void
  onAspect: (aspect: number) => void
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const setFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const box = boxRef.current
      if (!box) return
      const rect = box.getBoundingClientRect()
      onChange({
        x: clampPct(((clientX - rect.left) / rect.width) * 100),
        y: clampPct(((clientY - rect.top) / rect.height) * 100),
      })
    },
    [onChange],
  )

  return (
    <div
      ref={boxRef}
      className="relative w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-stone bg-stone/40"
      style={{ aspectRatio: ratio }}
      tabIndex={0}
      role="slider"
      aria-label="נקודת מיקוד התמונה"
      aria-valuetext={`אופקי ${pos.x}%, אנכי ${pos.y}%`}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        setFromEvent(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromEvent(e.clientX, e.clientY)
      }}
      onPointerUp={(e) => {
        dragging.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 2
        if (e.key === 'ArrowLeft') onChange({ ...pos, x: clampPct(pos.x - step) })
        else if (e.key === 'ArrowRight') onChange({ ...pos, x: clampPct(pos.x + step) })
        else if (e.key === 'ArrowUp') onChange({ ...pos, y: clampPct(pos.y - step) })
        else if (e.key === 'ArrowDown') onChange({ ...pos, y: clampPct(pos.y + step) })
        else return
        e.preventDefault()
      }}
    >
      <img
        src={imageSrc}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
        style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
        onLoad={(e) => {
          const img = e.currentTarget
          if (img.naturalWidth && img.naturalHeight) onAspect(img.naturalWidth / img.naturalHeight)
        }}
      />
      {/* Reticle marking the focal point. */}
      <div
        className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream shadow-[0_0_0_2px_rgba(24,70,58,0.6)]"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
      </div>
    </div>
  )
}

function OrientationIcon({ orientation }: { orientation: 'portrait' | 'landscape' | 'square' }) {
  const dims =
    orientation === 'portrait'
      ? { w: 10, h: 14 }
      : orientation === 'landscape'
        ? { w: 14, h: 10 }
        : { w: 12, h: 12 }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <rect
        x={(16 - dims.w) / 2}
        y={(16 - dims.h) / 2}
        width={dims.w}
        height={dims.h}
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
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
