import React from 'react'
import type { Book } from '../types'
import ProgressBar from './ProgressBar'

type Props = {
  book: Book
  onDelete: (id: string) => void
  onUpdate: (b: Book) => void
  onOpenNotes: (b: Book) => void
}

const BookCard: React.FC<Props> = ({ book, onDelete, onUpdate, onOpenNotes }) => {
  const total = book.pages ?? 0
  const progress = total > 0 ? (book.readPages / total) * 100 : 0

  const inc = (n: number) => {
    const next = Math.max(0, Math.min(total || book.readPages + n, book.readPages + n))
    onUpdate({ ...book, readPages: next })
  }

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{book.title}</h3>
          <div className="text-sm text-gray-500">{book.author}</div>
        </div>
        <div className="text-sm text-gray-400">{new Date(book.addedAt).toLocaleDateString()}</div>
      </div>

      <div className="space-y-2">
        <ProgressBar value={progress} />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>{book.readPages} / {book.pages ?? '—'} pages</div>
          <div className="flex gap-2">
            <button onClick={() => inc(-5)} className="px-2 py-1 rounded bg-gray-100">-5</button>
            <button onClick={() => inc(5)} className="px-2 py-1 rounded bg-gray-100">+5</button>
            <button onClick={() => onOpenNotes(book)} className="px-2 py-1 rounded bg-indigo-600 text-white">Notes</button>
            <button onClick={() => onDelete(book.id)} className="px-2 py-1 rounded bg-red-500 text-white">Delete</button>
          </div>
        </div>
      </div>

      {book.quotes && book.quotes.length > 0 && (
        <div className="text-sm text-gray-700">
          <strong>Quotes:</strong>
          <ul className="list-disc ml-5 mt-1">
            {book.quotes.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BookCard
