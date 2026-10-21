import { useAuth } from '../auth'
import AdminPanel from '../components/AdminPanel'
import BookList from '../components/BookList'

export default function Home() {
  const { session, logout } = useAuth()
  const isAdmin = session?.role === 'Admin'

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <strong>{session?.fullName}</strong>
          <span className="badge">{session?.role}</span>
        </div>
        <button className="secondary" onClick={logout}>
          Ieșire
        </button>
      </header>
      {isAdmin ? <AdminPanel /> : <BookList canBorrow />}
    </div>
  )
}