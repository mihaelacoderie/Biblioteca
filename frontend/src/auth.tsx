import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { api, loadSession, saveSession } from './api'
import type { Session } from './api'

interface AuthContextValue {
  session: Session | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  async function login(email: string, password: string) {
    const result = await api<Session>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    saveSession(result)
    setSession(result)
  }

  function logout() {
    saveSession(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth trebuie folosit în interiorul AuthProvider')
  }
  return ctx
}