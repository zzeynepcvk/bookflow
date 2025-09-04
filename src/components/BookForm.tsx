import React, { useState } from 'react'
import type { Book } from '../types'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onAdd: (b: Book) => void
}

const BookForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState<string>('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const book: Book = {
      id: uuidv4(),
      title: title.trim(),
      author: author.trim() || 'Unknown',
      pages: pages ? Number(pages) : undefined,
      readPages: 0,
      notes: '',
      quotes: [],
      addedAt: new Date().toISOString(),
    }
    onAdd(book)
    setTitle('')
    setAuthor('')
    setPages('')
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" className="col-span-2 p-2 border rounded" />
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" className="p-2 border rounded" />
      </div>
      <div className="flex gap-2">
        <input value={pages} onChange={e => setPages(e.target.value)} placeholder="Pages (optional)" className="p-2 border rounded w-40" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Add Book</button>
      </div>
    </form>
  )
}

export default BookForm
