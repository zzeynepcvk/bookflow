import { db, auth } from "../firebase";
import {
  collection, addDoc, getDocs, query, where, orderBy,
  doc, updateDoc, deleteDoc
} from "firebase/firestore";
import type { Book } from "../types";

// Firestore'da "books" koleksiyonunu referans alıyoruz
const booksCol = collection(db, "books");

// ✅ Aktif kullanıcı UID’sini al
const getUid = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Kullanıcı giriş yapmamış!");
  return user.uid;
};

// Kitap ekleme
export const addBook = async (book: Book) => {
  const { id, ...bookData } = book;

  // normalize et
  const safeBook = {
    ...bookData,
    pages: bookData.pages ?? 0,
    readPages: bookData.readPages ?? 0,
    notes: bookData.notes ?? "",
    quotes: bookData.quotes ?? [],
    addedAt: bookData.addedAt ?? new Date().toISOString(),
    coverUrl: bookData.coverUrl ?? "",
    uid: getUid(), // ✅ kitabı ekleyen kullanıcı
  };

  const docRef = await addDoc(booksCol, safeBook);
  return { ...safeBook, id: docRef.id };
};

// Kitapları getir (sadece giriş yapan kullanıcının)
export const getBooks = async (): Promise<Book[]> => {
  const q = query(
    booksCol,
    where("uid", "==", getUid()), // ✅ filtre
    orderBy("addedAt", "desc")
  );
  const snapshot = await getDocs(q);
  const books: Book[] = [];
  snapshot.forEach((docSnap) => {
    books.push({ id: docSnap.id, ...(docSnap.data() as Omit<Book, "id">) });
  });
  return books;
};

// Kitap güncelle
export const updateBook = async (book: Book) => {
  const docRef = doc(booksCol, book.id);

  const safeBook = {
    title: book.title,
    author: book.author,
    pages: book.pages ?? 0,
    readPages: book.readPages ?? 0,
    notes: book.notes ?? "",
    quotes: book.quotes ?? [],
    addedAt: book.addedAt ?? new Date().toISOString(),
    coverUrl: book.coverUrl ?? "",
    uid: getUid(), // ✅ güncellenirken de kullanıcıya ait kalsın
  };

  await updateDoc(docRef, safeBook);
};

// Kitap sil
export const deleteBook = async (id: string) => {
  const docRef = doc(booksCol, id);
  await deleteDoc(docRef);
};
