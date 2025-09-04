import React, { useState } from 'react'
import type { Book } from '../types'

type Props = {
  book?: Book
  onClose: () => void
  onSave: (b: Book) => void
}

const NotesModal: React.FC<Props> = ({ book, onClose, onSave }) => {
  const [notes, setNotes] = useState(book?.notes ?? '')
  const [newQuote, setNewQuote] = useState('')
  const [quotes, setQuotes] = useState<string[]>(book?.quotes ?? [])

  if (!book) return null

  const addQuote = () => {
    if (!newQuote.trim()) return
    setQuotes(prev => [...prev, newQuote.trim()])
    setNewQuote('')
  }

  const removeQuote = (i: number) => setQuotes(prev => prev.filter((_, idx) => idx !== i))

  const save = () => {
    onSave({ ...book, notes, quotes })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded max-w-2xl w-full p-4 shadow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Notes — {book.title}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} className="w-full border rounded mt-3 p-2" placeholder="Your notes..." />

        <div className="mt-3">
          <h4 className="font-medium">Quotes</h4>
          <div className="flex gap-2 mt-2">
            <input value={newQuote} onChange={e => setNewQuote(e.target.value)} placeholder="Add quote" className="flex-1 p-2 border rounded" />
            <button onClick={addQuote} className="px-3 py-2 bg-indigo-600 text-white rounded">Add</button>
          </div>
          <ul className="mt-2 list-disc ml-5">
            {quotes.map((q, i) => (
              <li key={i} className="flex justify-between items-start gap-2">
                <div>{q}</div>
                <button onClick={() => removeQuote(i)} className="text-sm text-red-500">remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={save} className="px-3 py-2 rounded bg-indigo-600 text-white">Save</button>
        </div>
      </div>
    </div>
  )
}

export default NotesModal