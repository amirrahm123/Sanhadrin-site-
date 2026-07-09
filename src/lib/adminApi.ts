// Client helpers for the admin API. All calls are same-origin and rely on the
// httpOnly session cookie set by /api/auth/login — the browser never sees the
// token contents. Nothing secret lives here.

export async function fetchIsAdmin(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/me', { headers: { Accept: 'application/json' } })
    if (!res.ok) return false
    const data = (await res.json()) as { admin?: boolean }
    return data.admin === true
  } catch {
    return false
  }
}

/** Returns true on successful login. Generic failure otherwise (no field hints). */
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    /* ignore */
  }
}
