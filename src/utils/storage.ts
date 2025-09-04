//import { Book } from '../types'
import type { Book } from '../types'
const KEY = 'book-tracker:v1'

export const loadBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Book[]
  } catch (e) {
    console.error('loadBooks', e)
    return []
  }
}

export const saveBooks = (books: Book[]) => {
  localStorage.setItem(KEY, JSON.stringify(books))
}
