const STORAGE_KEY = 'biblioteca.session'

export interface Session {
  token: string
  email: string
  fullName: string
  role: 'Admin' | 'User'
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(session: Session | null) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // aplicația merge și fără stocare
  }
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = loadSession()
  const headers = new Headers(options.headers)

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (session) {
    headers.set('Authorization', `Bearer ${session.token}`)
  }

  const response = await fetch(path, { ...options, headers })
    if (response.status === 401 && session && path !== '/api/auth/login') {
    saveSession(null)
    window.location.assign('/login')
  }

  if (!response.ok) {
    let message = `Eroare ${response.status}`
    try {
      const data = await response.json()
      if (data.message) {
        message = data.message
      } else if (Array.isArray(data.errors)) {
        message = data.errors.join(' ')
      } else if (data.errors) {
        message = Object.values(data.errors).flat().join(' ')
      }
    } catch {
      // răspuns fără corp JSON
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}