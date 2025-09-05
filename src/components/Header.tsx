import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">📚 Zeynep's Book Tracker 💖</h1>
        <nav className="space-x-4">
          <a className="hover:underline cursor-pointer">My Books</a>
          <a className="hover:underline cursor-pointer">Friends</a>
        </nav>
      </div>
    </header>
  )
}

export default Header