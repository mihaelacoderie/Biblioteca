export interface Book {
  id: number
  title: string
  author: string
  isbn: string | null
  isAvailable: boolean
  borrowedByMe: boolean
}

export interface BorrowedBook {
  bookId: number
  title: string
  author: string
  borrowedAt: string
}

export interface UserWithLoans {
  id: string
  email: string
  fullName: string
  borrowedBooks: BorrowedBook[]
}