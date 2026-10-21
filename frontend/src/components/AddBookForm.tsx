import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api'

export default function AddBookForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setBusy(true)
    try {
      await api('/api/books', {
        method: 'POST',
        body: JSON.stringify({ title, author, isbn: isbn.trim() || null }),
      })
      setSuccess(`Cartea „${title}” a fost adăugată.`)
      setTitle('')
      setAuthor('')
      setIsbn('')
      onAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel">
      <h2>Adaugă o carte</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Titlu
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
        </label>
        <label>
          Autor
          <input value={author} onChange={(e) => setAuthor(e.target.value)} required maxLength={200} />
        </label>
        <label>
          ISBN (opțional)
          <input value={isbn} onChange={(e) => setIsbn(e.target.value)} maxLength={20} />
        </label>
        {error && <p className="error">{error}</p>}
        {success && <p className="ok">{success}</p>}
        <button type="submit" disabled={busy}>
          {busy ? 'Se adaugă...' : 'Adaugă cartea'}
        </button>
      </form>
    </section>
  )
}