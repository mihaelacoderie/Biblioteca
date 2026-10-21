import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'

export default function CreateUserForm({ onCreated }: { onCreated: () => void }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setBusy(true)
    try {
      await api('/api/users', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      })
      setSuccess(`Userul ${email} a fost creat.`)
      setFullName('')
      setEmail('')
      setPassword('')
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel">
      <h2>Creează un user</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nume complet
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Parolă (minim 6 caractere, literă mare, cifră, simbol)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        {success && <p className="ok">{success}</p>}
        <button type="submit" disabled={busy}>
          {busy ? 'Se creează...' : 'Creează userul'}
        </button>
      </form>
    </section>
  )
}