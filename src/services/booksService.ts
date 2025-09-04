// src/services/booksService.ts
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import type { Book } from "../types"

const booksCol = collection(db, "books")

export const addBook = async (book: Book) => {
  // Firestore otomatik ID oluşturuyor, bizim id'yi silip Firestore ID'yi kullanabiliriz ya da
  // id'yi doküman ID olarak kullanmak için aşağıdaki şekilde yapabiliriz:
  // return await setDoc(doc(booksCol, book.id), book)

  // Burada Firestore ID kullanıyoruz:
  const { id, ...bookData } = book // id'yi ayırıyoruz, Firestore kendi id'sini oluşturacak
  const docRef = await addDoc(booksCol, bookData)
  return { ...bookData, id: docRef.id }
}

export const getBooks = async (): Promise<Book[]> => {
  const q = query(booksCol, orderBy("addedAt", "desc"))
  const snapshot = await getDocs(q)
  const books: Book[] = []
  snapshot.forEach(docSnap => {
    books.push({ id: docSnap.id, ...(docSnap.data() as Omit<Book, "id">) })
  })
  return books
}

export const updateBook = async (book: Book) => {
  const docRef = doc(booksCol, book.id)
  await updateDoc(docRef, {
    title: book.title,
    author: book.author,
    pages: book.pages,
    readPages: book.readPages,
    notes: book.notes,
    quotes: book.quotes,
    addedAt: book.addedAt,
  })
}

export const deleteBook = async (id: string) => {
  const docRef = doc(booksCol, id)
  await deleteDoc(docRef)
}
