// Server-only helpers for the slot mapping, persisted as a single JSON object
// (slots.json) in the Vercel Blob store. The SDK reads BLOB_READ_WRITE_TOKEN
// from the environment automatically. Outside api/ so it's never an endpoint.
import { list, put } from '@vercel/blob'
import type { SlotMap } from '../src/data/photoSlots.js'

const SLOTS_PATH = 'slots.json'

// Call before a write inside a handler (never at module load). Throws a clear
// message the handler logs + turns into a 500 when the Blob store token is
// absent, instead of an opaque SDK error.
export function assertBlobConfigured(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('blob store not configured — missing env: BLOB_READ_WRITE_TOKEN')
  }
}

/** Read the current slot map. Fails safe to `{}` (→ site shows placeholders). */
export async function readSlots(): Promise<SlotMap> {
  try {
    const { blobs } = await list({ prefix: SLOTS_PATH, limit: 100 })
    const blob = blobs.find((b) => b.pathname === SLOTS_PATH)
    if (!blob) return {}
    const res = await fetch(blob.url, { cache: 'no-store' })
    if (!res.ok) return {}
    const data = (await res.json()) as SlotMap
    return data && typeof data === 'object' ? data : {}
  } catch (err) {
    console.error('[blob] readSlots failed:', err instanceof Error ? err.message : err)
    return {}
  }
}

/** Overwrite the slot map. Throws on failure so the caller can 500. */
export async function writeSlots(map: SlotMap): Promise<void> {
  await put(SLOTS_PATH, JSON.stringify(map), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    // Short edge cache so admin edits propagate within ~a minute.
    cacheControlMaxAge: 60,
  })
}
