import { db, auth } from "../firebase";
import {
  collection, addDoc, getDocs, query, where, orderBy,
  doc, updateDoc, deleteDoc, getDoc
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

// 🔍 DEBUG: Tüm kitapları göster (ownerId ile birlikte)
export const debugAllBooks = async () => {
  try {
    console.log("🔍 DEBUG: Tüm kitaplar getiriliyor...");
    const snapshot = await getDocs(booksCol);
    const allBooks: any[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allBooks.push({
        id: docSnap.id,
        title: data.title,
        ownerId: data.ownerId,
        addedAt: data.addedAt
      });
    });
    
    console.table(allBooks);
    console.log("🔍 Toplam kitap sayısı:", allBooks.length);
    console.log("🔍 Mevcut kullanıcı UID:", getUid());
    
    // Kullanıcıya ait kitapları filtrele
    const myBooks = allBooks.filter(b => b.ownerId === getUid());
    console.log("🔍 Bana ait kitap sayısı:", myBooks.length);
    
    return allBooks;
  } catch (error) {
    console.error("❌ debugAllBooks hatası:", error);
    throw error;
  }
};

// Kitap ekleme - DÜZELTME
export const addBook = async (book: Book | Omit<Book, 'id'>) => {
  try {
    console.log("📚 Kitap ekleniyor:", book.title);
    
    const uid = getUid(); // Kullanıcı kontrolü
    console.log("📚 Kitap sahibi UID:", uid);
    
    // ID'yi ayır - Firestore kendi ID'sini oluşturacak
    const bookData = 'id' in book ? (() => {
      const { id, ...rest } = book;
      return rest;
    })() : book;
    
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
      ownerId: uid, // ✅ HER ZAMAN mevcut kullanıcının UID'si
    };

    console.log("💾 Firestore'a ekleniyor:", safeBook);
    const docRef = await addDoc(booksCol, safeBook);
    console.log("✅ Kitap eklendi, ID:", docRef.id, "Owner:", uid);
    
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

// Kitapları getir (sadece giriş yapan kullanıcının) - DÜZELTME
export const getBooks = async (): Promise<Book[]> => {
  try {
    console.log("📖 Kullanıcının kitapları getiriliyor...");
    const uid = getUid();
    console.log("📖 Kullanıcı UID:", uid);
    
    // Önce debug için tüm kitapları görelim
    if (process.env.NODE_ENV === 'development') {
      await debugAllBooks();
    }
    
    const q = query(
      booksCol,
      where("ownerId", "==", uid), // ✅ Sadece bu kullanıcının kitapları
      orderBy("addedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const books: Book[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      console.log("📖 Kitap bulundu:", data.title, "Owner:", data.ownerId);
      
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
    
    // Permission hatası mı kontrol et
    if (error instanceof Error && error.message.includes('permission')) {
      console.error("⚠️ Firebase Rules hatası! Kullanıcı kitaplara erişemiyor.");
      console.error("⚠️ Mevcut UID:", getUid());
    }
    
    throw error;
  }
};

// Kitap güncelle - DÜZELTME
export const updateBook = async (book: Book) => {
  try {
    console.log("📝 Kitap güncelleniyor:", book.id, book.title);
    
    if (!book.id) {
      throw new Error("Kitap ID'si gerekli");
    }
    
    const uid = getUid();
    const docRef = doc(booksCol, book.id);
    
    // Önce kitabın sahibini kontrol et
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      if (existingData.ownerId !== uid) {
        console.error("❌ Bu kitap size ait değil!");
        throw new Error("Bu kitabı güncelleme yetkiniz yok");
      }
    }

    const safeBook = {
      title: book.title || "Unknown Title",
      author: book.author || "Unknown Author",
      pages: book.pages ?? 0,
      readPages: book.readPages ?? 0,
      notes: book.notes ?? "",
      quotes: book.quotes ?? [],
      addedAt: book.addedAt ?? new Date().toISOString(),
      coverUrl: book.coverUrl ?? "",
      ownerId: uid, // ✅ ownerId değişmemeli
    };

    await updateDoc(docRef, safeBook);
    console.log("✅ Kitap güncellendi");
  } catch (error) {
    console.error("❌ updateBook hatası:", error);
    throw error;
  }
};

// Kitap sil - DÜZELTME
export const deleteBook = async (id: string) => {
  try {
    console.log("🗑️ Kitap siliniyor:", id);
    
    if (!id) {
      throw new Error("Kitap ID'si gerekli");
    }
    
    const uid = getUid();
    const docRef = doc(booksCol, id);
    
    // Önce kitabın sahibini kontrol et
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.ownerId !== uid) {
        console.error("❌ Bu kitap size ait değil!");
        throw new Error("Bu kitabı silme yetkiniz yok");
      }
    }
    
    await deleteDoc(docRef);
    console.log("✅ Kitap silindi");
  } catch (error) {
    console.error("❌ deleteBook hatası:", error);
    throw error;
  }
};

// 🔧 UTILITY: Eski kitapları düzelt (ownerId eksik olanlar için)
export const fixLegacyBooks = async () => {
  try {
    console.log("🔧 Eski kitaplar düzeltiliyor...");
    const uid = getUid();
    
    // ownerId olmayan kitapları bul
    const snapshot = await getDocs(booksCol);
    let fixedCount = 0;
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      // Eğer ownerId yoksa veya boşsa
      if (!data.ownerId) {
        console.log("🔧 Düzeltiliyor:", data.title);
        await updateDoc(doc(booksCol, docSnap.id), {
          ...data,
          ownerId: uid
        });
        fixedCount++;
      }
    }
    
    console.log(`✅ ${fixedCount} kitap düzeltildi`);
    return fixedCount;
  } catch (error) {
    console.error("❌ fixLegacyBooks hatası:", error);
    throw error;
  }
};