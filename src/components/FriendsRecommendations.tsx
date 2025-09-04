import React, { useState } from 'react'

// Minimal friend recommendations UI — uses a simple in-memory list and a "share" action that copies a small message to clipboard.

const sample = [
  { id: 'f1', name: 'Ayşe', suggestion: 'The Midnight Library — Matt Haig' },
  { id: 'f2', name: 'Mehmet', suggestion: 'Sapiens — Yuval Noah Harari' },
]

const FriendsRecommendations: React.FC = () => {
  const [items] = useState(sample)
  const share = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied recommendation to clipboard!')
    } catch {
      alert('Could not copy — try selecting the text')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Friends' Recommendations</h3>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-gray-600">{i.suggestion}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => share(`${i.name} recommends: ${i.suggestion}`)} className="px-3 py-2 rounded bg-indigo-600 text-white">Share</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FriendsRecommendations
