'use client';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Hubi haddii iimaylka la xaqiijiyay (Verification)
      if (!userCredential.user.emailVerified) {
        alert("Vahvista sähköpostisi ennen kirjautumista. Tarkista postilaatikkosi.");
        return;
      }

      router.push('/'); 
    } catch (err: any) {
      setError("Väärä sähköpostiosoite tai salasana.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] px-4">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black mb-2 text-[#006d67] tracking-tighter italic uppercase">Kirjaudu sisään</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">Tervetuloa takaisin PrimeCare-palveluun.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Sähköposti</label>
            <input 
              type="email" 
              placeholder="esimerkki@mail.fi" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] transition-all" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Salasana</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] transition-all" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#005a54] mt-8 transition-all transform active:scale-95">
          KIRJAUDU SISÄÄN →
        </button>

        <p className="mt-6 text-center text-sm text-gray-600 font-medium">
          Eikö sinulla ole vielä tiliä? <a href="/register" className="text-[#E63946] font-bold hover:underline">Rekisteröidy tästä</a>
        </p>
      </form>
    </div>
  );
}