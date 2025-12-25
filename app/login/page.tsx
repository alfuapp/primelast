'use client';

import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ⭐ KALA SAARIDDA ADMIN-KA IYO MACMIILKA
      if (user.email === "primecare1974@gmail.com") {
        // Haddii uu adiga yahay, toos u gee Admin Dashboard-ka madow
        router.push('/admin');
      } else {
        // Haddii uu macmiil yahay, gee bogga adeegyada
        router.push('/services');
      }
    } catch (err: any) {
      setError("Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-6 font-[Poppins]">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#006d67] p-10 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Kirjaudu sisään</h1>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">PrimeCare Portal</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold italic border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest italic">Sähköposti</label>
            <div className="relative">
              <Mail className="absolute left-5 top-5 text-gray-300" size={20} />
              <input 
                required 
                type="email" 
                placeholder="nimi@email.com"
                className="w-full p-5 pl-14 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#006d67] outline-none font-bold text-gray-700 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest italic">Salasana</label>
            <div className="relative">
              <Lock className="absolute left-5 top-5 text-gray-300" size={20} />
              <input 
                required 
                type="password" 
                placeholder="••••••••"
                className="w-full p-5 pl-14 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#006d67] outline-none font-bold text-gray-700 transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#006d67] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all transform active:scale-95 uppercase italic flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : "KIRJAUDU SISÄÄN →"}
          </button>

          <div className="text-center pt-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase italic">
              Unohditko salasanan? Ota yhteyttä tukeen.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}