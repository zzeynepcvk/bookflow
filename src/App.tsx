import { useAuth } from "./contexts/AuthContext";
import AuthScreen from "./components/AuthScreen";

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import NotesModal from "./components/NotesModal";
import FriendsRecommendations from "./components/FriendsRecommendations";
import type { Book } from "./types";
import * as booksService from "./services/booksService";
import { searchBooks } from "./services/bookApi";
import type { ApiBook } from "./services/bookApi";
import { v4 as uuidv4 } from "uuid";

const App: React.FC = () => {
  // ✅ Auth durumu - düzeltildi
  const { user, approved, loading } = useAuth();

  // ✅ Loading durumu kontrolü
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  // ✅ Kullanıcı giriş yapmamışsa AuthScreen göster
  if (!user) {
    return <AuthScreen />;
  }

  // ✅ Kullanıcı onaylanmamışsa bekleme ekranı
  if (!approved) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        <div className="text-center">
          <div className="mb-4 text-xl">Hesabınız onay bekliyor</div>
          <div className="text-sm text-gray-500 mb-4">
            Yönetici tarafından onaylanmanızı bekleyin.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  // ✅ Kitap uygulaması state'leri
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Book | undefined>();
  const [booksLoading, setBooksLoading] = useState(true);

  // ✅ Google Books API search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiBook[]>([]);

  // ✅ Kitapları Firestore'dan çek
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);
        const data = await booksService.getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Kitaplar yüklenirken hata:", error);
      } finally {
        setBooksLoading(false);
      }
    };
    
    if (user && approved) {
      fetchBooks();
    }
  }, [user, approved]);

  // ✅ Kitap ekle
  const addBook = async (b: Book) => {
    try {
      const newBook = await booksService.addBook(b);
      setBooks((prev) => [newBook, ...prev]);
    } catch (error) {
      console.error("Kitap eklenirken hata:", error);
      alert("Kitap eklenirken bir hata oluştu");
    }
  };

  // ✅ Kitap sil
  const deleteBook = async (id: string) => {
    try {
      await booksService.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Kitap silinirken hata:", error);
      alert("Kitap silinirken bir hata oluştu");
    }
  };

  // ✅ Kitap güncelle
  const updateBook = async (b: Book) => {
    try {
      const safeBook = {
        ...b,
        quotes: b.quotes ?? [],
      };
      await booksService.updateBook(safeBook);
      setBooks((prev) => prev.map((x) => (x.id === b.id ? safeBook : x)));
    } catch (error) {
      console.error("Kitap güncellenirken hata:", error);
      alert("Kitap güncellenirken bir hata oluştu");
    }
  };

  // ✅ Google Books arama
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const results = await searchBooks(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Kitap arama hatası:", error);
      alert("Kitap aranırken bir hata oluştu");
    }
  };

  // ✅ API kitap Firestore'a ekle
  const addApiBook = async (apiBook: ApiBook) => {
    const newBook: Book = {
      id: uuidv4(),
      title: apiBook.title,
      author: apiBook.author,
      pages: apiBook.pageCount ?? 0,
      readPages: 0,
      notes: "",
      quotes: [],
      coverUrl: apiBook.thumbnail ?? "",
      addedAt: new Date().toISOString(),
    };
    await addBook(newBook);
    // API sonuçlarını temizle
    setSearchResults([]);
    setSearchTerm("");
  };

  // ✅ Filtreleme
  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase().trim()) ||
      b.author.toLowerCase().includes(query.toLowerCase().trim())
  );

  const stats = {
    total: books.length,
    completed: books.filter((b) =>
      b.pages ? b.readPages >= b.pages : false
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Library</h2>
            <div className="text-sm text-gray-600">
              Total: {stats.total} • Completed: {stats.completed}
            </div>
          </div>

          {/* Google Books Search Panel */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Search & Add Books</h3>
            <div className="flex gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or author"
                className="flex-1 p-2 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between border p-2 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {b.thumbnail && (
                        <img
                          src={b.thumbnail}
                          alt={b.title}
                          className="w-12 h-16 object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{b.title}</div>
                        <div className="text-sm text-gray-600">{b.author}</div>
                        <div className="text-xs text-gray-500">
                          {b.pageCount ? `${b.pageCount} pages` : 'Page count unknown'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addApiBook(b)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-col md:flex-row">
            <div className="flex-1">
              <BookForm onAdd={addBook} />
            </div>
            <div className="w-full md:w-80">
              <div className="bg-white p-4 rounded shadow">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search in your library"
                  className="w-full p-2 border rounded"
                />
                <div className="mt-3">
                  <FriendsRecommendations />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booksLoading ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Kitaplar yükleniyor...
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                {query ? (
                  <>
                    <div className="mb-2">"{query}" için sonuç bulunamadı</div>
                    <button
                      onClick={() => setQuery("")}
                      className="text-blue-600 hover:underline"
                    >
                      Tüm kitapları göster
                    </button>
                  </>
                ) : (
                  "Henüz kitap yok — ilk kitabınızı ekleyin!"
                )}
              </div>
            ) : (
              filtered.map((b) => (
                <BookCard
                  key={b.id}
                  book={b}
                  onDelete={deleteBook}
                  onUpdate={updateBook}
                  onOpenNotes={(book) => setSelected(book)}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Reading Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Toplam kitap: {books.length}</div>
              <div>Tamamlanan: {stats.completed}</div>
              <div>Devam eden: {books.length - stats.completed}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (window.confirm("Tüm kitapları silmek istediğinizden emin misiniz?")) {
                    // TODO: Firestore'dan da temizle
                    setBooks([]);
                  }
                }}
                className="px-3 py-2 rounded border hover:bg-gray-50"
              >
                Tümünü Temizle
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(books, null, 2)
                  );
                  alert("Kitap listesi panoya kopyalandı!");
                }}
                className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Dışa Aktar
              </button>
            </div>
          </div>
        </aside>
      </main>

      {selected && (
        <NotesModal
          book={selected}
          onClose={() => setSelected(undefined)}
          onSave={updateBook}
        />
      )}

      <footer className="text-center p-4 text-sm text-gray-500">
        Made with ❤️ — Zeynep's Reading Tracker
      </footer>
    </div>
  );
};

export default App;