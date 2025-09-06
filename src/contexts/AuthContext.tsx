// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthCtx = {
  user: User | null;
  approved: boolean | null;
  loading: boolean;
  signOutNow: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  approved: null,
  loading: true,
  signOutNow: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      if (!u) {
        setUser(null);
        setApproved(null);
        setLoading(false);
        return;
      }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (!snap.exists() || snap.data().approved !== true) {
        setApproved(false);  // kullanıcı var ama onaysız
        setLoading(false);
        return;
      }
      
      setApproved(true);
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, approved, loading, signOutNow: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
