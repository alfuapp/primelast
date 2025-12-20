'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(''); // 1. Nadiifi wixii error ah oo hore u jiray
  
  try {
    // 2. Is-diiwaangelinta Firebase
    await createUserWithEmailAndPassword(auth, email, password);
    
    // 3. Haddii ay guulaysato, fariinta khaladka ah ha muujin
    setError(''); 
    
    // 4. U gudbi bogga adeegyada
    router.push('/services'); 
  } catch (err: any) {
    // 5. Kaliya halkan ku muuji fariinta khaladka ah
    console.error(err.code);
    if (err.code === 'auth/email-already-in-use') {
      setError("Tämä sähköposti on jo käytössä. Kirjaudu sisään.");
    } else if (err.code === 'auth/weak-password') {
      setError("Salasanan on oltava vähintään 6 merkkiä.");
    } else {
      setError("Rekisteröinti epäonnistui. Tarkista tiedot.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center p-6 font-[Poppins]">
      
      {/* 1. BACK BUTTON */}
      <Link href="/" className="mb-8 flex items-center gap-2 text-[#006d67] font-bold text-sm hover:underline italic">
        <ArrowLeft size={18} /> Takaisin etusivulle
      </Link>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        {/* 2. HEADER SECTION */}
        <div className="bg-[#006d67] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Luo uusi tili</h1>
          <p className="text-white/70 text-xs font-bold mt-2 uppercase">Aloita turvallinen online-asiointi</p>
        </div>

        {/* 3. FORM SECTION */}
        <div className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-[#E63946] p-4 rounded-xl text-xs font-bold border border-red-100 text-center uppercase italic">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Sähköposti</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="esimerkki@mail.com" 
                  className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Salasana</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#E63946] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase italic tracking-widest mt-4"
            >
              {loading ? "REKISTERÖIDÄÄN..." : "REKISTERÖIDY NYT"}
            </button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase italic">Onko sinulla jo tili?</p>
            <Link href="/login" className="block w-full border-2 border-[#006d67] text-[#006d67] py-4 rounded-2xl font-black text-sm hover:bg-[#006d67] hover:text-white transition-all uppercase italic">
              Kirjaudu sisään
            </Link>
          </div>
        </div>

        {/* 4. FOOTER INFO */}
        <div className="bg-gray-50 p-6 flex items-center justify-center gap-3">
          <ShieldCheck size={20} className="text-[#006d67]" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter italic">100% Suojattu ja tietoturvallinen rekisteröinti</span>
        </div>
      </div>
    </div>
  );
}