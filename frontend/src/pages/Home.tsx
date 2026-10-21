import { useAuth } from '../auth'

export default function Home() {
  const { session, logout } = useAuth()

  return (
    <div className="card">
      <h1>Bun venit, {session?.fullName}</h1>
      <p>Rol: {session?.role}</p>
      <button onClick={logout}>Ieșire</button>
    </div>
  )
}