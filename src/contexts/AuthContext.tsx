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
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  approved: null,
  loading: true,
  signOutNow: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log("Auth state changed:", u ? u.email : "No user");
      
      try {
        setLoading(true);
        
        if (!u) {
          console.log("No user, setting states to null");
          setUser(null);
          setApproved(null);
          setLoading(false);
          return;
        }

        console.log("User found, checking approval status...");
        setUser(u);

        // Kullanıcı dökümanını kontrol et
        const userDocRef = doc(db, "users", u.uid);
        const snap = await getDoc(userDocRef);
        
        if (!snap.exists()) {
          console.log("User document does not exist");
          setApproved(false);
          setLoading(false);
          return;
        }

        const userData = snap.data();
        const isApproved = userData.approved === true;
        
        console.log("User approval status:", isApproved);
        setApproved(isApproved);
        
      } catch (error) {
        console.error("Error checking user approval:", error);
        setApproved(false);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const signOutNow = async () => {
    try {
      await signOut(auth);
      // State'leri temizle
      setUser(null);
      setApproved(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, approved, loading, signOutNow }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);