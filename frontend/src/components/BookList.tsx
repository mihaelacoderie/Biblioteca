import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { Book } from '../types'

interface Props {
  canBorrow: boolean
  refreshKey?: number
}

export default function BookList({ canBorrow, refreshKey = 0 }: Props) {
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      setBooks(await api<Book[]>('/api/books'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  async function act(book: Book, action: 'borrow' | 'return') {
    setBusyId(book.id)
    setError(null)
    try {
      await api<void>(`/api/books/${book.id}/${action}`, { method: 'POST' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setBusyId(null)
      await load()
    }
  }

  function statusText(book: Book) {
    if (book.borrowedByMe) return 'Împrumutată de tine'
    return book.isAvailable ? 'Disponibilă' : 'Împrumutată'
  }

  return (
    <section className="panel">
      <h2>Cărți</h2>
      {error && <p className="error">{error}</p>}
      {books.length === 0 ? (
        <p className="muted">Nu există cărți încă.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titlu</th>
              <th>Autor</th>
              <th>Stare</th>
              {canBorrow && <th></th>}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td className={book.isAvailable ? 'ok' : ''}>{statusText(book)}</td>
                {canBorrow && (
                  <td>
                    {book.borrowedByMe ? (
                      <button disabled={busyId === book.id} onClick={() => act(book, 'return')}>
                        Returnează
                      </button>
                    ) : book.isAvailable ? (
                      <button disabled={busyId === book.id} onClick={() => act(book, 'borrow')}>
                        Împrumută
                      </button>
                    ) : null}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}