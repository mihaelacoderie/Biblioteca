import { useEffect, useState } from 'react'
import { api } from '../api'
import type { UserWithLoans } from '../types'

function formatDate(value: string) {
  // serverul trimite ora UTC fără "Z", o adăugăm ca să se convertească corect în ora locală
  return new Date(value.endsWith('Z') ? value : value + 'Z').toLocaleString('ro-RO')
}

export default function UsersOverview({ refreshKey }: { refreshKey: number }) {
  const [users, setUsers] = useState<UserWithLoans[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    api<UserWithLoans[]>('/api/users')
      .then((data) => {
        if (!cancelled) {
          setUsers(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Eroare necunoscută')
        }
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return (
    <section className="panel">
      <h2>Useri și cărțile împrumutate</h2>
      {error && <p className="error">{error}</p>}
      {users.length === 0 ? (
        <p className="muted">Nu există useri încă.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="user-row">
            <strong>{user.fullName}</strong> <span className="muted">({user.email})</span>
            {user.borrowedBooks.length === 0 ? (
              <p className="muted">Nicio carte împrumutată.</p>
            ) : (
              <ul>
                {user.borrowedBooks.map((b) => (
                  <li key={b.bookId}>
                    {b.title} — {b.author}{' '}
                    <span className="muted">(din {formatDate(b.borrowedAt)})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </section>
  )
}