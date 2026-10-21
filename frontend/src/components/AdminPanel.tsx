import { useState } from 'react'
import AddBookForm from './AddBookForm'
import BookList from './BookList'
import CreateUserForm from './CreateUserForm'
import UsersOverview from './UsersOverview'

export default function AdminPanel() {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <>
      <div className="toolbar">
        <button className="secondary" onClick={refresh}>
          Reîmprospătează
        </button>
      </div>
      <div className="grid">
        <AddBookForm onAdded={refresh} />
        <CreateUserForm onCreated={refresh} />
      </div>
      <UsersOverview refreshKey={refreshKey} />
      <BookList canBorrow={false} refreshKey={refreshKey} />
    </>
  )
}