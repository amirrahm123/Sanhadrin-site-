import { useEffect, useState } from 'react'
import { Head } from 'vite-react-ssg'
import { fetchIsAdmin, login } from '../lib/adminApi'
import { Dashboard } from '../components/admin/Dashboard'

type AuthState = 'checking' | 'anon' | 'admin'

/**
 * Standalone /admin dashboard — NOT wrapped in the public Layout, so it carries
 * none of the public chrome and ships as its own lazy chunk. Server-side auth
 * (the httpOnly session cookie) is the real gate; this UI only decides what to
 * show. noindex so it never enters search results.
 */
export function Component() {
  const [auth, setAuth] = useState<AuthState>('checking')

  useEffect(() => {
    fetchIsAdmin().then((ok) => setAuth(ok ? 'admin' : 'anon'))
  }, [])

  return (
    <>
      <Head>
        <html lang="he" dir="rtl" />
        <title>ניהול תמונות — אחוזת סנדרין</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div dir="rtl" className="min-h-screen bg-cream text-ink">
        {auth === 'checking' && <CenteredNote>טוען…</CenteredNote>}
        {auth === 'anon' && <LoginScreen onSuccess={() => setAuth('admin')} />}
        {auth === 'admin' && <Dashboard onLogout={() => setAuth('anon')} />}
      </div>
    </>
  )
}

function CenteredNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center text-muted">
      {children}
    </div>
  )
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(false)
    const ok = await login(username, password)
    setBusy(false)
    if (ok) onSuccess()
    else setError(true)
  }

  const field =
    'w-full rounded-xl border border-stone bg-ivory px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50'

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-stone bg-ivory p-8 shadow-card">
        <h1 className="text-center font-serif text-2xl text-emerald">ניהול תמונות האתר</h1>
        <p className="mt-2 text-center text-sm text-muted">אחוזת סנדרין — כניסת מנהל/ת</p>

        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-emerald" htmlFor="admin-user">
              שם משתמש
            </label>
            <input
              id="admin-user"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={field}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-emerald" htmlFor="admin-pass">
              סיסמה
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              שם משתמש או סיסמה שגויים
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-full bg-emerald px-6 py-3 font-semibold text-cream transition-colors hover:bg-emerald-deep disabled:opacity-60"
          >
            {busy ? 'מתחבר/ת…' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  )
}

