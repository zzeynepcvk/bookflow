import React, { useEffect, useState } from "react"
import Header from "./components/Header"
import BookForm from "./components/BookForm"
import BookCard from "./components/BookCard"
import NotesModal from "./components/NotesModal"
import FriendsRecommendations from "./components/FriendsRecommendations"
import type { Book } from "./types"
import * as booksService from "./services/booksService"

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Book | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      const data = await booksService.getBooks()
      setBooks(data)
      setLoading(false)
    }
    fetchBooks()
  }, [])

  const addBook = async (b: Book) => {
    const newBook = await booksService.addBook(b)
    setBooks(prev => [newBook, ...prev])
  }

  const deleteBook = async (id: string) => {
    await booksService.deleteBook(id)
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  const updateBook = async (b: Book) => {
    await booksService.updateBook(b)
    setBooks(prev => prev.map(x => (x.id === b.id ? b : x)))
  }

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase().trim()) ||
    b.author.toLowerCase().includes(query.toLowerCase().trim())
  )

  const stats = {
    total: books.length,
    completed: books.filter(b => (b.pages ? b.readPages >= b.pages : false)).length,
  }

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

          <div className="flex gap-3 flex-col md:flex-row">
            <div className="flex-1">
              <BookForm onAdd={addBook} />
            </div>
            <div className="w-full md:w-80">
              <div className="bg-white p-4 rounded shadow">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by title or author"
                  className="w-full p-2 border rounded"
                />
                <div className="mt-3">
                  <FriendsRecommendations />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No books found — add your first book!
              </div>
            ) : (
              filtered.map(b => (
                <BookCard
                  key={b.id}
                  book={b}
                  onDelete={deleteBook}
                  onUpdate={updateBook}
                  onOpenNotes={book => setSelected(book)}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Reading Summary</h3>
            <div className="text-sm text-gray-600">You have {books.length} saved books.</div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setBooks([])
                  // Firestore’dan da temizle
                  // İstersen ekleyelim
                }}
                className="px-3 py-2 rounded border"
              >
                Clear all
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(books, null, 2))
                  alert("Exported to clipboard")
                }}
                className="px-3 py-2 rounded bg-indigo-600 text-white"
              >
                Export
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
        Made with ❤️ — Book Tracker
      </footer>
    </div>
  )
}

export default App
