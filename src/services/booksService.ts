// src/services/booksService.ts
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import type { Book } from "../types"

const booksCol = collection(db, "books")

// Kitap ekleme
export const addBook = async (book: Book) => {
  const { id, ...bookData } = book

  // ✅ Firestore undefined kabul etmez, normalize et
  const safeBook = {
    ...bookData,
    pages: bookData.pages ?? 0,
    readPages: bookData.readPages ?? 0,
    notes: bookData.notes ?? "",
    quotes: bookData.quotes ?? [],
    addedAt: bookData.addedAt ?? new Date().toISOString(),
  }

  const docRef = await addDoc(booksCol, safeBook)
  return { ...safeBook, id: docRef.id }
}

// Kitapları getir
export const getBooks = async (): Promise<Book[]> => {
  const q = query(booksCol, orderBy("addedAt", "desc"))
  const snapshot = await getDocs(q)
  const books: Book[] = []
  snapshot.forEach(docSnap => {
    books.push({ id: docSnap.id, ...(docSnap.data() as Omit<Book, "id">) })
  })
  return books
}

// Kitap güncelle
export const updateBook = async (book: Book) => {
  const docRef = doc(booksCol, book.id)

  // ✅ normalize
  const safeBook = {
    title: book.title,
    author: book.author,
    pages: book.pages ?? 0,
    readPages: book.readPages ?? 0,
    notes: book.notes ?? "",
    quotes: book.quotes ?? [],
    addedAt: book.addedAt ?? new Date().toISOString(),
    coverUrl: book.coverUrl ?? "",
  }

  await updateDoc(docRef, safeBook)
}

// Kitap sil
export const deleteBook = async (id: string) => {
  const docRef = doc(booksCol, id)
  await deleteDoc(docRef)
}
