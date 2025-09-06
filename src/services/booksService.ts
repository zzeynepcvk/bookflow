import { db, auth } from "../firebase";
import {
  collection, addDoc, getDocs, query, where, orderBy,
  doc, updateDoc, deleteDoc
} from "firebase/firestore";
import type { Book } from "../types";

// Firestore'da "books" koleksiyonunu referans alıyoruz
const booksCol = collection(db, "books");

// ✅ Aktif kullanıcı UID'sini al
const getUid = () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("❌ Kullanıcı giriş yapmamış!");
    throw new Error("Kullanıcı giriş yapmamış!");
  }
  console.log("✅ Current user:", user.email, user.uid);
  return user.uid;
};

// Kitap ekleme
export const addBook = async (book: Book | Omit<Book, 'id'>) => {
  try {
    console.log("📚 Kitap ekleniyor:", book.title);
    
    // ID'yi ayır - Firestore kendi ID'sini oluşturacak
    const bookData = 'id' in book ? (() => {
      const { id, ...rest } = book;
      return rest;
    })() : book;
    
    const uid = getUid(); // Kullanıcı kontrolü

    // normalize et - tüm required fieldları kontrol et
    const safeBook = {
      title: bookData.title || "Unknown Title",
      author: bookData.author || "Unknown Author", 
      pages: bookData.pages ?? 0,
      readPages: bookData.readPages ?? 0,
      notes: bookData.notes ?? "",
      quotes: bookData.quotes ?? [],
      addedAt: bookData.addedAt ?? new Date().toISOString(),
      coverUrl: bookData.coverUrl ?? "",
      ownerId: uid, // ✅ rules ile uyumlu
    };

    console.log("💾 Firestore'a ekleniyor:", safeBook);
    const docRef = await addDoc(booksCol, safeBook);
    console.log("✅ Kitap eklendi, ID:", docRef.id);
    
    return { ...safeBook, id: docRef.id };
  } catch (error) {
    console.error("❌ addBook hatası:", error);
    
    // Hata detayını logla
    if (error instanceof Error) {
      console.error("❌ Hata mesajı:", error.message);
    }
    
    throw error;
  }
};

// Kitapları getir (sadece giriş yapan kullanıcının)
export const getBooks = async (): Promise<Book[]> => {
  try {
    console.log("📖 Kullanıcının kitapları getiriliyor...");
    const uid = getUid();
    
    const q = query(
      booksCol,
      where("ownerId", "==", uid), // ✅ düzeltilmiş
      orderBy("addedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const books: Book[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      books.push({ 
        id: docSnap.id, 
        title: data.title || "Unknown Title",
        author: data.author || "Unknown Author",
        pages: data.pages ?? 0,
        readPages: data.readPages ?? 0,
        notes: data.notes ?? "",
        quotes: data.quotes ?? [],
        addedAt: data.addedAt ?? new Date().toISOString(),
        coverUrl: data.coverUrl ?? "",
        ownerId: data.ownerId
      });
    });
    
    console.log("✅ Getirilen kitap sayısı:", books.length);
    return books;
  } catch (error) {
    console.error("❌ getBooks hatası:", error);
    throw error;
  }
};

// Kitap güncelle
export const updateBook = async (book: Book) => {
  try {
    console.log("📝 Kitap güncelleniyor:", book.id, book.title);
    
    if (!book.id) {
      throw new Error("Kitap ID'si gerekli");
    }
    
    const docRef = doc(booksCol, book.id);
    const uid = getUid();

    const safeBook = {
      title: book.title || "Unknown Title",
      author: book.author || "Unknown Author",
      pages: book.pages ?? 0,
      readPages: book.readPages ?? 0,
      notes: book.notes ?? "",
      quotes: book.quotes ?? [],
      addedAt: book.addedAt ?? new Date().toISOString(),
      coverUrl: book.coverUrl ?? "",
      ownerId: uid, // ✅ Rules'a uygun field adı
    };

    await updateDoc(docRef, safeBook);
    console.log("✅ Kitap güncellendi");
  } catch (error) {
    console.error("❌ updateBook hatası:", error);
    throw error;
  }
};

// Kitap sil
export const deleteBook = async (id: string) => {
  try {
    console.log("🗑️ Kitap siliniyor:", id);
    
    if (!id) {
      throw new Error("Kitap ID'si gerekli");
    }
    
    const docRef = doc(booksCol, id);
    await deleteDoc(docRef);
    console.log("✅ Kitap silindi");
  } catch (error) {
    console.error("❌ deleteBook hatası:", error);
    throw error;
  }
};