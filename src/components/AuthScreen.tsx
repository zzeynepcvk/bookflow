import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setMsg("❌ E-posta ve şifre gereklidir");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email: email.trim(),
        approved: false,
        createdAt: serverTimestamp()
      });
      
      setMsg("✅ Kayıt başarılı! Hesabınız onay bekliyor. Onaylanınca giriş yapabileceksiniz.");
      
      // Form alanlarını temizle
      setEmail("");
      setPassword("");
      
    } catch (err: any) {
      console.error("Register error:", err);
      
      // Firebase hata mesajlarını Türkçe'ye çevir
      let errorMessage = "Kayıt sırasında bir hata oluştu";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Bu e-posta adresi zaten kullanılıyor";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Şifre çok zayıf (en az 6 karakter olmalı)";
      }
      
      setMsg(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setMsg("❌ E-posta ve şifre gereklidir");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful:", cred.user.uid);
      
      setMsg("✅ Giriş başarılı! Yönlendiriliyorsunuz...");
      
      // AuthContext otomatik olarak user state'ini güncelleyecek
      // ve App.tsx buna göre yönlendirme yapacak
      
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Firebase hata mesajlarını Türkçe'ye çevir
      let errorMessage = "Giriş sırasında bir hata oluştu";
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Yanlış şifre";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "E-posta veya şifre hatalı";
      }
      
      setMsg(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      onLogin();
    } else {
      onRegister();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Reading Tracker</h1>
          <p className="text-sm text-gray-600 mt-1">
            Kitap okuma deneyiminizi takip edin
          </p>
        </div>
        
        <div className="flex gap-2 justify-center bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMsg("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "login" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMsg("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "register" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              minLength={6}
            />
            {mode === "register" && (
              <p className="text-xs text-gray-500 mt-1">
                Şifreniz en az 6 karakter olmalıdır
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === "login" ? "Giriş yapılıyor..." : "Kayıt oluşturuluyor..."}
              </div>
            ) : (
              mode === "login" ? "Giriş Yap" : "Kayıt Ol"
            )}
          </button>
        </form>

        {msg && (
          <div className={`p-3 rounded-lg text-sm ${
            msg.includes("✅") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {msg}
          </div>
        )}

        {mode === "register" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Not:</strong> Kayıt olduktan sonra hesabınızın yönetici tarafından 
              onaylanmasını beklemeniz gerekecek.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}