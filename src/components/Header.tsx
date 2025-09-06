// src/components/Header.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, signOutNow } = useAuth();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">📚 Zeynep's Book Tracker 💖</h1>
        <nav className="flex items-center gap-4">
          <a className="hover:underline cursor-pointer">My Books</a>
          <a className="hover:underline cursor-pointer">Add Book</a>

          {/* Eğer kullanıcı giriş yaptıysa logout butonu */}
          {user && (
            <button
              onClick={async () => {
                if (window.confirm("Çıkış yapmak istediğine emin misin?")) {
                  await signOutNow();
                }
              }}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
