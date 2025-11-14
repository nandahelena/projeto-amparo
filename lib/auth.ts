// Utilities to manage authentication state (token + user) in localStorage
export const TOKEN_KEY = 'projeto-amparo-token'
export const USER_KEY = 'projeto-amparo-user'
export const LAST_ACTIVITY = 'projeto-amparo-last-activity'

export type User = {
  id?: any
  email: string
  fullName?: string
  [k: string]: any
}

export function setAuthToken(token: string, user: User) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(LAST_ACTIVITY, Date.now().toString())
  } catch (e) {
    console.error('❌ setAuthToken error:', e)
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthUser(): User | null {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem(USER_KEY)
  return u ? JSON.parse(u) : null
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.setItem(LAST_ACTIVITY, Date.now().toString())
  } catch (e) {
    console.error('❌ clearAuth error:', e)
  }
}

export function isAuthenticated() {
  return !!getAuthToken()
}

export function getBackendUrl(path: string) {
  const base = typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_BACKEND_URL
  || process.env.NEXT_PUBLIC_BACKEND_URL
  || 'http://localhost:4000'
  return `${base}${path}`
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const resp = await fetch(input, { ...init, headers })
  if (resp.status === 401) {
    clearAuth()
  }
  return resp
}
