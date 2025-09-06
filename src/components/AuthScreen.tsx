// src/components/AuthScreen.tsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onRegister = async () => {
    try {
      setMsg("");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        approved: false,
        createdAt: serverTimestamp()
      });
      // Kayıt sonrası kullanıcıya bilgi ver
      setMsg("Kayıt başarılı. Hesabınız onay bekliyor. Onaylanınca giriş yapabileceksiniz.");
      // Oturumu kapat (AuthContext zaten kontrol ediyor ama burada garanti)
      
    } catch (err: any) {
      setMsg(err.message || "Kayıt hatası");
    }
  }

  const onLogin = async () => {
    try {
      setMsg("");
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext onay kontrolü yapıp onaysızsa oturumu kapatacak
    } catch (err: any) {
      setMsg(err.message || "Giriş hatası");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Reading Tracker</h1>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setMode("login")} className={`px-3 py-2 rounded ${mode === "login" ? "bg-indigo-600 text-white" : "border"}`}>Giriş</button>
          <button onClick={() => setMode("register")} className={`px-3 py-2 rounded ${mode === "register" ? "bg-indigo-600 text-white" : "border"}`}>Kayıt Ol</button>
        </div>
        <input className="w-full border rounded p-2" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={mode === "login" ? onLogin : onRegister} className="w-full bg-blue-600 text-white rounded py-2">
          {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>
        {msg && <p className="text-center text-sm text-gray-600">{msg}</p>}
      </div>
    </div>
  )
}
