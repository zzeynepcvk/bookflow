import { useState } from "react";
import { FirebaseError } from "firebase/app";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
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
      
      // Firebase işlemleri burada olacak
      // const cred = await createUserWithEmailAndPassword(auth, email, password);
      // await setDoc(doc(db, "users", cred.user.uid), {
      //   email: email.trim(),
      //   approved: false,
      //   createdAt: serverTimestamp()
      // });
      
      setMsg("✅ Kayıt başarılı! Hesabınız onay bekliyor. Onaylanınca giriş yapabileceksiniz. Acil durumda zeynepcvk21@gmail.com adresine ulaşınnn 💖");
      
      setEmail("");
      setPassword("");
      
    } catch (err) {
      console.error("Register error:", err);
      
      let errorMessage = "Kayıt sırasında bir hata oluştu";
      
      const error = err as FirebaseError;
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Bu e-posta adresi zaten kullanılıyor";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi";
      } else if (error.code === "auth/weak-password") {
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
      
      // Firebase işlemleri burada olacak
      // const cred = await signInWithEmailAndPassword(auth, email, password);
      
      setMsg("✅ Giriş başarılı! Yönlendiriliyorsunuz...");
      
    } catch (err) {
      console.error("Login error:", err);
      
      let errorMessage = "Giriş sırasında bir hata oluştu";
      
      const error = err as FirebaseError;
      if (error.code === "auth/user-not-found") {
        errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı";
      } else if ((err as FirebaseError).code === "auth/wrong-password") {
        errorMessage = "Yanlış şifre";
      } else if ((err as FirebaseError).code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi";
      } else if ((err as FirebaseError).code === "auth/too-many-requests") {
        errorMessage = "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin";
      } else if ((err as FirebaseError).code === "auth/invalid-credential") {
        errorMessage = "E-posta veya şifre hatalı";
      }
      
      setMsg(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "login") {
      onLogin();
    } else {
      onRegister();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 relative overflow-hidden">
      {/* Dekoratif arka plan elementleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-52 h-52 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Kitap ikonları - dekoratif */}
        <span className="absolute top-10 left-10 text-4xl opacity-10 rotate-12">📚</span>
        <span className="absolute bottom-10 right-10 text-4xl opacity-10 -rotate-12">📖</span>
        <span className="absolute top-1/4 right-1/4 text-3xl opacity-10 rotate-45">📕</span>
        <span className="absolute bottom-1/3 left-1/4 text-3xl opacity-10 -rotate-45">📗</span>
      </div>

      <div className="bg-white/95 backdrop-blur-sm w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 relative z-10 border border-pink-100">
        {/* Başlık Alanı */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl shadow-lg mb-3">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Zeynep's Library
          </h1>
          <p className="text-sm text-pink-600 font-medium tracking-wide">
            ✨ Kitap Koleksiyonun ✨
          </p>
          <p className="text-xs text-gray-500 italic">
            "Bir kitap, bir bahçedir cebinizde taşıdığınız" 🌸
          </p>
        </div>
        
        {/* Tab Butonları */}
        <div className="flex gap-2 p-1.5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMsg("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === "login" 
                ? "bg-white text-pink-600 shadow-md transform scale-105" 
                : "text-pink-400 hover:text-pink-500"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <span>🔑</span> Giriş Yap
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMsg("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === "register" 
                ? "bg-white text-pink-600 shadow-md transform scale-105" 
                : "text-pink-400 hover:text-pink-500"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <span>✍️</span> Kayıt Ol
            </span>
          </button>
        </div>

        {/* Form Alanı */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className=" text-sm font-semibold text-pink-700 flex items-center gap-1">
              <span>💌</span> E-posta Adresin
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 bg-pink-50/50 border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 placeholder-pink-300"
                placeholder="kitapsever@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className=" text-sm font-semibold text-pink-700 flex items-center gap-1">
              <span>🔐</span> Şifren
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 bg-pink-50/50 border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 placeholder-pink-300"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>
            {mode === "register" && (
              <p className="text-xs text-pink-500 mt-1 pl-1 flex items-center gap-1">
                <span>💡</span> En az 6 karakter olmalı
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl py-3.5 px-4 font-semibold hover:from-pink-600 hover:to-rose-600 focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                {mode === "login" ? "Giriş yapılıyor..." : "Kayıt oluşturuluyor..."}
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {mode === "login" ? (
                  <>
                    <span>🚪</span> Kitaplığa Gir
                  </>
                ) : (
                  <>
                    <span>🎉</span> Aramıza Katıl
                  </>
                )}
              </span>
            )}
          </button>
        </div>

        {/* Mesaj Alanı */}
        {msg && (
          <div className={`p-4 rounded-2xl text-sm font-medium animate-pulse ${
            msg.includes("✅") 
              ? "bg-green-50 text-green-700 border-2 border-green-200" 
              : "bg-red-50 text-red-700 border-2 border-red-200"
          }`}>
            <div className="flex items-start gap-2">
              <span className="text-lg">{msg.includes("✅") ? "🎊" : "💔"}</span>
              <p className="flex-1">{msg}</p>
            </div>
          </div>
        )}

        {/* Bilgi Notu */}
        {mode === "register" && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">📝</span>
              <div className="flex-1">
                <p className="text-xs text-pink-700 font-medium">
                  <strong>Sevgili Kitapsever,</strong>
                </p>
                <p className="text-xs text-pink-600 mt-1">
                  Kayıt olduktan sonra hesabının onaylanmasını beklemen gerekecek. 
                  Acil durumda <span className="font-semibold">zeynepcvk21@gmail.com</span> adresine ulaş! 💖
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alt Dekoratif Alan */}
        <div className="text-center pt-2">
          <p className="text-xs text-pink-400 italic">
            "Okumak, yaşamaktır" 📖✨
          </p>
        </div>
      </div>
    </div>
  );
}